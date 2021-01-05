class ListNode {
    constructor(data) {
        this.data = data;  // 节点的数据域
        this.prev = null;  // 节点的指针域
        this.next = null;  // 节点的指针域
    }
}

class SingleList {
    constructor(){
        this.size = 0;  // 单链表长度
        this.head = new ListNode('head');   // 表头结点
        this.currNode = '';     // 当前结点指向
    }

    // 在单链表中寻找item元素
    find(item){
        let currNode = this.head;

        while (currNode && item !== currNode.data) {
            currNode = currNode.next;
        }

        return currNode;
    }

    // 向单链表插入元素
    insert(item, ele){
        let itemNode = this.find(item);

        if(!item)return;

        let newNode = new ListNode(ele);

        newNode.next = itemNode.next
        itemNode.next = newNode;

        this.size++;
    }

    // 从单链表中删除一个节点
    remove(item){
        let currNode = this.head;

        // 指针指向最后一个节点 或 找到时退出
        while(currNode.next && item !== currNode.next.data){
            currNode = currNode.next;
        }

        if(currNode.next){
            // 找到
            currNode.next = currNode.next.next;
            this.size--;
        }else{
            // 没找到
            return;
        }
    }

    // 在单链表尾部追加元素
    append(ele){
        let newNode = new ListNode(ele);
        let currNode = this.findLast();

        currNode.next = newNode;
        this.size++;
    }

    // 获取单链表最后一个节点
    findLast(){
        let currNode = this.head;

        while (currNode.next) {
            currNode = currNode.next;
        }

        return currNode;
    }

    // 判断单链表是否为空
    isEmpty(){
        return 0 === this.size;
    }

    // 显示当前节点
    show(){
        console.log(this.currNode.data);
    }

    // 获取单链表长度
    getLength()
    {
        return this.size;
    }

    // 从当前节点向后移动n个位置
    advance(n, currNode = this.head){
        this.currNode = currNode;

        while(n-- && this.currNode.next){
            this.currNode = this.currNode.next;
        }

        return this.currNode;
    }

    toString(){
        let ret = '';
        let currNode = this.head;

        while(currNode){
            ret += currNode.data;
            currNode = currNode.next;
            if(currNode)
                ret += '->';
        }
        return ret;
    }

    // 单链表遍历显示
    display(){
        let ret = '';
        let currNode = this.head;

        while(currNode){
            ret += currNode.data;
            currNode = currNode.next;
            if(currNode)
                ret += '->';
        }

        console.log(ret)
    }

    // 清空链表
    clear()
    {
        this.head.next = null;
        this.size = 0;
    }
}

// let myList = new SingleList();
// let arr = [3, 4, 5, 6, 7, 8, 9];

// for(let i=0; i<arr.length; i++){
//     myList.append(arr[i]);
// }

// myList.display();

// myList.insert(9, 9.1);
// myList.insert(3, 3.1);
// myList.display();

// myList.remove(9.1);
// myList.remove(3);
// myList.display();

// console.log(myList.findLast());  // Node {data: 9, prev: null, next: null}

// console.log(myList.advance(4));  // Node {data: 6, prev: null, next: Node}