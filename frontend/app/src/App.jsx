import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import isObjectEmpty from './utils';
import Login from './pages/Login';
import Home from './pages/Home';
import Event from './pages/Event';
import Task from './pages/Task';
import Admin from './pages/Admin';
import Header from './components/Header';

const LoginUseState = (key, initVal) => {
  let currentData = JSON.parse(localStorage.getItem(key))
  if(!currentData || new Date(currentData.expiryDate) < new Date()){
    currentData = initVal;
  }
  const [value, setValue] = useState(currentData);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
 
  return [value, setValue];
};

export default function App() {
  const [user, setUser] =  LoginUseState('userData', {});
  const [title, setTitle] = useState("");

  return (
    <Router>
      {isObjectEmpty(user) ?
        <Switch>
          <Route path="/">
            <Login setUser={ setUser }/>
          </Route>
          <Redirect from="*" to="/"/>
        </Switch>
        :
        <>
          <Header title={ title } user={ user } setUser={ setUser }/>
          <Switch>
            <Route exact path="/">
              <Home setTitle={ setTitle } user={ user }/>
            </Route>
            <Route exact path="/event/:id">
              <Event setTitle={ setTitle } user={ user } />
            </Route>
            <Route exact path="/task/:id">
              <Task setTitle={ setTitle } user={ user } />
            </Route>
            {user.role === 'Admin' ?
              <Route exact path="/admin">
                <Admin setTitle={ setTitle } user={ user } />
              </Route>
              :
              ""
            }
            <Redirect from="*" to="/"/>
          </Switch>
        </>
      }
    </Router>
  );
}