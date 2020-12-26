import React, { Component } from 'react';
import './App.css';
import TheThoughtBubble from './Components/TheThoughtBubble'
import {BrowserRouter as Router,Route,Redirect} from 'react-router-dom';
import Login from './Components/Login';
import About from './Components/About';
import Thought from './Components/Thought';
import Search from './Components/Search';
import Register from './Components/Register';
import My from './Components/My';

class App extends Component {

  render() {
    return (
      
      // The various routes
      <Router>
          <>
              <Route exact path="/" component = {TheThoughtBubble} />
              <Route exact path="/login" component = {Login} /> 
              <Route exact path="/about" component = {About} /> 
              <Route exact path="/search" component = {Search} /> 
              <Route exact path="/register" component = {Register} /> 
              <Route exact path='/thought' render={
              () => (sessionStorage.getItem('user')? (<Thought />) : (<Redirect to='/' />))} /> 
              <Route exact path='/my' render={
              () => (sessionStorage.getItem('user')? (<My />) : (<Redirect to='/' />))} /> 
          </>
      </Router>
    );
  }
}

export default App;

