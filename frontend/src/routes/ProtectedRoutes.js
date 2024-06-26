import React from "react";
import { Navigate } from "react-router-dom";
import { connect } from "react-redux";
import LandingPage from "components/LandingPage";

const ProtectedRoute = ({ children, authenticated }) => {
  console.log(authenticated)
  return (
    <LandingPage>
      {authenticated ? children : <Navigate to="/home" replace />}
    </LandingPage>
  );
};

const mapStateToProps = ({ session }) => {
  return { authenticated: session.authenticated };
};

export default connect(mapStateToProps)(ProtectedRoute);
