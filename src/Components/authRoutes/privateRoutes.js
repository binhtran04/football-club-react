import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({
    user,
    component: Component,
    ...rest
}) => {
    // props in component={(props)... is the props from react-router e.g. history
    return <Route {...rest} component={(props) => (
        user ? 
            <Component {...props} user={user}/>
        : <Redirect to="/sign_in" />
    )} />;
};

export default PrivateRoute;