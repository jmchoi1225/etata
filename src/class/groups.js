class Course{
    constructor(id = null, lecTime = null){
        this.id = id;
        this.lecTime = lecTime;
        this.state = 0;  //state : 0(ok black) 1(fail red) 2(success green) 3(overlapped yellow)
        this.overlap = 0; //성공 중 겹친 course의 개수
        this.sameTime = new Array();
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

export default class Groups{
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