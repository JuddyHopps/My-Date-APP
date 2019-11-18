import LoginFormContainer from '../user_auth/login_form_container';
import SignupFormContainer from '../user_auth/signup_form_container';
import { AuthRoute, ProtectedRoute } from '../../util/route_util';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Redirect } from 'react-router';
import Home  from './home';
import Splash from '../splash';
import DemoLoginFormContainer from '../user_auth/demo_login_form_container.jsx';
import ProfileShowContainer from '../profiles/profile_show_container';
import ProfileIndexContainer from '../profiles/profile_index_container';
import SearchContainer from '../search/search_container';
import MatchIndexContainer from '../matches/match_index_container';


class Main extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
  
    return (
      <div className="main-component">
        
        <Switch>
          <AuthRoute path="/login" component={LoginFormContainer} />
          <AuthRoute path="/signup" component={SignupFormContainer} />
          <AuthRoute path="/demo-login" component={DemoLoginFormContainer} />

          <AuthRoute exact path="/" component={Splash} />
          <ProtectedRoute exact path="/home" component={Home} />

          <ProtectedRoute path="/profiles/:profileId" component={ProfileShowContainer} />
          <ProtectedRoute exact path="/explore" component={ProfileIndexContainer} />

          <ProtectedRoute path="/matches" component={MatchIndexContainer} />

          <ProtectedRoute exact path="/search" component={SearchContainer} />

          {/* ANY INVALID PATH: */}
          <Route render={() => <Redirect to={{ pathname: "/" }} />} />
        </Switch>
        
        
        <Route
          exact path="/"
          render={() => (this.props.currentUser ? <Redirect to="/home" /> : <Redirect to="/" />)}
        />
      </div>
    )
  }
}


export default Main;