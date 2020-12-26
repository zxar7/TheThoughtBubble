import React ,{Component} from 'react';
import tree from '../images/thin_leaves_yellow.png'
import {Button} from '@material-ui/core/';
import TextField from '@material-ui/core/TextField';

const style = {margin: '1em',backgroundColor:'black',color:'yellow'};
const style_box = {width:'10em',textAlign:'center'};

class Login extends Component{
    constructor(){
        super();
        this.state = {
            name : '',
            password: '',
            error : '',
            msg:'',
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
        console.log('inside Login.js ----> formsubmit')
        if(this.validateForm() ){
            let userDetails = {
                username : this.state.name,
                password : this.state.password
            }
            fetch("/userlogin",{
                method:"POST",
                headers:{
                    "Content-Type": "application/json;charset=utf-8"
                },
                body : JSON.stringify(userDetails)
            })
            .then(res => res.json())
            .then(res => {
                console.log("The result obtained is ",res.result)
                let result = res.result;
                console.log(`type of result is ${result} - ${result === "Invalid user"}`)
                if(result==="Valid credentials"){
                    sessionStorage.setItem('user',this.state.name);
                    console.log('Valid user')
                    this.setState({
                        name:'',
                        password:'',
                        error:'',
                        msg:'Login Successful. Welcome '+sessionStorage.getItem('user')
                    })
                }else if(result==="Invalid credentials"){
                    console.log('Invalid user')
                    this.setState({
                        error:'Invalid credentials',
                        msg:''
                    })
                }else if(result==="Invalid User"){
                    console.log('user non existent')
                    this.setState({
                        error:'This user is not registered',
                        msg:''
                    })
                }
                else{
                    console.log("why are you here?")
                }
            })
            .catch(err => {
                console.log("Error occured during login",err);
                throw err;
            })
        }
    }

    removeSession = () => {
        sessionStorage.setItem('user','');
        this.setState({
            msg:'',
            error:''
        })
        console.log('inside the remove session',sessionStorage.getItem('user'));
    }

    //Check if the form is valid
    validateForm= () => {
        console.log('inside Login.js ----> validateForm');
        //console.log('the values for username inside validation are',this.state.username);
        let error  = '';
        let msg = "";
        let validForm = true;
        if(!this.state.name || this.state.name == null || !this.state.password || this.state.password == null ){
            //console.log("inside name invalid")
            validForm = false;
            error = 'Please do not submit empty fields';
            msg = "";
        }
        this.setState({
            error,
            msg
        });
        return validForm;
     }

    //Render login component
    render(){
        return (
            <>
                {/* Component header */}
                <div className="banner">
                    <img src={tree} alt='tree' className='headerTree'/>
                    <span className='bannerHeader'>The Thought Bubble</span>
                    <span className='headerSpace'></span>
                    <Button disabled={sessionStorage.getItem('user')?false:true} style = {style} variant="contained" onClick={this.removeSession} >{sessionStorage.getItem('user')?'Logout':''}</Button>
                    <Button style={{margin: '1em',backgroundColor:'black',color:'yellow'}} variant="contained" className="loginButton" href='./'>Home</Button> 
                </div>
                
                <br/>
                <div className='loginInfo'>
                    <p>You need to be logged in to post thoughts.</p>
                    <p>If you need to register click <Button color="secondary" href="/register" >here</Button> </p>
                    <p>Upon successful registration you will be redirected back to login.</p>
                </div>
                
                <div className='loginForm' >
                    {/* Error message for the login field */}
                    <div className='loginErrMsg'>{this.state.error ? this.state.error : ''}</div> 

                    {/* Success message for the login field */}
                    <div className='successMsg'>{this.state.msg ? this.state.msg : ''}</div> 

                    <form>
                        <TextField
                            style = {style_box}
                            required
                            name='name'
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
                            name='password'
                            type="password"
                            label="Password"
                            value={this.state.password}
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

export default Login;