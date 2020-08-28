import React from 'react';
import {BrowserRouter as Router, 
        Switch, 
        Route} from 'react-router-dom';
import Home from './containers/Home.js';
import UserSettings from './containers/UserSettings.js';
import UserProvider from './contexts/UserProvider.js';
import './App.scss';

function App() {
  return (
    <Router>
      <Switch>
        <UserProvider>
          <Route exact path="/" component={Home}/>
          <Route path="/user" component={UserSettings}/>
        </UserProvider>
      </Switch>
    </Router>
  );
}

export default App;
