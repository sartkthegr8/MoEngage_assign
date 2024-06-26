// LandingPage.js
import { logoutUser } from "helper/auth";
import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";

const LandingPage = ({ children, user }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navigate = useNavigate();

  const dropdownRef = useRef(null);

  const handleHomeClick = () => {
    if (user) {
      navigate("/"); // Navigate to the dashboard home page
    } else {
      navigate("/login"); // Navigate to the login page if not signed in
    }
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-white shadow w-full h-[90px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="text-lg font-bold">BreweryApp
            </div>
            <div 
              className="cursor-pointer text-lg font-bold text-blue-500 "
              onClick={handleHomeClick}
            >
              Home
            </div>
            <div className="relative" ref={dropdownRef}>
              <button
                type="dropdown"
                className="flex items-center space-x-2"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <span className="flex justify-center items-center bg-[#b1badf] text-white text-2xl font-semibold w-10 h-10 rounded-full">
                  {user?.name?.charAt(0)}
                </span>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg py-1">
                  <p className="block px-4 py-2 border-b">
                    HI, <span className="capitalize">{user.name}</span>!
                  </p>
                  <button
                    type="button"
                    className="block px-4 w-full text-left py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => navigate("/account")}
                  >
                    Account
                  </button>
                  <button
                    type="button"
                    className="block px-4 w-full text-left py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => logoutUser(() => navigate("/home"))}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-5 overflow-auto h-[calc(100vh-90px)]">{children}</main>
    </div>
  );
};

const mapStateToProps = ({ session }) => {
  return { user: session.user };
};
const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(LandingPage);
