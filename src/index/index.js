import Style from './index.css';
import Groups from './class/groups.js';
import GroupsComponent from './component/groups.js';
import {TimetableComponent, TimetablesComponent} from './component/timetable.js';
import ConditionComponent from './component/condition.js'
import React from 'react';
import ReactDOM from 'react-dom';

const jsonInput = {
    "numGroups": 2,
    "groups":[
        {
            "name" : "운영체제",
            "firstIdx": [0,0],
            "numCrs": [1,1,0],
            "courses": [
                [
                    {
                        "id": "F028",
                        "lecTime": "수B 금B"
                    }
                ],
                [
                    {
                        "id": "F058",
                        "lecTime": "월C 수C"
                    }
                ],
                [
  
                ]
            ]
        },
        {
            "name" : "도분설",
            "firstIdx": [0,0],
            "numCrs": [1,1,0],
            "courses": [
                [
                    {
                        "id": "F001",
                        "lecTime": "월B 수B"
                    }
                ],
                [
                    {
                        "id": "F002",
                        "lecTime": "월C 수B"
                    }
                ],
                [
  
                ]
            ]
        }
    ]
}

let groups = new Groups();
groups.convertJSON2obj(jsonInput);

const conditionList= [
    "A교시 1개 이하",
    "C교시 3개 이하",
    "D교시 3개 이하",
    "금요일 공강",
    "3 연강 0개 이하",
    "4 공강 0개 이하",
    "운영체제 F032 선택"
]

$(document).ready(function(){
    ReactDOM.render(<GroupsComponent groups = {groups}/>, document.getElementById("showGroups"));
    ReactDOM.render(<TimetableComponent/> , document.getElementById("firstPick"));
    ReactDOM.render(<TimetablesComponent/>,document.getElementById("selectedTimetables"));
    ReactDOM.render(<TimetablesComponent/>, document.getElementById("showResults"));
    ReactDOM.render(<ConditionComponent conditionList = {conditionList}/>,document.getElementById('conditionsList'));
})