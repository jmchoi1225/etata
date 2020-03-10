import React, {Component} from 'react';
import GroupsClass from '../class/groups.js'

class Group extends Component{
    render(){
        return(
            <div className = "group">
                {this.props.groupName}
            </div>
        )
    }
}

export default class Groups extends Component{
    render(){
        const groups = this.props.groups.groups;
        return(
            groups.map ((group)=>{
                return <Group groupName = {group.name}/>;
            })
        )
    }
}