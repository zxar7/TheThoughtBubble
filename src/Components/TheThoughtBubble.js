import React ,{Component} from 'react';
import tree from '../images/thin_leaves.png'
import {Button} from '@material-ui/core/';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';


//Setting the theme to dark
const theme = createMuiTheme({
    palette: {
      type: 'dark', // Switching the dark mode on is a single property value change.
    },
    typography: { useNextVariants: true },
  });

  const style = {
    margin: '1em',
    backgroundColor: 'black',
    color:'yellow',
    textAlign : 'center'
  }
  

class TheThoughtBubble extends Component {

    render(){
        return(
            <>
                <MuiThemeProvider theme={theme}>
                {/* Component header */}
                <div className="mainBanner">
                    <Button style={style} variant="contained" className="loginButton"  href={sessionStorage.getItem('user')?'./thought':'./login'}>Something to share?</Button>     
                    <Button variant="contained" className="loginButton" style={style} href='./search'>Find thoughts</Button> 
                    {sessionStorage.getItem('user') ? 
                        <Button variant="contained" className="loginButton" style={style} href='./my'>{sessionStorage.getItem('user')}'s thoughts</Button>
                    : ''}
                    <Button variant="contained" className="loginButton" style={style} href='./login'>{sessionStorage.getItem('user')?'logout as '+sessionStorage.getItem('user'):'login'}</Button> 
                    <Button variant="contained" className="loginButton" style={style} href='./about'>About</Button> 
                    
                </div>

                <div className='holder'>
                    <img src={tree} alt='tree' />
                    <div >
                        <h1 className="main">The Thought Bubble </h1>
                        <br />
                        <span className='suggestion'>Find thoughts on any subject.</span> <br/>
                        <span className='suggestion'>Have something to say?</span><br/>
                        <span className='suggestion'>Post anything you want!</span> 
                        <br /> 
                        <br />
                        <a href='/search'>
                            <span className="question">Looking for something?</span> 
                        </a>
                    </div>
                </div>
                </MuiThemeProvider>
            </>            
        )
    }
}


export default TheThoughtBubble;