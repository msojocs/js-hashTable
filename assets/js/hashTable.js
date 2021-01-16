const seed = new Date().getTime(); // 伪随机种子，当次运行时为定值，用于伪随机搜索
class HashTable {
    /**
     * 哈希表对象构造函数
     *
     * @param length 哈希表长度
     * @param create 构造类型[DA, , , , MOD]
     * @param collision 冲突处理类型[OA(OALine|OASecond|OARand), RH, ListAddr, OverAddr]
     */
    constructor(length = 11, create = "directAddr", collision = "dv1") {
        // 初始化哈希表
        this.storage = [];
        for (var i = 0; i < length; i++) this.storage[i] = null;
        // 哈希表元素填充计数
        this.use = 0;
        // 哈希表长
        this.length = length;
        // 构造方法
        this.createMethod = create;
        // 直接定址法 Hkey = a * key + b
        this.a = 1;
        this.b = 0;
        // 冲突处理方法
        this.collisionMethod = collision;
        // 除留取余法
        this.p = 13;
        // 溢出区
        this.over = null;
        // 伪随机种子
        this.randSeed = HashTable.seed; // 变化值，产生伪随机序列
        // 再哈希函数列表
        this.exps = [];
        // 动画队列
        this.queue = new SingleList();
    }

    // 直接定址法 Hkey = a * key + b
    setAB(a = 1, b = 0) {
        this.a = a;
        this.b = b;
    }

    // 再哈希函数
    setReHashExp(exps) {
        this.exps = exps;
    }

    //
    setP(p) {
        this.p = p;
    }
    // 重置伪随机种子
    resetRandSeed() {
        this.randSeed = seed;
    }

    toString() {
        if ("object" === typeof this.storage) {
            let ret = [];
            this.storage.forEach((ele) => {
                if (ele) ret.push(ele.toString());
                else ret.push("");
            });
            return ret;
        }
        return this.storage.toString();
    }

    // 哈希函数调用
    hashFunc(key) {
        return this["HF_" + this.createMethod](key);
    }

    // 填入调用
    push(key, value = null) {
        // TODO:溢出检测，待完善
        if (this.use >= this.length) return false;

        if (!value) value = key;
        let Hkey = this.hashFunc(key);

        if ("directAddr" === this.createMethod) {
            // 直接定址法无冲突，直接填入
            this.pushDA(Hkey, value);
            return;
        }

        switch (this.collisionMethod) {
            // 开放定址法
            case "OALine":
            case "OASecond":
                this.pushOA(Hkey, key, value);
                break;
            case "OARand":
                this.resetRandSeed();
                this.pushOA(Hkey, key, value);
                break;
            // 再哈希
            case "reHash":
                this.pushReHash(Hkey, key, value);
                break;
            // 链地址
            case "ListAddr":
                this.pushListAddr(Hkey, value);
                break;
            // 溢出区
            case "overArr":
                this.pushOverArr(Hkey, value);
                break;
            case "overList":
                this.pushOverList(Hkey, value);
                break;
            default:
                console.log("未识别的冲突处理方法");
                break;
        }
        this.use++;
    }

    // 直接定址法填入元素
    pushDA(Hkey, value) {
        this.storage[Hkey] = value;
        this.queue.append(Hkey + "," + value);
    }
    // 开放地址填入元素
    pushOA(Hkey, key, value = key) {
        let d = 1;
        console.log(key, "Hkey->", Hkey);
        while (
            null !== this.storage[Hkey] &&
            undefined !== this.storage[Hkey]
        ) {
            // Hkey地址被占用
            Hkey = this.collisionOA(key, d++);
            console.log("冲突了--新Hkey->", Hkey);
            // throw new Error("");
        }
        this.storage[Hkey] = value;
        this.queue.append(Hkey + "," + value);
    }

    // 再哈希
    pushReHash(Hkey, key, value) {
        let d = 0;
        while (
            Hkey &&
            null !== this.storage[Hkey] &&
            undefined !== this.storage[Hkey]
        ) {
            // 被占用
            Hkey = this.CF_reHash(key, d++);
        }
        if (Hkey) {
            this.storage[Hkey] = value;
            this.queue.append(Hkey + "," + value);
        }
    }
    // 链地址法填入
    pushListAddr(Hkey, key) {
        var pos = 1;
        if (null === this.storage[Hkey] || undefined === this.storage[Hkey]) {
            this.storage[Hkey] = new SingleList();
            this.storage[Hkey].append(key);
        } else {
            // 有序插入
            let currNode = this.storage[Hkey].head;
            while (currNode.next && currNode.next.data < key) {
                pos++;
                currNode = currNode.next;
            }
            this.storage[Hkey].insert(currNode.data, key);
        }
        this.queue.append("listAddr," + Hkey + "," + pos + "," + key);
    }

    // 公共溢出区填入[顺序]
    pushOverArr(Hkey, value) {
        console.log(value, "Hkey->", Hkey);
        if (null !== this.storage[Hkey] && undefined !== this.storage[Hkey]) {
            // 冲突
            if (this.over === null) this.over = [];
            console.log("冲突！填入溢出区 ", this.over.toString());
            var i = 0;
            
            for (; i < this.over.length; i++) {
                if (
                    this.over[i] < value &&
                    this.over[i + 1] &&
                    this.over[i + 1] > value
                ) {
                    this.over.splice(i + 1, 0, value);
                    i++;
                    break;
                }
            }
            if (i === this.over.length) this.over.push(value);
            
            this.queue.append("overArr," + value + "," + i);
        } else {
            // 无冲突
            this.storage[Hkey] = value;
            this.queue.append(Hkey + "," + value);
        }
    }
    
    // 公共溢出区填入[链式]
    pushOverList(Hkey, value) {
        console.log(value, "Hkey->", Hkey);
        if (null !== this.storage[Hkey] && undefined !== this.storage[Hkey]) {
            // 冲突了
            console.log("冲突！填入溢出区");
            if (this.over === null) {
                this.over = new SingleList();
                this.over.append(value);
                this.queue.append("overList," + value + ",0");
            } else {
                // 有序插入
                let currNode = this.over.head;
                var i = 0;
                while (currNode.next && currNode.next.data < value) {
                    i++;
                    currNode = currNode.next;
                }
                console.log(Hkey, value);
                this.over.insert(currNode.data, value);
                this.queue.append("overList," + value + "," + i);
            }
        } else {
            // 无冲突
            this.storage[Hkey] = value;
            this.queue.append(Hkey + "," + value);
        }
    }

    /**
     * 搜索
     *
     * @param {*} key 待查找关键字
     * @returns {list} [[Hkey, value], cmpCnt, mark]
     */
    search(key) {
        let Hkey = this.hashFunc(key);
        // console.log('Hkey-->', Hkey);
        switch (this.createMethod) {
            case "directAddr":
                // 直接定址法无冲突，直接返回
                return this.searchDA(Hkey);
            default:
                break;
        }

        switch (this.collisionMethod) {
            // 开放定址法
            case "OALine":
            case "OASecond":
                return this.searchOA(Hkey, key);
                break;
            case "OARand":
                this.resetRandSeed();
                return this.searchOA(Hkey, key);
                break;
            // 链地址
            case "ListAddr":
                return this.searchListAddr(Hkey, key);
                break;
            // 再哈希
            case "reHash":
                return this.searchReHash(Hkey, key);
                break;
            // 溢出区
            case "overArr":
            case "overList":
                return this.searchOver(Hkey, key);
                break;
            default:
                console.log("未识别的冲突处理方法");
                break;
        }
    }
    // 直接定址法搜索
    searchDA(Hkey) {
        if (this.storage[Hkey]) return [[Hkey, this.storage[Hkey]], 1];
        else return false;
    }
    // 开放地址法搜索
    searchOA(Hkey, key) {
        // 算哈希地址
        let d = 1;
        console.log("Hkey", Hkey);
        while (key != this.storage[Hkey]) {
            // Hkey地址元素不正确
            Hkey = this.collisionOA(key, d++);
            console.log("New Hkey->", Hkey);
            if (undefined === this.storage[Hkey] || null === this.storage[Hkey])
                return false;
        }
        return [[Hkey, this.storage[Hkey]], d];
    }
    // 链地址法搜索
    searchListAddr(Hkey, key) {
        let currNode = this.storage[Hkey];
        if (!currNode) return false;
        currNode = currNode.head;
        var i = 0;
        while (currNode && key !== currNode.data) {
            i++;
            currNode = currNode.next;
        }
        if (currNode) {
            return [[Hkey, i, key], i];
        } else return false;
    }
    // 再哈希
    searchReHash(Hkey, key) {
        let d = 0;
        while (Hkey && key !== this.storage[Hkey]) {
            // 值不匹配
            Hkey = this.CF_reHash(key, d++);
        }
        if (Hkey) {
            return [[Hkey, this.storage[Hkey]], 0];
        }
    }
    // 溢出区
    searchOver(Hkey, key) {
        if (key === this.storage[Hkey]) return [[Hkey, key], 0];
        if (ht.over instanceof SingleList) {
            let result = this.over.find(key);
            if (result)
                return [[result[0] - 1, result[1].data], result[0], "over"];
            return false;
        }
        // let index = this.over.indexOf(key);
        // if (-1 !== index) return [[index, key], index + 1, "over"];
        let cnt = 0;
        let low = 0;
        let high = this.over.length - 1;
        while(low <= high){
            cnt++;
            let mid = parseInt((low + high) / 2);
            console.log('mid', mid)
            if(key === this.over[mid])
            {
                return [[mid, key], cnt, "over"]
            }
            if(this.over[mid] < key)low = mid + 1;
            else high = mid - 1;
        }
        return false;
    }

    // ==============构造=============
    /**
     * 直接定址法
     *
     * @param {*} key 关键字
     * @return {number} 哈希地址
     */
    HF_directAddr(key) {
        let Hkey = this.a * key + this.b;
        return Hkey;
    }

    /**
     * 数字分析法(学号)
     *
     * @param {*} key 关键字
     * @return {number} 地址
     */
    HF_digitAnalyze(key) {
        key = key.substr(-3);
        // throw new Error("")
        return parseInt(key) % this.length;
    }

    /**
     * 平方取中法（BASIC标识符）
     *
     * @param {*} key 关键字
     * @return {number} 哈希地址
     */
    HF_square(key) {
        var dict = {};
        // 生成字典，26个大写英文字母对应8进制数字 A-1|B-2|...
        for (var i = 0; i < 26; i++) {
            dict[String.fromCharCode(65 + i)] = (i + 1).toString(8);
        }
        // 追加字典，10个十进制数对应8进制数 0-60|1-61|...
        for (var i = 0; i < 9; i++) {
            dict[i] = (i + 48).toString(8);
        }
        key = key.split("");
        key.forEach((ele, i) => {
            key[i] = dict[ele];
        });
        // 单个字母末尾追加00
        if (key.length == 1) key.push("00");
        // 拼接为8进制数
        key = parseInt(key.join(""));
        // 8进制平方（转为10进制平方后转为8进制）
        key = Math.pow(parseInt(key, 8), 2).toString(8);
        // 取从右往左数第 4、5、6位 的数
        key = key.substring(0, key.length - 3).substr(-3);
        // throw new Error("")
        return key % this.length;
    }

    /**
     * 折叠法（ISBN）
     *
     * @param {*} key 关键字
     * @param {*} mode 模式： 0 普通型 | 1 S型
     *
     * @return {number} 哈希地址
     */
    HF_fold(key = "", mode = 1) {
        key = key.replaceAll("-", "");
        let d = this.length.toString().length;
        let part = [];
        while (key) {
            part.push(key.substr(-d));
            key = key.substring(0, key.length - d);
        }
        let sum = 0;
        for (let index = 0; index < part.length; index++) {
            let ele = part[index];
            if (mode === 1 && index % 2 === 1) {
                ele = ele.split("").reverse().join("");
            }
            sum += parseInt(ele);
        }
        return sum % Math.pow(10, d);
    }

    /**
     * 除留取余法
     *
     * @param {*} key 关键字
     * @return {number} 哈希地址
     */
    HF_mod(key) {
        return key % this.p;
    }
    // ==============构造END=============

    /**
     * 冲突处理-开放定址法（包含三个子项）
     *
     * @param {*} key 关键字
     * @param {number} d 采用冲突因子的序号，理论为递增
     *
     * @return {number} 哈希地址
     */
    collisionOA(key, d = 1) {
        let Hkey =
            (this.hashFunc(key) + this["CF_" + this.collisionMethod](d)) %
            this.length;
        if (Hkey < 0) return this.length + Hkey;
        return Hkey;
    }

    // -----------开放定址法----------
    /**
     * 线性探测再散列
     *
     * i 1, 2, 3 ...
     */
    CF_OALine(i) {
        return i;
    }
    /**
     * 二次探测再散列
     *
     * @param {*} i 1, 2, 3 ...
     * @return {number} 哈希地址[冲突处理后]
     */
    CF_OASecond(i) {
        return (
            parseInt((i + 1) / 2) *
            parseInt((i + 1) / 2) *
            parseInt(Math.pow(-1, i - 1))
        );
    }
    /**
     * 伪随机
     *
     * @param {*} round 范围：表长
     * @return {number} 哈希地址[冲突处理后]
     */
    CF_OARand(round) {
        return this.rand(this.length);
    }
    rnd() {
        this.randSeed = (this.randSeed * 9301 + 49297) % 233280; //为何使用这三个数?
        return this.randSeed / 233280.0;
    }
    rand(number) {
        // 此实例中，number应为（表长）
        return Math.ceil(this.rnd() * number);
    }
    // -----------开放定址法END----------

    /**
     * 再哈希
     *
     * @param {*} key 关键字
     * @param {*} d 要采用的新哈希函数的序号
     *
     * @return {number} 哈希地址[冲突处理后]
     */
    CF_reHash(key, d) {
        let exp = this.exps[d];
        if (d > this.exps.length - 1) return false;
        exp = exp.replace("key", parseInt(key));
        console.log("exp--->", exp);
        console.log("-->", eval(exp));
        return eval(exp);
    }
}

// ------------------test area---------------测试区域--------------test area---------------测试区域--------------//
// let data = [19, 14, 23, 01, 68, 20, 84, 27, 55, 11, 10, 79];

// console.log(data);

/**
 * 哈希表
 *
 * @param length 长度
 * @param createMethod 构造函数[DA, , , , MOD]
 * @param collisionMethod 冲突处理函数[OA(OALine|OASecond|OARand), RH, ListAddr, OverAddr]
 */
// let ht = new HashTable(16, "mod", "ListAddr");

// data.forEach((element) => {
//     ht.push(element);
// });
// console.log(ht.storage);
// // console.log(ht.searchOA(1));
// ht.storage.forEach(element => {
//     // console.log(element)
//     if(element)
//     element.display()
// });
