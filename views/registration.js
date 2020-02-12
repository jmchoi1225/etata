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
    constructor (name, firstCrs = null, firstIdx = null, otherCrs = null){
        this.name = name;
        this.firstCrs = firstCrs;
        this.firstIdx = firstIdx;
        this.otherCrs = otherCrs;
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
const numGroups = 2;
const weekdays = ['월', '화', '수', '목', '금'];
const times = ['A', 'B', 'C', 'D', 'E', 'F'];
const groups = new Array();
let timetable = new Array(5);
for(let i = 0; i<5; i++){
    timetable[i] = new Array(6);
    for(let j = 0; j<6; j++){
        timetable[i][j] = new Array();
    }
}
for(let g = 0; g<numGroups; g++){
    const other = new Array(3);
    for(let i =0; i<3; i++){
        other[i] = new Array();
    }
    //add courses 
    if(g==0){
        other[0].push(new Course("F028", "수B 금B"));
        other[1].push(new Course("F058", "월C 수C"));
        groups.push(new Group("운영체제", other[0][0], [0,0], other));
    }
    else if (g==1){
        other[0].push(new Course("F001", "월B 수B"));
        other[1].push(new Course("F002", "월C 수B"));
        groups.push(new Group("도분설", other[0][0], [0,0], other));
    }
    //courses 겹치는 것을 찾기
    for(let i = 0; i<2; i++){
        for(let crs = 0; crs< groups[g].otherCrs[i].length; crs++){
            let week = -1;
            let time = -1;
            for(let c = 0; c < groups[g].otherCrs[i][crs].lecTime.length; c++){
                if(times.includes(groups[g].otherCrs[i][crs].lecTime[c])){
                    if(week != -1 && time == -1){
                        time = times.indexOf(groups[g].otherCrs[i][crs].lecTime[c]);
                        for(let j  = 0; j<timetable[week][time].length; j++){
                            o = timetable[week][time][j];
                            if(!groups[o[0]].otherCrs[o[1]][o[2]].sameTime.includes([g,i,crs])){
                                groups[o[0]].otherCrs[o[1]][o[2]].sameTime.push([g,i,crs]);
                            }
                            if(!groups[g].otherCrs[i][crs].sameTime.includes(o)){
                                groups[g].otherCrs[i][crs].sameTime.push(o);
                            }
                        }
                        timetable[week][time].push([g,i,crs]);
                        week = -1;
                        time = -1;
                    }
                    else{
                        console.log([g,i,crs]+ " syntax is wrong");
                        console.log(groups[g].otherCrs[i][crs].lecTime[c]);
                    }
                    
                }
                else if(weekdays.includes(groups[g].otherCrs[i][crs].lecTime[c])){
                    if(week == -1){
                        week = weekdays.indexOf(groups[g].otherCrs[i][crs].lecTime[c]);
                    }
                    else{
                        console.log([g,i,crs]+ " syntax is wrong");
                        console.log(groups[g].otherCrs[i][crs].lecTime[c]);
                    }
                }
            }
        }
    }   
}



//그룹에 해당하는 것을 보여줌
for(let i =0; i<groups.length; i++){
    const curGroup = groups[i];
    var insertNode =  
        '<div class = "group">' +
            '<div class = "first">' +
                '<div class = "groupContainer">' +curGroup.name+'</div>' +
                '<hr>'+
                '<div class = "groupContainer">'+
                    '<button class = "course">'+curGroup.firstCrs.id+'</button>'+
                '</div>'+
                '<div class = "groupContainer">'+
                    '<button class = "success" name ="groupIndex" value = "' + i+ '">성공</button>'+
                    '<button class = "fail" name ="groupIndex" value = "' + i+ '">실패</button>'+
                '</div>'+
            '</div>'+
            '<div class = "others">';
                
    for(let j = 0; j<3; j++){
        insertNode +='<div class = "groupContainer">';
        for(let k = 0; k< curGroup.otherCrs[j].length; k++){
            insertNode +='<button class = "course" name="crsIndex" value='+[i,j,k]+'>' +curGroup.otherCrs[j][k].id+'</button>';
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


$(document).ready(function(){
    
    // course 버튼 클릭 시
    $(".course").click(function(){
        const crsIndex = getIndex(this.value);
        if(groups[crsIndex[0]].state == 0){
            //해당 강의번호 복사
            copyToClipboard(this.innerHTML);

            //그 그룹의 cur를 해당 강의로 변경
            if(groups[crsIndex[0]].cur != null){
                if(groups[crsIndex[0]].otherCrs[crsIndex[1]][crsIndex[2]].state==0){
                    $('button[value ="' + groups[crsIndex[0]].cur + '"]').css("color", "black");
                }
            }
            $(this).css("color", "blue");
            groups[crsIndex[0]].changeCur(crsIndex);
        }
    });

//error in success and fail exist

    //success 버튼 클릭 시
    $(".success").click(function(){
        const gIndex = this.value;
        const crsIndex =  groups[gIndex].cur;
        $('button[value ="' + groups[gIndex].cur + '"]').css("color", "green");
        groups[gIndex].changeState(1);
        groups[gIndex].otherCrs[crsIndex[0]][crsIndex[1]].changeState(2);
        //겹치는 과목 처리 해야함
        for(let i = 0; i<groups[gIndex].otherCrs[crsIndex[0]][crsIndex[1]].sameTime.length; i++){
            let oCrs = groups[gIndex].otherCrs[crsIndex[0]][crsIndex[1]].sameTime[i];
            groups[oCrs[0]].otherCrs[oCrs[1]][oCrs[2]].overlap++;
            $('button[value ="' + oCrs + '"]').css("color", "yellow");
        }
    });

    //fail 버튼 클릭 시
    $(".fail").click(function(){
        const gIndex = this.value;
        const crsIndex = groups[gIndex].cur;
        $('button[value ="' + groups[gIndex].cur + '"]').css("color", "red");
        groups[gIndex].otherCrs[crsIndex[0]][crsIndex[1]].changeState(1);
    });
})


