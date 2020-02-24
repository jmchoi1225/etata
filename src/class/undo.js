class Stack{
    constructor(capacity){
        this.capacity = capacity;
        this.items = new Array(capacity+1);
        this.size = 0;
        this.begin = 0;
        this.end = 0;
    }
    getIdx(idx){
        if(0<=idx && idx<capacity+1) return idx;
        else if(this.capacity+1<=idx) return idx%(this.capacity+1);
        else if(idx<0){
            let tmp = capacity+1;
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
            end = getIdx(end-1);
            this.size--;
            return this.stack[end];
        }
        else return false;
    }
    push(value){//when full, bottom item is removed
        if(this.full()){
           this.begin = getIdx(begin+1);
        }
        else{
            this.size++;
        }
        this.stack[getIdx(this.end)] = value;
        this.end = getIdx(this.end+1);
    }
    back(){
        if(!this.empty()){
            return this.stack[getIdx(end-1)];
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
    execute(crsIdx, success, undo){ //success : true(success) false(fail) undo: true(undo) false(redo) 
        //need to write code
    }
    undo(){
        if(this.undoStack.empty()){
            console.log("Undo를 할 수 없습니다.");
            return false;
        } 
        let item = this.undoStack.pop();
        //undo 처리
        this.redoStack.push(item);
    }
    redo(){
        if(this.redoStack.empty()){
            console.log("Redo를 할 수 없습니다.");
            return false;
        } 
        let item = this.redoStack.pop();
        //redo 처리
        this.undoStack.push(item);
    }
}