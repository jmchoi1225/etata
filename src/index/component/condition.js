import React, {Component} from 'react';
import GroupsClass from '../class/groups.js'

class Condition extends Component{
    render(){
        return(
            <li>{this.props.condition}</li>
        )
    }
}

export default class ConditionList extends Component{
    render(){
        const conditionList = this.props.conditionList;
        return(
            <ul>
                {conditionList.map ((condition)=>{
                    return <Condition condition = {condition}/>;
                })}
            </ul>
        )
    }
}