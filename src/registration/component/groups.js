import React, {Component} from 'react';
import GroupsClass from '../class/groups.js';

class Course extends Component{
    render(){
        const course = this.props.course;
        const groupIdx = this.props.groupIdx;
        const rank = this.props.rank;
        const idx= this.props.idx;
        return(
            <button className = "course" value={[groupIdx,rank,idx]}>{course.id}</button>
        )
    }
}

class Courses extends Component{
    render(){
        const courses = this.props.courses.data;
        const ranks = [0,1,2];
        return(
            <div className = "courses">
                {ranks.map(rank =>{
                    return(<div className = "groupContainer">
                        {courses[rank].map((course, idx)=>{
                            return <Course groupIdx = {this.props.groupIdx} rank = {rank} idx = {idx} course = {course} key = {idx} />
                        })}
                    </div>)
                })} 
            </div>
        )
    }
}

class Group extends Component{
    render(){
        const group = this.props.group;
        return(
            <div className = "group">
                <div className = "first">
                    <div className = "groupContainer"> {group.name} </div>
                    <hr/>
                    <div className = "groupContainer">
                        <Course groupIdx = {this.props.groupIdx} rank = {group.firstIdx[0]} idx = {group.firstIdx[1]} course = {group.courses.getCourse(group.firstIdx[0], group.firstIdx[1])}/>
                    </div>
                    <div className = "groupContainer">
                        <button className = "success" name ="groupIndex" value = {this.props.groupIdx}>성공</button>
                        <button className = "fail" name ="groupIndex" value = {this.props.groupIdx}>실패</button>
                    </div>
                </div>
                <Courses groupIdx = {this.props.groupIdx} courses = {group.courses}/>
            </div>
        )
    }
}

class Groups extends Component{
    render(){
        const groups = this.props.groups.data;
        return(
            groups.map((group, idx) =>{
                return <Group groupIdx = {idx} group = {group} key = {idx}/>
            })
        );
    }
}

export default Groups;