import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Home from './Home'

const App=() => {
  return(
    <div className="app">
      <Router>
      <Switch>
          <Route path="/" component={Home} />
        </Switch>
      </Router>
    </div>
  )
}

export default App;
