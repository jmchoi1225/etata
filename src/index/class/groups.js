export default class Groups{
    constructor(){
        this.numGroups = 0;
        this.groups = new Array();
    }

    convertJSON2obj(jsonInput){
        for(let g = 0; g<jsonInput["numGroups"]; g++){
            let curGroup = jsonInput["groups"][g];
            let newGroup = new Group();
            newGroup.convertJSON2obj(curGroup);
            this.push(newGroup);
        }
    }

    push(group){
        this.groups.push(group);
        this.numGroups++;
    }
}

class Group{
    constructor(name = null, firstIdx = null){
        this.name = name;
        this.firstIdx = firstIdx;
        this.numCrs = [0,0,0];
        this.courses = new Array(3);
        for(let rank = 0; rank<3; rank++){
            this.courses[rank] = new Array();
        }
    }

    convertJSON2obj(jsonInput){
        this.name = jsonInput["name"];
        this.firstIdx = jsonInput["firstIdx"];
        for(let rank = 0; rank < 3; rank++){
            for(let idx = 0; idx< jsonInput["numCrs"][rank]; idx++){
                const curCrs = jsonInput["courses"][rank][idx];
                this.addCrs(rank,new Course(curCrs["id"], curCrs["lecTime"]));
            }
        }
    }

    addCrs(rank,course){
        this.courses[rank].push(course);
        this.numCrs[rank]++;
    }
}

class Course{
    constructor(id, lecTime){
        this.id = id;
        this.lecTime = lecTime;
    }
}