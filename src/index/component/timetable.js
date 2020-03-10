import React, {Component} from 'react';

class Timetable extends Component{
    render(){
        return(
            <table className= "timetable">
                <tbody>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>   
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
        )
    }
}
class Timetables extends Component{
    render(){
        const timetables = [1,2,3,4,5,6,7];
        return(
            <div className = "horizontalScroll">
                {timetables.map(()=>{
                    return (
                        <Timetable/>
                    )
                })}
            </div>
        )
    }
      
}

export {Timetable as TimetableComponent, Timetables as TimetablesComponent};