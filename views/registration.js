class Course{
    constructor(id = null, lecTime = null){
        this.id = id;
        this.lecTime = lecTime;
        this.state = 0;  //state : 0(ok black) 1(fail red) 2(success green) 3(overlapped yellow)
        this.overlap = 0; //성공 중 겹친 course의 개수
        this.sameTime = new Array();
    }
}

class Group{
    constructor (name, firstIdx = null, courses = null){
        this.name = name;
        this.firstIdx = firstIdx;
        this.courses = courses;
        this.cur = null;
        this.state = 0; //state : 0(ok) 1(success, finished)
    }
    getCourse(rank, idx){
        return this.courses.getCourse(rank,idx);
    }
}

class Groups{
    constructor(jsonInput){
        this.data = new Array();
        for(let g = 0; g<jsonInput["numGroups"]; g++){
            const curGroup = jsonInput["groups"][g];
            let courses = new Courses();

            for(let crs = 0; crs < curGroup["numCrs"]; crs++){
                const curCourse = curGroup["courses"][crs];
                courses.push(curCourse["rank"],new Course(curCourse["id"],curCourse["lecTime"]));
            }
            this.push(new Group(curGroup["name"],curGroup["firstIdx"] , courses));
        }
    }

    getLength(){
        return this.data.length;
    }

    getGroup(idx){
        return this.data[idx];
    }
    static str2arrcrsIdx(strIdx){
        const first = strIdx.indexOf(',');
        const second = strIdx.indexOf(',', first+1);
        return {'group':strIdx.substring(0,first), 'rank': strIdx.substring(first+1,second), 'idx': strIdx.substring(second+1)};
    }

    static arr2strcrsIdx(arrIdx){
        let output = arrIdx['group'];
        output += ',';
        output += arrIdx['rank'];
        output += ',';
        output += arrIdx['idx'];
        return output;
    }

    push(group){
        this.data.push(group);
    }

    getCourse(crsIdx){
        if(typeof crsIdx == "string"){
            crsIdx = str2arrcrsIdx(crsIdx);
        }
        return this.getGroup(crsIdx['group']).getCourse(crsIdx['rank'],crsIdx['idx']);
    }
    print(){
        let output = '';
        for(let i =0; i<this.getLength(); i++){
            const curGroup = this.data[i];
            output +=  
                '<div class = "group">' +
                    '<div class = "first">' +
                        '<div class = "groupContainer">' +curGroup.name+'</div>' +
                        '<hr>'+
                        '<div class = "groupContainer">'+
                            '<button class = "course">'+curGroup.courses.getCourse(curGroup.firstIdx[0], curGroup.firstIdx[1]).id+'</button>'+
                        '</div>'+
                        '<div class = "groupContainer">'+
                            '<button class = "success" name ="groupIndex" value = "' + i+ '">성공</button>'+
                            '<button class = "fail" name ="groupIndex" value = "' + i+ '">실패</button>'+
                        '</div>'+
                    '</div>'+
                    '<div class = "others">';
                        
            for(let j = 0; j<3; j++){
                output +='<div class = "groupContainer">';
                for(let k = 0; k< curGroup.courses.getLength(j); k++){
                    output +='<button class = "course" name="crsIndex" value='+[i,j,k]+'>' +curGroup.courses.getCourse(j,k).id+'</button>';
                }
                output += '</div>';
            }
            output += 
                    '</div>' +
                    '</div>';
        }
        return output;
    }
}
class Courses{
    constructor(){
        this.data = new Array(3);
        for(let i =0; i<3; i++){
            this.data[i] = new Array();
        }
        this.size = [0,0,0];
    }
    push(rank, course){
        this.data[rank].push(course);
        this.size[rank]++;
    }
    getLength(rank){
        return this.data[rank].length;
    }
    getCourse(rank, idx){
        return this.data[rank][idx];
    }
}

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

class Undo{
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

class Timetable{
    constructor(){
        this.weekdays = ['월', '화', '수', '목', '금'];
        this.times = ['A', 'B', 'C', 'D', 'E', 'F'];
        this.timetable = new Array(this.weekdays.length);
        this.data = null;
        for(let i = 0; i<this.weekdays.length; i++){
            this.timetable[i] = new Array(this.times.length);
            for(let j = 0; j<this.times.length; j++){
                this.timetable[i][j] = new Array();
            }
        }
    }

    setData(groups){
        this.data = groups;
    }

    determineChar(c){
        if(this.weekdays.includes(c)) return {"type" : "weekdays", "idx" : this.weekdays.indexOf(c)};
        if(this.times.includes(c)) return {"type" : "times", "idx" : this.times.indexOf(c)};
        else return {"type" : false};
    }

    str2arrLecTime(strLecTime){
        let week = -1; //초기화
        let time = -1; //초기화
        let output = new Array();
        for(let c = 0; c < strLecTime.length; c++){//lecTime의 string index
            const result = this.determineChar(strLecTime[c])
            switch(result['type']){
                case "weekdays":
                    if(week == -1 && time == -1){//week와 time 지정되지 않음
                        week = result['idx'];// week 지정
                    }
                    else{//예외 처리
                        console.log(strlecTime+ " syntax is wrong");
                    }
                    break;
                case "times":
                    if(week != -1 && time == -1){//week은 지정됬고 time은 지정되지 않음
                        time = result['idx'];//time 지정 ->week와 time이 결정남
                        if(!output.includes({'week' : week, 'time' : time})){
                            output.push({'week' : week, 'time' : time});
                        }
                        week = -1; //초기화
                        time = -1; //초기화
                    }else{//예외 처리
                        console.log(strLecTime+ " syntax is wrong");
                    }
            }
        }
        return output;
    }

    processOverlap(){ // checkOverlap of total data version
        if(this.data == null) return false;
        const groups = this.data;
        for(let g = 0; g<groups.getLength(); g++){//for each group
            for(let i = 0; i<2; i++){//for each rank
                for(let crs = 0; crs< groups.getGroup(g).courses.data[i].length; crs++){ // for each course
                    const curCourse = this.data.getCourse({'group':g,'rank':i,'idx': crs});
                    const arrLecTime = this.str2arrLecTime(curCourse.lecTime);
                    const result = this.checkOverlap(arrLecTime); // overlap courses crsIdx
                    for(let o = 0; o<result.length; o++){
                        const overlappedCrsIdx = result[o];
                        const overlappedCrs = this.data.getCourse(overlappedCrsIdx);
                        if(!overlappedCrs.sameTime.includes({'group':g,'rank':i,'idx': crs})){
                            overlappedCrs.sameTime.push({'group':g,'rank':i,'idx': crs});
                        }
                        if(!curCourse.sameTime.includes(overlappedCrsIdx)){
                            curCourse.sameTime.push(overlappedCrsIdx);
                        }
                    }
                    for(let t = 0; t<arrLecTime.length; t++){
                        this.timetable[arrLecTime[t]['week']][arrLecTime[t]['time']].push({'group':g,'rank':i,'idx': crs});
                    }
                }
            }
        }
        return true;
    }

    checkOverlap(lecTime){ //find overlap course
        let output = new Array();
        if(typeof lecTime == "string"){
            lecTime = str2arrLecTime(lecTime);
        }
        for(let t = 0; t<lecTime.length; t++){
            const week = lecTime[t]["week"];
            const time = lecTime[t]["time"];
            for(let j  = 0; j<this.timetable[week][time].length; j++){//겹치는 강의를 output에 넣음
                if(!output.includes(this.timetable[week][time][j])){
                    output.push(this.timetable[week][time][j]);
                }
            }
        }
        return output;
    }
    
}

const copyToClipboard = str => {
    const el = document.createElement('textarea');  // Create a <textarea> element
    el.value = str;                                 // Set its value to the string that you want copied
    el.setAttribute('readonly', '');                // Make it readonly to be tamper-proof
    el.style.position = 'absolute';                 
    el.style.left = '-9999px';                      // Move outside the screen to make it invisible
    document.body.appendChild(el);                  // Append the <textarea> element to the HTML document
    const selected =            
      document.getSelection().rangeCount > 0        // Check if there is any content selected previously
        ? document.getSelection().getRangeAt(0)     // Store selection if found
        : false;                                    // Mark as false to know no selection existed before
    el.select();                                    // Select the <textarea> content
    document.execCommand('copy');                   // Copy - only works as a result of a user action (e.g. click events)
    document.body.removeChild(el);                  // Remove the <textarea> element
    if (selected) {                                 // If a selection existed before copying
      document.getSelection().removeAllRanges();    // Unselect everything on the HTML document
      document.getSelection().addRange(selected);   // Restore the original selection
    }
};

$(document).ready(function(){
    //그룹의 정보들을 정리함
    let timetable = new Timetable();
    let undo = new Undo();


    const jsonInput = {
        "numGroups": 2,
        "groups":[
            {
                "name" : "운영체제",
                "firstIdx": [0,0],
                "numCrs": 2,
                "courses": [
                    {
                        "rank": 0,
                        "id": "F028",
                        "lecTime": "수B 금B"
                    },
                    {
                        "rank": 1,
                        "id": "F058",
                        "lecTime": "월C 수C"
                    }
                ]
            },
            {
                "name" : "도분설",
                "firstIdx": [0,0],
                "numCrs": 2,
                "courses": [
                    {
                        "rank": 0,
                        "id": "F001",
                        "lecTime": "월B 수B"
                    },
                    {
                        "rank": 1,
                        "id": "F002",
                        "lecTime": "월C 수B"
                    }
                ]
            },
        ]
    }

    let groups = new Groups(jsonInput);
    timetable.setData(groups);
    timetable.processOverlap();

    console.log(timetable);
    console.log(groups);


    //그룹에 해당하는 것을 보여줌
                
    document.getElementById('content').innerHTML += groups.print();
    
    // course 버튼 클릭 시
    $(".course").click(function(){
        const crsIndex = Groups.str2arrcrsIdx(this.value);
        const curGroup = groups.getGroup(crsIndex["group"]);
        const curCourse = curGroup.getCourse(crsIndex["rank"], crsIndex["idx"]);
        if(curGroup.state == 0){//해당 그룹은 아직 완료 전 상태
            //해당 강의번호 복사
            copyToClipboard(this.innerHTML);

            //그 그룹의 cur를 해당 강의로 변경, cur 강의 색깔 파란색으로
            if(curGroup.cur != null){
                const preCrs = groups.getCourse(curGroup.cur); 
                if(curGroup.state==0){
                    if(preCrs.state == 1){ // fail
                        $('button[value ="' + Groups.arr2strcrsIdx(curGroup.cur) + '"]').css("color", "red");
                    }
                    else if(preCrs.state == 2){ // success
                        $('button[value ="' + Groups.arr2strcrsIdx(curGroup.cur) + '"]').css("color", "green");
                    }
                    else if(preCrs.overlap>0){
                        $('button[value ="' + Groups.arr2strcrsIdx(curGroup.cur) + '"]').css("color", "yellow");
                    }
                    else{
                        $('button[value ="' + Groups.arr2strcrsIdx(curGroup.cur) + '"]').css("color", "black");
                    }
                    
                }
            }
            $(this).css("color", "blue");
            curGroup.cur = crsIndex;
        }
    });

    //success 버튼 클릭 시
    $(".success").click(function(){
        const curGroup = groups.getGroup(this.value);
        if(curGroup.state == 0){
            const curCourse = groups.getCourse(curGroup.cur);
            $('button[value ="' + Groups.arr2strcrsIdx(curGroup.cur) + '"]').css("color", "green");
            curGroup.state = 1;
            curCourse.state = 2;
            
            //겹치는 과목 색깔 노란색으로
            for(let i = 0; i<curCourse.sameTime.length; i++){
                let oCrs = curCourse.sameTime[i];

                groups.getCourse(oCrs).overlap++;
                if(groups.getCourse(oCrs).state == 0){
                    $('button[value ="' + Groups.arr2strcrsIdx(oCrs) + '"]').css("color", "yellow");
                }
            }
        }
    });

    //fail 버튼 클릭 시
    $(".fail").click(function(){
        const curGroup = groups.getGroup(this.value);
        const curCourse = groups.getCourse(curGroup.cur);
        if(curGroup.state == 0){
            $('button[value ="' + Groups.arr2strcrsIdx(curGroup.cur) + '"]').css("color", "red");
            curCourse.state = 1;
        }
    });
})
