import React from 'react';
import {BrowserRouter as Router, 
        Switch, 
        Route} from 'react-router-dom';
import Home from './containers/Home.js';
import UserSettings from './containers/UserSettings.js';
import './App.scss';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route path="/user" component={UserSettings}/>
      </Switch>
    </Router>
  );
}

export default App;
