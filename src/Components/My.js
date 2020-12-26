import React, {Component} from 'react';
import {Button} from '@material-ui/core/';
import tree from '../images/thin_leaves_yellow.png'
import Mythought from './Mythought'

class My extends Component{
    constructor(){
        super();
        this.state ={
            thoughts:[],
            msg:''
        }
    }

    //Method to display thoughts
    displayThoughts = () => {
            let posted = []
            this.state.thoughts.forEach(thought=>{
                posted.push(<Mythought editable={true} thought={thought} />)
            })
            return posted
    }

    //Check if the user has posted thoughts
    componentDidMount() {
        let user = sessionStorage.getItem('user')
        fetch('/mythoughts/'+user)
        .then(res => res.json())
        .then(thoughts=>{
            console.log('thoughts here are',thoughts);
            if(thoughts.length>0){
                this.setState({
                    thoughts,
                    msg:"You've posted "+thoughts.length+" thoughts"
                })
            }
            else {
                this.setState({
                    thoughts:[],
                    msg:"You've not posted any thoughts yet"
                })
            }
        })
    }
    
    render(){
        return(
            <>
                {/* Component header */}
                <div className="banner">
                    <img src={tree} alt='tree' className='headerTree'/>
                    <span className='bannerHeader'>The Thought Bubble</span>
                    <span className='headerSpace'></span>
                    <Button style={{margin: '1em',backgroundColor:'black',color:'yellow'}} variant="contained" className="loginButton" href='./'>Home</Button> 
                </div>
                
                <div className='successMsg2'>{this.state.msg ? this.state.msg : ''}</div> 

                <div>
                    {this.displayThoughts()}
                </div>

            </>
        )
    }
}

export default My;