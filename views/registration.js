class Course{
    constructor(id = null, lecTime = null){
        this.id = id;
        this.lecTime = lecTime;
        //this.state = 0;  //state : 0(ok black) 1(fail red) 2(success green)
    }
}

class Group{
    constructor (name, firstCrs = null, firstIdx = null, otherCrs = null){
        this.name = name;
        this.firstCrs = firstCrs;
        this.firstIdx = firstIdx;
        this.otherCrs = otherCrs;
        this.cur = null;
        //this.state = 0; //state : 0(ok) 1(success, finished)
    }
    changeCur(course){
        this.cur = course;
    }
    changeState(state){
        this.state = state;
    }
}

//그룹의 정보들을 정리함
const groups = new Array();
const other = new Array(3);
for(let i =0; i<3; i++){
    other[i] = new Array();
}
other[0].push(new Course("F028", "수B 금B"));
other[1].push(new Course("F058", "월C 수C"));
groups.push(new Group("운영체제", other[0][0], [0,0], other));


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
            insertNode +='<button class = "course" name="crsIndex" value="'+[i,j,k]+'">' +curGroup.otherCrs[j][k].id+'</button>';
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


$(document).ready(function(){
    
    // course 버튼 클릭 시
    $(".course").click(function(){
        //해당 강의번호 복사
        const crsIndex = this.value;
        copyToClipboard(this.innerHTML);

        //그 그룹의 cur를 해당 강의로 변경
        if(groups[crsIndex[0]].cur != null){
            $('button[value ="' + groups[crsIndex[0]].cur + '"]').css("color", "black");
        }
        $(this).css("color", "blue");
        groups[crsIndex[0]].changeCur(crsIndex);
    });

    //success 버튼 클릭 시
    $(".success").click(function(){
        const crsIndex = this.value;
        $('button[value ="' + groups[crsIndex[0]].cur + '"]').css("color", "green");
        groups[crsIndex[0]].changeState(2);
        //겹치는 과목 처리 해야함
    });

    //fail 버튼 클릭 시
    $(".fail").click(function(){
        const crsIndex = this.value;
        $('button[value ="' + groups[crsIndex[0]].cur + '"]').css("color", "red");
        groups[crsIndex[0]].changeState(1);
    });
})


