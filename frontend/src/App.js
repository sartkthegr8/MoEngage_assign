import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoutes";
import BasicRoutes from "routes/BasicRoutes";
import NotFound from "components/NotFound";
import EmailSent from "components/EmailSent";
import ForgotPassword from "components/ForgotPassword";
import PasswordReset from "components/PasswordReset";
import Home from "pages/Home";
import Account from "pages/Account";
import BreweryDetails from "pages/BreweryDetails";
import BreweryPage from "pages/BreweryPage";

const routes = [
  {
    path: "/home",
    element: <Home />,
    protected: false,
  },
  {
    path: "/account",
    element: <Account />,
    protected: true,
  },
  {
    path: "/login/:email?",
    element: <LoginPage />,
    protected: false,
  },
  {
    path: "/",
    element: <Dashboard />,
    protected: true,
  },
  {
    path: "/email/:type?/:email?",
    element: <EmailSent />,
    protected: false,
  },
  {
    path: "/forgot/password",
    element: <ForgotPassword />,
    protected: false,
  },
  {
    path: "/reset/password/:userId/:resetId",
    element: <PasswordReset />,
    protected: false,
  },
  {
    path: "/brewery/:breweryId",
    element: <BreweryDetails />,
    protected: true,
  },
  {
    path: "/brewery/:breweryId", // Add route for BreweryPage
    element: <BreweryPage />,
    protected: false, // Change to true if you want to protect this route
  },
];

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {routes.map((route, index) => {
          if (route.protected) {
            return (
              <Route
                key={index}
                path={route.path}
                element={<ProtectedRoute>{route.element}</ProtectedRoute>}
              />
            );
          } else {
            return (
              <Route
                key={index}
                path={route.path}
                element={<BasicRoutes>{route.element}</BasicRoutes>}
              />
            );
          }
        })}
        <Route
          path="*"
          element={
            <ProtectedRoute>
              <NotFound />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
