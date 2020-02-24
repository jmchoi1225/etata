export default class Timetable{
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