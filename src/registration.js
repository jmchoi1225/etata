import Groups from './class/groups.js';
import Undo from './class/undo.js';
import Timetable from './class/timetable.js';

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
