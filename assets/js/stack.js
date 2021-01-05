class StackNode{
    constructor(data) {
        this.data = data;  // 节点的数据域
        this.next = null;  // 节点的指针域
    }
}

class Stack{
    constructor(){
        let sNode = new StackNode('base');

        this.top = this.base = sNode;
    }

    // 压栈
    push(ele){
        let newNode = new StackNode(ele);
        newNode.next = this.top;
        this.top = newNode;
    }

    // 出栈
    pop(){
        if(this.top === this.base)return null;

        let ele = this.top;
        this.top = this.top.next;
        return ele;
    }

    // 取栈顶元素
    getTop(){
        if(this.top === this.base)return null;

        return this.top;
    }

    // 是否空栈
    isEmpty()
    {
        return this.top === this.base;
    }

    // 清空
    clear(){
        this.top = this.base;
    }

    // 显示
    display()
    {
        let currNode = this.top;
        let ret = ''
        while(currNode !== this.base)
        {
            ret += currNode.data;
            currNode = currNode.next
            if(currNode !== this.base)
                ret += '->'
        }
        console.log(ret)
    }
}

// let s = new Stack();
// console.log(s);
// s.push(1)
// s.push(2)
// s.push(3)
// console.log(s.pop())
// s.push(4)
// s.display()
