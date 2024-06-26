import React from "react";

const NotFound = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          404 - Page Not Found
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Sorry, the page you're looking for doesn't exist.
        </p>
        <a href="/" className="text-blue-500 hover:underline">
          Go back to homepage
        </a>
      </div>
    </div>
  );
};

export default NotFound;
