import React from "react";
import { useNavigate, useParams } from "react-router-dom";

const VerificationMessage = () => {
  const navigate = useNavigate();
  const { email, type } = useParams();
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md text-center">
        <svg
          className="w-16 h-16 text-green-500 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12l2 2l4-4m6 2a9 9 0 1 1-18 0a9 9 0 0 1 18 0z"
          ></path>
        </svg>
        <h2 className="text-2xl font-semibold mb-2">
          {type === "verification"
            ? "Verification Email Sent!"
            : type === "reset"
            ? "Password Reset"
            : "Password Reset"}
        </h2>
        {type && email && (
          <p className="text-gray-600">
            A{" "}
            {type === "verification"
              ? "verification email"
              : type === "reset"
              ? "password reset email"
              : ""}{" "}
            has been sent to
            <span className="font-medium text-gray-800 block">
              <b className="text-blue-800">{email}</b>
            </span>
            . Please check your inbox and follow the instructions to{" "}
            {type === "verification"
              ? "verify your email"
              : type === "reset"
              ? "reset your password"
              : ""}
            .
          </p>
        )}
        {!type && !email && (
          <>
            <p className="text-gray-600">
              Your password has been reset successfully.
            </p>
            <p className="text-gray-600">Your may now login!</p>
            <button
              className="block w-52 my-5 mx-auto py-2.5 px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-center rounded-md text-md"
              onClick={() => navigate(`/login`)}
            >
              Login
            </button>
          </>
        )}
        {type === "verification" && (
          <button
            className="block w-52 my-5 mx-auto py-2.5 px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-center rounded-md text-md"
            onClick={() => navigate(`/login/${email}`)}
          >
            Proceed
          </button>
        )}
      </div>
    </div>
  );
};

export default VerificationMessage;
