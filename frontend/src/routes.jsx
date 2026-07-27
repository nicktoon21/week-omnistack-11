import { Redirect, Route, Switch } from 'wouter';

import Logon from './pages/Logon';
import Register from './pages/Register';
import Profile from './pages/Profile';
import NewIncident from './pages/NewIncident';
import { isAuthenticated } from './services/auth';

function Private({ children }) {
  return isAuthenticated() ? children : <Redirect to="/" replace />;
}

export default function Routes() {
  return (
    <Switch>
      <Route path="/" component={Logon} />
      <Route path="/register" component={Register} />

      <Route path="/profile">
        <Private>
          <Profile />
        </Private>
      </Route>

      <Route path="/incidents/new">
        <Private>
          <NewIncident />
        </Private>
      </Route>

      <Route>
        <Redirect to="/" replace />
      </Route>
    </Switch>
  );
}
