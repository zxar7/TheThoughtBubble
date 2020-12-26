import React ,{Component} from 'react';
import {Button} from '@material-ui/core/';

class ThoughtCard extends Component{
    constructor(props){
        super(props);
    }

    render(){
        console.log('props value',this.props.item.name,this.props.item.topic)
        let date = new Date(this.props.item.date)
        return(
                
            <div className="thought_box_charm">
            <p className="topic_charm">
                
                [{this.props.item.name}]: { this.props.item.topic}
                {<Button 
                disabled
                style={{margin: '1em',backgroundColor:'black',color:'yellow',float:'right'}}
                variant="contained" 
                className="loginButton">{date.toDateString()}  </Button>  }
                
                
            </p>
            <p className="thought_charm">{this.props.item.message}</p>
           
            </div>

        )
    }

}

export default ThoughtCard;