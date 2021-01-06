// 暂废弃

// 求值的复杂表达式
const str = "3-7+3*5*2*(2+(4+3*2*4*2-2-8+1)*2*2)-2*2+(1/2.5+1)*3"; // 5216.2

// 用于打印正确的答案，好比较是否正确,式子要和上面str一样，只是没有双引号
const _str =
    3 -
    7 +
    3 * 5 * 2 * (2 + (4 + 3 * 2 * 4 * 2 - 2 - 8 + 1) * 2 * 2) -
    2 * 2 +
    (1 / 2.5 + 1) * 3;

// 如果是减法或除法，第一个是被减数/被除数

class Compute {
    handleCalculation(numArr, num1, num2, char) {
        if (char == "+") {
            numArr.push(num1 + num2);
        } else if (char == "-") {
            numArr.push(num1 - num2);
        } else if (char == "*") {
            numArr.push(num1 * num2);
        } else if (char == "/") {
            numArr.push(num1 / num2);
        } else if (char == "%") {
            numArr.push(num1 % num2);
        }
    }
    isPop(char1, char2) {
        if ((char1 == "+" || char1 == "-") && (char2 == "+" || char2 == "-"))
            return true;
        if ((char1 == "+" || char1 == "-") && (char2 == "*" || char2 == "/"))
            return true;
        if ((char1 == "*" || char1 == "/") && (char2 == "*" || char2 == "/"))
            return true;
        if ((char1 == "*" || char1 == "/") && (char2 == "+" || char2 == "-"))
            return false;
    }
    do(str = "") {
        // 分割字符串
        let arr = [];
        for (let i = 0; i < str.length; i++) {
            let t = str.charAt(i);
            let v = t;
            if (/[\d|\.]/.test(t + "")) {
                let j = i;
                for (; j < str.length; j++) {
                    let m = str.charAt(j);
                    if (!/[\d|\.]/.test(m + "")) {
                        break;
                    }
                }
                v = str.slice(i, j);
                if (j > i) {
                    i = j - 1;
                }
                v = +v;
            }
            arr.push(v);
        }

        let charArr = [],
            numArr = [];
        for (let i = 0; i < arr.length; i++) {
            if (typeof arr[i] == "number") {
                numArr.push(arr[i]);
            } else {
                if (charArr.length) {
                    // 关键步骤1
                    // 这里如果当前的字符的优先级比栈顶的优先级低或相等，
                    // 存储字符的栈要一直出栈直到栈为空或当前的字符的优先级比栈顶的优先级高，
                    while (this.isPop(arr[i], charArr[charArr.length - 1])) {
                        let t2 = numArr.pop();
                        let t1 = numArr.pop();
                        let char = charArr.pop();
                        this.handleCalculation(numArr, t1, t2, char);
                    }
                    if (arr[i] == ")") {
                        let st = charArr[charArr.length - 1];
                        // 关键步骤2
                        // 遇到右括号也要一直出栈，直到遇到左括号，要注意边界问题
                        while (st != "(") {
                            let t1, t2;
                            let char = charArr.pop();
                            if (char != "(") {
                                t2 = numArr.pop();
                                t1 = numArr.pop();
                            }
                            this.handleCalculation(numArr, t1, t2, char);
                            st = char;
                        }
                    }
                    if (arr[i] != ")") {
                        charArr.push(arr[i]);
                    }
                } else {
                    // 关键步骤3
                    // 数字直接进栈
                    charArr.push(arr[i]);
                }
            }
        }
        // 关键步骤4
        // 最后字符栈如果还有字符，要一直出栈直到为空
        while (charArr.length) {
            let t2 = numArr.pop();
            let t1 = numArr.pop();
            let char = charArr.pop();
            this.handleCalculation(numArr, t1, t2, char);
        }
        return numArr[0];
    }
}
let c = new Compute();
console.log("formula: " + str); // 算式
console.log("result: " + c.do(str)); // 程序计算结果
console.log("正确结果，如果和上面result相等，表明程序正确: " + _str); // 判断程序计算结果是否正确
