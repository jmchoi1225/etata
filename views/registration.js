class Course{
    constructor(id = null, lecTime = null){
        this.id = id;
        this.lecTime = lecTime;
        this.state = 0;  //state : 0(ok black) 1(fail red) 2(success green)
        this.overlap = 0; //성공 중 겹친 course의 개수
        this.sameTime = new Array();
    }
    changeState(state){
        this.state = state;
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
    changeCur(course){
        this.cur = course;
    }
    changeState(state){
        this.state = state;
    }
}

//그룹의 정보들을 정리함
const weekdays = ['월', '화', '수', '목', '금'];
const times = ['A', 'B', 'C', 'D', 'E', 'F'];
let timetable = createTimetable();

const jsonInput = {
    "numGroups": 2,
    "groups":[
        {
            "name" : "운영체제",
            "firstIdx": [0,0],
            "numCrs": 2,
            "courses": [
                {
                    "preference": 0,
                    "id": "F028",
                    "lecTime": "수B 금B"
                },
                {
                    "preference": 1,
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
                    "preference": 0,
                    "id": "F001",
                    "lecTime": "월B 수B"
                },
                {
                    "preference": 1,
                    "id": "F002",
                    "lecTime": "월C 수B"
                }
            ]
        },
    ]
}

let groups = processData(jsonInput);
checkOverlap();



//그룹에 해당하는 것을 보여줌
for(let i =0; i<groups.length; i++){
    const curGroup = groups[i];
    var insertNode =  
        '<div class = "group">' +
            '<div class = "first">' +
                '<div class = "groupContainer">' +curGroup.name+'</div>' +
                '<hr>'+
                '<div class = "groupContainer">'+
                    '<button class = "course">'+curGroup.courses[curGroup.firstIdx[0]][curGroup.firstIdx[1]].id+'</button>'+
                '</div>'+
                '<div class = "groupContainer">'+
                    '<button class = "success" name ="groupIndex" value = "' + i+ '">성공</button>'+
                    '<button class = "fail" name ="groupIndex" value = "' + i+ '">실패</button>'+
                '</div>'+
            '</div>'+
            '<div class = "others">';
                
    for(let j = 0; j<3; j++){
        insertNode +='<div class = "groupContainer">';
        for(let k = 0; k< curGroup.courses[j].length; k++){
            insertNode +='<button class = "course" name="crsIndex" value='+[i,j,k]+'>' +curGroup.courses[j][k].id+'</button>';
        }
        insertNode += '</div>';
    }
    insertNode += 
            '</div>' +
        '</div>';
            
    document.getElementById('content').innerHTML += insertNode;
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

function getIndex(crsIndex){
    const first = crsIndex.indexOf(',');
    const second = crsIndex.indexOf(',', first+1);
    return [crsIndex.substring(0,first), crsIndex.substring(first+1,second),crsIndex.substring(second+1)];
}

function processData(jsonInput){
    let groups = new Array();
    for(let g = 0; g<jsonInput["numGroups"]; g++){
        let other = createCourses();
        //add courses temporary
        for(let crs = 0; crs < jsonInput["groups"][g]["numCrs"]; crs++){
            other[jsonInput["groups"][g]["courses"][crs]["preference"]].push(new Course(jsonInput["groups"][g]["courses"][crs]["id"],jsonInput["groups"][g]["courses"][crs]["lecTime"]));
        }
        groups.push(new Group(jsonInput["groups"][g]["name"],jsonInput["groups"][g]["firstIdx"] , other));
    }
    return groups;
}

function checkOverlap(){
    for(let g = 0; g<groups.length; g++){//for every group
        for(let i = 0; i<2; i++){//for each preference
            for(let crs = 0; crs< groups[g].courses[i].length; crs++){ // for each course
                let week = -1; //초기화
                let time = -1; //초기화
                for(let c = 0; c < groups[g].courses[i][crs].lecTime.length; c++){//lecTime의 string index
                    if(times.includes(groups[g].courses[i][crs].lecTime[c])){//A,B,C,D,E,F 중 1개
                        if(week != -1 && time == -1){//week은 지정됬고 time은 지정되지 않음
                            time = times.indexOf(groups[g].courses[i][crs].lecTime[c]);//time 지정 ->week와 time이 결정남
                            for(let j  = 0; j<timetable[week][time].length; j++){//해당 시간대에 겹치는 강의들 겹친다고 표기
                                o = timetable[week][time][j];
                                if(!groups[o[0]].courses[o[1]][o[2]].sameTime.includes([g,i,crs])){
                                    groups[o[0]].courses[o[1]][o[2]].sameTime.push([g,i,crs]);
                                }
                                if(!groups[g].courses[i][crs].sameTime.includes(o)){
                                    groups[g].courses[i][crs].sameTime.push(o);
                                }
                            }
                            timetable[week][time].push([g,i,crs]);
                            week = -1; //초기화
                            time = -1; //초기화
                        }
                        else{//예외 처리
                            console.log([g,i,crs]+ " syntax is wrong");
                            console.log(groups[g].courses[i][crs].lecTime[c]);
                        }
                        
                    }
                    else if(weekdays.includes(groups[g].courses[i][crs].lecTime[c])){//월, 화, 수, 목, 금 중 1개
                        if(week == -1 && time == -1){//week와 time 지정되지 않음
                            week = weekdays.indexOf(groups[g].courses[i][crs].lecTime[c]);// week 지정
                        }
                        else{//예외 처리
                            console.log([g,i,crs]+ " syntax is wrong");
                            console.log(groups[g].courses[i][crs].lecTime[c]);
                        }
                    }
                }
            }
        }
    }
}

function createTimetable(){
    let timetable = new Array(5);
    for(let i = 0; i<5; i++){
        timetable[i] = new Array(6);
        for(let j = 0; j<6; j++){
            timetable[i][j] = new Array();
        }
    }
    return timetable;
}

function createCourses(){
    const other = new Array(3);
    for(let i =0; i<3; i++){
        other[i] = new Array();
    }
    return other;
}


$(document).ready(function(){
    
    // course 버튼 클릭 시
    $(".course").click(function(){
        const crsIndex = getIndex(this.value);
        if(groups[crsIndex[0]].state == 0){
            //해당 강의번호 복사
            copyToClipboard(this.innerHTML);

            //그 그룹의 cur를 해당 강의로 변경
            if(groups[crsIndex[0]].cur != null){
                if(groups[crsIndex[0]].courses[crsIndex[1]][crsIndex[2]].state==0){
                    $('button[value ="' + groups[crsIndex[0]].cur + '"]').css("color", "black");
                }
            }
            $(this).css("color", "blue");
            groups[crsIndex[0]].changeCur(crsIndex);
        }
    });

    //success 버튼 클릭 시
    $(".success").click(function(){
        const gIndex = this.value;
        const crsIndex =  groups[gIndex].cur;
        $('button[value ="' + groups[gIndex].cur + '"]').css("color", "green");
        groups[gIndex].changeState(1);
        groups[gIndex].courses[crsIndex[0]][crsIndex[1]].changeState(2);
        
        //겹치는 과목 색깔 노란색으로
        for(let i = 0; i<groups[gIndex].courses[crsIndex[0]][crsIndex[1]].sameTime.length; i++){
            let oCrs = groups[gIndex].courses[crsIndex[0]][crsIndex[1]].sameTime[i];
            groups[oCrs[0]].courses[oCrs[1]][oCrs[2]].overlap++;
            $('button[value ="' + oCrs + '"]').css("color", "yellow");
        }
    });

    //fail 버튼 클릭 시
    $(".fail").click(function(){
        const gIndex = this.value;
        const crsIndex = groups[gIndex].cur;
        $('button[value ="' + groups[gIndex].cur + '"]').css("color", "red");
        groups[gIndex].courses[crsIndex[0]][crsIndex[1]].changeState(1);
    });
})


