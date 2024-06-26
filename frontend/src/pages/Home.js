import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="text-lg font-bold">Your Logo</div>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => navigate("/login")}
            >
              Login/Signup
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow">
        <div className="relative">
          <img
            src="https://via.placeholder.com/1500x500"
            alt="Hero"
            className="w-full h-96 object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <h1 className="text-white text-4xl md:text-6xl font-bold">
              Welcome to BreweryApp
            </h1>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
