import React ,{Component} from 'react';
import tree from '../images/thin_leaves_yellow.png'
import {Button} from '@material-ui/core/';
import TextField from '@material-ui/core/TextField';

const style = {margin: '1em',backgroundColor:'black',color:'yellow'};

class Thought extends Component{
    constructor(){
        super();
        this.state = {
            name:'',
            thought:'',
            topic:'',
            error:'',
            msg:''
        }
    }

    componentDidMount(){
        let user = sessionStorage.getItem('user');
        if(user !== '' && user !== undefined && user !== null){
            this.setState({
                name:user
            })
        }
    }

    searchEnter = (event) => {
        if(event.keyCode === 13){
            console.log('Enter key clicked');
            this.formSubmit();
        }
    }

    //Function to handle changes to the field values
    onValueChange = (event) =>{
        console.log('inside Login.js ----> onValueChange');
        //console.log(`the event ${field} has a value of ${event.target.value}`)
        this.setState({            
            [event.target.name] : event.target.value,
            error :''
        })
    } 

    //Function to handle form submit
    formSubmit = () => {
        console.log('inside Login.js ----> formsubmit')
        if(this.validateForm() ){
            //console.log("In here yet 3? "+'/checkThought/'+this.state.topic)
            
            //post the data
            let thoughtDetails = {
                username : this.state.name,
                thought: this.state.thought,
                topicTitle: this.state.topic
            }
            fetch('checkThought/'+this.state.topic,{
                mode:'cors',
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                },
            })
            .then((data) => data.json())
            .then(res => {
                console.log("new res is ",res)
                if(res.length>0){
                    this.setState({
                        error:"Someone had a similar thought. Change your topic"
                    })
                }
                else{
                    this.saveThought(thoughtDetails)
                }
            })
        }
        else {
             this.setState({
                 error:"Brain freeze? Try and think of something."
             })
        }
    }

    saveThought = (thoughtDetails) => {
        fetch('/saveThought',{
            method:'POST',
            headers:{
                "Content-Type": "application/json;charset=utf-8"
            },
            body:JSON.stringify(thoughtDetails)
        }).then(res => res.json())
        .then(res => {console.log("The thing that came back is ",res)
            if(res.result === "saved"){
                this.setState({
                    msg:"Thought saved successfully",
                    thought:'',
                    topic:'',
                    error:''
                })
            }
        })
        .catch(err =>  console.log('Something went wrong while saving the thought',err))

    }

    //Check if the form is valid
    validateForm= () => {
        console.log('inside Login.js ----> validateForm');
        //console.log('the values for username inside validation are',this.state.username);
        let error = '';
        let validForm = true;
        if( this.state.thought ==='' || this.state.thought == null || this.state.topic ==='' || this.state.topic == null ){
            //console.log("inside name invalid")
            validForm = false;
            error = 'Please do not submit empty fields';
        }
        this.setState({
            error
        });
        return validForm;
     }

    render(){
        return (
            <>
                {/* Component header */}
                <div className="banner">
                    <img src={tree} alt='tree' className='headerTree'/>
                    <span className='bannerHeader'>The Thought Bubble</span>
                    <span className='headerSpace'></span>
                    <Button style={style} variant="contained" className="loginButton" href='./'>Home</Button> 
                </div>
                
                <p className='info'>
                    What do you wanna post?
                </p>
                
                <div className='loginForm' >

                {/* Error message for the login field */}
                <div className='loginErrMsg'>{this.state.error ? this.state.error : ''}</div> 

                <div className='successMsg'>{this.state.msg ? this.state.msg : ''}</div> 

                    <form>
                        <TextField
                            required
                            disabled
                            style = {{width:'8em',overflow:'hidden'}}
                            name='name'
                            type="text"
                            label="Thinker"
                            value={this.state.name}
                            margin="normal"
                            variant="filled"
                            onChange={this.onValueChange}
                            helperText = "You can't change your name."
                            onKeyDown={this.searchEnter}
                        />
                        <br/>
                        <TextField
                            style = {{width:'15em',overflow:'hidden'}}
                            name='thought'    
                            label="Thought"
                            required
                            multiline
                            rows="10"
                            value = {this.state.thought}
                            margin="dense"
                            onChange = {this.onValueChange}
                            helperText = "Make sure it's right. You can't edit this later. Yet"
                            variant="filled"
                        />
                        <br/>
                        <TextField
                            required
                            style = {{width:'8em'}}
                            name='topic'
                            type="text"
                            label="Topic"
                            value={this.state.topic}
                            margin="dense"
                            variant="filled"
                            onChange={this.onValueChange}
                            helperText = 'This will assist in searching for this thought.'
                            onKeyDown={this.searchEnter}
                        />
                        <br/>
                        <Button style={style} variant="contained" onClick={this.formSubmit}>Submit</Button>
                    </form> 
                </div>
                
            </>
        )
    }
}

export default Thought;