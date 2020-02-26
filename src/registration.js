import Groups from './class/groups.js';
import Undo from './class/undo.js';
import Timetable from './class/timetable.js';
import GroupsComponent from './component/groupsRegistration';
import React from 'react';
import ReactDOM from 'react-dom';

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

function findColor(course){
    if(course.state == 1){ // fail
        return "red";
    }
    else if(course.state == 2){ // success
        return "green";
    }
    else if(course.overlap>0){
        return "yellow";
    }
    else{
        return "black";
    }
}

function changeCourseColor(crsIdx, color){
    const strCrsIdx = Groups.arr2strcrsIdx(crsIdx);
    $('button[value ="' + strCrsIdx + '"]').css("color", color);
}

function selectCourse(crsIdx, group, course){
    if(group.state == 0){
        if(group.cur != null){
            changeCourseColor(group.cur, findColor(group.getCourse(group.cur["rank"],group.cur["idx"])));
        }
        changeCourseColor(crsIdx,"blue");
        group.cur = crsIdx;
    }
}

function courseSuccess(group){
    if(group.cur != null){
        const curCourse = group.getCourse(group.cur["rank"],group.cur["idx"]);
        group.state = 1; //finished
        curCourse.state = 2; //success
        changeCourseColor(group.cur,"green");
        
        //겹치는 과목 처리
        for(let i = 0; i<curCourse.sameTime.length; i++){
            const oCrsIdx = curCourse.sameTime[i];
            const oCrs = groups.getCourse(oCrsIdx);
            oCrs.overlap++;
            changeCourseColor(oCrsIdx, findColor(oCrs));
        }
    }
}

function courseFail(group){
    if(group.cur != null){
        const curCourse = group.getCourse(group.cur["rank"],group.cur["idx"]);
        curCourse.state = 1; //fail
        changeCourseColor(group.cur,"red");
    }
}

$(document).ready(function(){
    //그룹의 정보들을 정리함
    timetable.setData(groups);
    timetable.processOverlap();


    //그룹에 해당하는 것을 보여줌
                
    ReactDOM.render(<GroupsComponent groups = {groups}/>, document.getElementById('content'));

    // course 버튼 클릭 시
    $(".course").click(function(){
        const crsIndex = Groups.str2arrcrsIdx(this.value);
        const curGroup = groups.getGroup(crsIndex["group"]);
        const curCourse = curGroup.getCourse(crsIndex["rank"], crsIndex["idx"]);
        copyToClipboard(this.innerHTML);
        selectCourse(crsIndex,curGroup,curCourse);
    });

    //success 버튼 클릭 시
    $(".success").click(function(){
        const curGroup = groups.getGroup(this.value);
        if(curGroup.state == 0){
            courseSuccess(curGroup);
        }
    });

    //fail 버튼 클릭 시
    $(".fail").click(function(){
        const curGroup = groups.getGroup(this.value);
        if(curGroup.state == 0){
            courseFail(curGroup);
        }
    });
})
