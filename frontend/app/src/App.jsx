import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import isObjectEmpty from './utils';
import Login from './pages/Login';
import Home from './pages/Home';
import Event from './pages/Event';
import Task from './pages/Task';
import Admin from './pages/Admin';
import Header from './components/Header';
import { UserContext } from './context/userContext';

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
    <UserContext.Provider value={ user }>
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
            <Header title={ title } setUser={ setUser }/>
            <Switch>
              <Route exact path="/">
                <Home setTitle={ setTitle }/>
              </Route>
              <Route exact path="/event/:id">
                <Event setTitle={ setTitle }/>
              </Route>
              <Route exact path="/task/:id">
                <Task setTitle={ setTitle }/>
              </Route>
              {user.role === 'Admin' ?
                <Route exact path="/admin">
                  <Admin setTitle={ setTitle }/>
                </Route>
                :
                ""
              }
              <Redirect from="*" to="/"/>
            </Switch>
          </>
        }
      </Router>
    </UserContext.Provider>
  );
}