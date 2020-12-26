import React ,{Component} from 'react';
import tree from '../images/thin_leaves_yellow.png'
import {Button} from '@material-ui/core/';
import TextField from '@material-ui/core/TextField';

const style = {margin: '1em',backgroundColor:'black',color:'yellow'};
const style_box = {width:'10em',textAlign:'center'};


class Register extends Component {
    constructor(){
        super();
        this.state = {
            username : '',
            password1 : '',
            password2 : '',
            error: '',
            msg: ''
        }
    }

    //Function to handle changes to the field values
    onValueChange = (event) =>{ 
        console.log('inside Login.js ----> onValueChange');
        //console.log(`the event ${field} has a value of ${event.target.value}`)
        this.setState({            
            [event.target.name] : event.target.value,
            error :'',
            msg:''
        }
        )
    } 

    //Function to handle form submit
    formSubmit = () => {
        console.log('inside Register.js ----> formsubmit')
        if( this.validateForm() ){
            
            fetch("/check/"+this.state.username.trim().replace(/\s\s+/g, ' '))
            .then(res => res.json())
            .then(res => {
                console.log('matching result ',res.result=== "Found match")
                if(res.result === "Found match"){
                    this.setState({
                        error : "User already exists",
                        msg:""
                    })
                    return {response:false};
                }
                else if(res.result === "No match"){

                    let userData = {
                        username : this.state.username,
                        password : this.state.password1
                    } 
                    this.setState({
                        msg:'Registration Successful',
                    })
                    fetch('/signup',{
                        method:'POST',
                        headers:{
                            "Content-Type": "application/json;charset=utf-8"
                        },
                        body : JSON.stringify(userData)
                    })
                    .then(window.location.href = "/login")
                    //.then(window.open("/login",'_blank'))
                    .catch(err => console.log('Error while sending user details :', err));
                }
            })
        }
    }

    //Check if the form is valid
    validateForm(){
        console.log('inside Login.js ----> validateForm');
        //console.log('the values for username inside validation are',this.state.username);
        if(!this.state.username || this.state.username == null || !this.state.password1 || this.state.password1 == null || !this.state.password2 || this.state.password2 == null){
            //console.log("inside name invalid")
            this.setState({
                error : 'Please do not submit empty fields',
                msg : ""
            })
            return false;
        }
        else if(this.state.password1 !== this.state.password2){
            this.setState({
                error : 'Passwords do not match',
                msg : ""
            })
            return false;
        }
         
        return true;              
    }

    render(){
        return(
            <>
                {/* Component header */}
                <div className="banner">
                    <img src={tree} alt='tree' className='headerTree'/>
                    <span className='bannerHeader'>The Thought Bubble</span>
                    <span className='headerSpace'></span>
                    <Button style={{margin: '1em',backgroundColor:'black',color:'yellow'}} variant="contained" className="loginButton" href='./login'>back</Button> 
                    <Button style={{margin: '1em',backgroundColor:'black',color:'yellow'}} variant="contained" className="loginButton" href='./'>Home</Button> 
                </div>
                <br/>
                <div className="info"> REGISTER</div>
                <br/>
                <div className='loginForm' >
                    {/* Error message for the login field */}
                    <div className='loginErrMsg'>{this.state.error ? this.state.error : ''}</div> 

                    <div className='successMsg'>{this.state.msg ? this.state.msg : ''}</div> 

                    <form>
                        <TextField
                            style = {style_box}
                            required
                            name='username'
                            type="text"
                            label="Username"
                            value={this.state.name}
                            margin="normal"
                            variant="filled"
                            onChange={this.onValueChange}
                            
                        />
                        <br/>
                        <TextField
                            style = {style_box}
                            required
                            name='password1'
                            type="password"
                            label="Password"
                            value={this.state.password1}
                            margin="normal"
                            variant="filled"
                            onChange={this.onValueChange}
                            
                        />
                        <br/>
                        <TextField
                            style = {style_box}
                            required
                            name='password2'
                            type="password"
                            label="Confirm Password"
                            value={this.state.password2}
                            margin="normal"
                            variant="filled"
                            onChange={this.onValueChange}                           
                            />
                            <br/>
    
                        <Button style = {style} variant="contained" onClick={this.formSubmit}>submit</Button>
                    </form> 
                </div>
            </>
        )
    }
}

export default Register;