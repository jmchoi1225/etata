export default class jsonGroups{
    constructor(){
        this.numGroups = 0;
        this.groups = new Array();
    }

    convert2JSONobj(groups){
        for(let g = 0; g<groups.getLength(); g++){
            let curGroup = groups.getGroup(g);
            let newGroup = new jsonGroup();
            newGroup.convert2JSONobj(curGroup);
            this.push(newGroup);
        }
    }

    push(group){
        this.groups.push(group);
        this.numGroups++;
    }
}

class jsonGroup{
    constructor(name = null, firstIdx = null){
        this.name = name;
        this.firstIdx = firstIdx;
        this.numCrs = [0,0,0];
        this.courses = new Array(3);
        for(let rank = 0; rank<3; rank++){
            this.courses[rank] = new Array();
        }
    }

    convert2JSONobj(group){
        this.name = group.name;
        this.firstIdx = group.firstIdx;
        for(let rank = 0; rank < 3; rank++){
            for(let idx = 0; idx< group.courses.getLength(rank); idx++){
                const curCrs = group.getCourse(rank, idx);
                this.addCrs(rank,new jsonCourse(curCrs.id, curCrs.lecTime));
            }
        }
    }

    addCrs(rank,course){
        this.courses[rank].push(course);
        this.numCrs[rank]++;
    }
}

class jsonCourse{
    constructor(id, lecTime){
        this.id = id;
        this.lecTime = lecTime;
    }
}