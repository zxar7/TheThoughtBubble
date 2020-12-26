import React , {Component} from 'react';
import {Button} from '@material-ui/core/';
import TextField from '@material-ui/core/TextField';
import tree from '../images/thin_leaves_yellow.png'
import ThoughtCard from './ThoughtCard';


const style = {marginLeft: '0.1em',backgroundColor:'black',color:'yellow',flex:1};

class Search extends Component{
    constructor(){
        super();
        this.state = {
            query:'',
            error:'',
            emptyQuery:true,
            searchResults : []
        }
    }

    searchTermChangeHandler = (event) =>{
        console.log('inside Search.js ----> searchTermChangeHandler');
        this.setState({
            emptyQuery:false,
            error:'',
            query : event.target.value
        })
        
    }

    searchEnter = (event) => {
        if(event.keyCode === 13){
            console.log('Enter key clicked');
            this.searchSubmit();
        }
    }

    searchSubmit = () => {
        if(this.state.query.trim().length){
            fetch('/thoughts/'+this.state.query,{
                mode:'cors',
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                },
            })
            .then(res => res.json())
            .then(res => {
                console.log('The results are ',res)
                if(res.length !== null && res.length!==undefined &&  res.length !== '' && res.length !==0){
                    this.setState({
                        searchResults:res,
                        msg:res.length+' Results for the search term "'+this.state.query+'"'
                    },() => console.log('The search results have been set',this.state.searchResults))
                }else {
                    this.setState({
                        searchResults:[],
                        msg:'No results for the term "'+this.state.query+'"'
                    })
                }
            })
            .catch(err => console.log('outer eror',err))
        }
        else {
            this.setState({
                error:'Sorry, no blind searches allowed. Yet',
                msg:'',
                searchResults:[]
            })
        }
    }

    displayDetails = () => {
        let items = []
        if(this.state.searchResults.length){
            this.state.searchResults.forEach(item => {
                let thought = {};
                thought.name = item.username;
                thought.message = item.thought;
                thought.date = item.createdAt;
                thought.topic = item.topicTitle;
                items.push(<ThoughtCard key={item._id} item={thought} />)
            }); 
            return items;
        }
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

                 {/* Search field */}
                 <div className="searchButton" >
                    <TextField style={{flex:30,paddingRight:'0.1em'}} onKeyDown={this.searchEnter} error={this.state.emptyMovie} placeholder="What are you looking for?" value={this.state.searchTerm} onChange={this.searchTermChangeHandler} />
                    <Button style={style} variant="contained" onClick={this.searchSubmit} >Search</Button>
                </div>

                {/* Error message for invalid search */}
                <div className="loginErrMsg">{this.state.error ? this.state.error :'' }</div>

                {/*  message for valid search */}
                <div className="successMsg">{this.state.msg ? this.state.msg :'' }</div>

                {/* Results */}
                <div>{this.displayDetails()}</div>

            </>
        )
    }
}

export default Search;