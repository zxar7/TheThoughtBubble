import React ,{Component} from 'react';
import tree from '../images/thin_leaves_yellow.png'
import tree_black from '../images/thin_leaves.png'
import {Button} from '@material-ui/core/';

const style ={
    fontFamily:'JosefinSans-Bold',
    fontSize: '0.8em'
}

class About extends Component{
    render(){
        return (
            <>
                {/* Component header */}
                <div className="banner">
                    <img src={tree} alt='tree' className='headerTree'/>
                    <span className='bannerHeader'>The Thought Bubble</span>
                    <span className='headerSpace'></span>
                    <Button style={{margin: '1em',backgroundColor:'black',color:'yellow'}} variant="contained" className="loginButton" href='./'>Home</Button> 
                </div>
                <br/>
                <h2 className='info'>
                    About Us
                </h2>
                <div className="about">
                    <p>Freedom of speech, am I right?</p>
                    <p>This is a proto-application.</p>
                    <p><img src={tree_black} alt='tree' className='headerTree'/> Icon made by
                        <Button style={style} href='https://www.flaticon.com/authors/freepik'> Freepik </Button> 
                        from 
                        <Button style={style} href='https://www.flaticon.com/'> www.flaticon.com </Button>
                    </p>
                </div>
            </>
        )
    }
}

export default About;