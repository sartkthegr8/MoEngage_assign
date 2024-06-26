import React from "react";
import { Navigate } from "react-router-dom";
import { connect } from "react-redux";

const ProtectedRoute = ({ children, authenticated }) => {
  return !authenticated ? children : <Navigate to="/" replace />;
};

const mapStateToProps = ({ session }) => {
  return { authenticated: session.authenticated };
};

export default connect(mapStateToProps)(ProtectedRoute);
