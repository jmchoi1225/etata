class Stack{
    constructor(capacity){
        this.capacity = capacity;
        this.stack = new Array(capacity);
        this.size = 0;
        this.begin = 0;
        this.end = 0;
    }
    getIdx(idx){
        if(0<=idx && idx<this.capacity) return idx;
        else if(this.capacity<=idx) return idx%(this.capacity);
        else if(idx<0){
            let tmp = this.capacity;
            while(tmp < -idx) tmp *= 2;
            return (idx+tmp)%(this.capacity+1);
        }
    }
    clear(){
        this.size = 0;
        this.begin = 0;
        this.end = 0;
    }
    empty(){
        return this.size == 0;
    }
    full(){
        return this.size == this.capacity;
    }
    pop(){
        if(!this.empty()){
            this.end = this.getIdx(this.end-1);
            this.size--;
            return this.stack[this.end];
        }
        else return false;
    }
    push(value){//when full, bottom item is removed
        if(this.full()){
           this.begin = this.getIdx(this.begin+1);
        }
        else{
            this.size++;
        }
        this.stack[this.getIdx(this.end)] = value;
        this.end = this.getIdx(this.end+1);
    }
    back(){
        if(!this.empty()){
            return this.stack[this.getIdx(this.end-1)];
        }
        else return false;
    }
}

export default class Undo{
    constructor(){
        this.capacity = 5;
        this.undoStack = new Stack(this.capacity);
        this.redoStack = new Stack(this.capacity);
    }
    add(item){
        this.undoStack.push(item);
        this.redoStack.clear();
    }
    undo(){
        if(this.undoStack.empty()){
            console.log("Undo를 할 수 없습니다.");
            return false;
        } 
        let item = this.undoStack.pop();
        this.execute(item, true);
        this.redoStack.push(item);
        return true;
    }
    redo(){
        if(this.redoStack.empty()){
            console.log("Redo를 할 수 없습니다.");
            return false;
        } 
        let item = this.redoStack.pop();
        this.execute(item, false);
        this.undoStack.push(item);
        return true;
    }
    execute(item, undo){
        console.log("need to implement execute");
    }
}