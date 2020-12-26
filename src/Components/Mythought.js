import React , {Component, useState} from 'react';
import {Button} from '@material-ui/core/';
import TextField from '@material-ui/core/TextField';

class Mythought extends Component{
    constructor(props){
        super(props)
        this.state = {
            edit : false,
            fullThought:this.props.thought,
            newThought:this.props.thought.message,
            error:''
        }
    }

    setEdit =() => {
        if(this.state.edit){
            this.setState({
                newThought:'',
                edit:false,
                error:''
            })
        }else{
            this.setState({
                edit:true,
                error:'',
                newThought:this.props.thought.message
            })
        }return;
    }

    saveThought =() =>{
        if(!this.state.newThought){
            this.setState({
                error:'Nothing to say?'
            })
        }
        else{
            let newThought = {
                //topicTitle:this.props.thought.topic,
                thought:this.state.newThought
            }
            fetch("/edit/"+this.props.thought.topic,{
                method:'PUT',
                headers:{
                    "Content-Type": "application/json;charset=utf-8"
                },
                body:JSON.stringify(newThought)
            }).then(res=>res.json())
            .then(res=>{
                console.log("Data from put fetch is ",res);
                if(res.result === 'success'){
                    window.location.href = "/my";
                    this.setEdit()
                }
                else{
                    this.setState({
                        error:'Something went horribly wromg!!!'
                    })
                }
            })
            //this.setEdit();
        }
        
    }

    //Function to handle changes to the field values
    onValueChange = (event) =>{
        console.log('inside MyThought.js ----> onValueChange');
        //console.log(`the event ${field} has a value of ${event.target.value}`)
        this.setState({            
            [event.target.name] : event.target.value,
            error :''
        }//,console.log(`Login.js ----> onValueChange -- after setstate. value of name:${this.state.name} `)
        )
    } 

    deleteThought = () => {
        fetch("/remove/"+this.props.thought.topic,{
            method: 'DELETE'
        })
        .then(res => {return res.json()})
        .then(res => {
            console.log("Res here is",res)
            window.location.href = "/my"
        })
     }

    render(){
            let date = new Date(this.props.thought.date)
        return(
            <>
            <div className="thought_box">
                {!this.state.edit ?
                <>
                <p className="topic">
                    <Button 
                    disabled
                    style={{margin: '1em',backgroundColor:'black',color:'yellow',float:'left'}}
                    variant="contained" 
                    className="loginButton">{date.toDateString()}</Button> 

                    {this.props.thought.topic}
                    
                    <Button 
                    style={{margin: '1em',backgroundColor:'black',color:'yellow',float:'right'}}
                    variant="contained" 
                    className="loginButton" 
                    onClick={this.deleteThought}>delete ?</Button> 
                </p>
                <p className="thought">{this.props.thought.message}</p>
                <p style={{margin:'0'}}>
                <Button 
                    style={{margin: '1em',backgroundColor:'black',color:'yellow',float:'right'}}
                    variant="contained" 
                    className="loginButton" 
                    onClick={this.setEdit}>edit</Button> 
                </p>
                
                </>
                :
                    <>
                    <p className="topic">
                        {this.props.thought.topic}
                    </p>
                    <div className='loginForm'>
                        {/* Error message for the login field */}
                        <div className='loginErrMsg'>{this.state.error ? this.state.error : ''}</div> 

                        <TextField
                            style = {{width:'15em',overflow:'hidden'}}
                            name='newThought'    
                            label="Thought"
                            required
                            multiline
                            rows="10"
                            value = {this.state.newThought}
                            margin="dense"
                            onChange = {this.onValueChange}
                            helperText = "So? What's new?"
                            variant="filled"
                        />
                        <br/>
                        <p className='thought_comment'>
                        <Button 
                        style={{margin: '1em',backgroundColor:'black',color:'yellow',float:'right'}}
                        variant="contained" 
                        className="loginButton" 
                        onClick={this.saveThought}>save</Button> 
                         <Button 
                        style={{margin: '1em',backgroundColor:'black',color:'yellow',float:'right'}}
                        variant="contained" 
                        className="loginButton" 
                        onClick={this.setEdit}>cancel</Button> 
                        </p>
                    </div>
                    </>
                }
            </div>
            </>
        )
    }
}

export default Mythought;