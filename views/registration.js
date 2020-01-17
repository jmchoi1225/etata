class course{
    constructor(id){
        this.id = id;
    }
    getId(){
        return this.id;
    }
}
class group{
    constructor(name, firstCrs, otherCrs){
        this.name = name;
        this.firstCrs = firstCrs;
        this.otherCrs = otherCrs;
    }
    getName(){
        return this.name;
    }
    getFirstCrs(){
        return this.firstCrs;
    }
    getOtherCrs(){
        return this.otherCrs;
    }
}

const groups = new Array();
const first = new course("F028");
const other = new Array(3);
for(var i =0; i<3; i++){
    other[i] = new Array();
}
other[0].push(new course("F028"));
other[1].push(new course("F129"));
groups.push(new group("테스트", first, other));


for(let i =0; i<groups.length; i++){
    const curGroup = groups[i];
    var insertNode =  
        '<div class = "group">' +
            '<div class = "first">' +
                '<div class = "groupContainer">' +curGroup.getName()+'</div>' +
                '<hr>'+
                '<div class = "groupContainer">'+
                    '<button>'+curGroup.getFirstCrs().getId()+'</button>'+
                '</div>'+
                '<div class = "groupContainer">'+
                    '<button>성공</button>'+
                    '<button>실패</button>'+
                '</div>'+
            '</div>'+
            '<div class = "others">';
                
    for(let j = 0; j<3; j++){
        insertNode +='<div class = "groupContainer">';
        for(let k = 0; k< curGroup.getOtherCrs()[j].length; k++){
            insertNode +='<button>' +curGroup.getOtherCrs()[j][k].getId()+'</button>';
        }
        insertNode += '</div>';
    }
    insertNode += 
            '</div>' +
        '</div>';
            
    document.getElementById('content').innerHTML += insertNode;
}
