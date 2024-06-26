// src/components/AccountPage.jsx

import React, { useState } from "react";

const AccountPage = () => {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="flex min-h-[80vh] max-h-[80vh] p-6">
      <div className="overflow-auto w-1/4 bg-white p-4 rounded-lg shadow-md">
        <ul className="space-y-4">
          <li>
            <button
              className={`w-full text-left p-2 rounded ${
                activeTab === "general"
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-200"
              }`}
              onClick={() => setActiveTab("general")}
            >
              General
            </button>
          </li>
          <li>
            <button
              className={`w-full text-left p-2 rounded ${
                activeTab === "settings"
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-200"
              }`}
              onClick={() => setActiveTab("settings")}
            >
              Settings
            </button>
          </li>
        </ul>
      </div>
      <div className="overflow-auto w-3/4 bg-white p-8 ml-6 rounded-lg shadow-md">
        {activeTab === "general" && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">General Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700">Photo</label>
                <input
                  type="file"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        )}
        {activeTab === "settings" && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block font-medium text-gray-700">
                  Reset Password
                </label>
                <button className="mt-1 px-4 py-2 bg-blue-500 text-white rounded-md">
                  Reset Password
                </button>
              </div>
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-red-600">
                  Danger Zone
                </h3>
                <div className="mt-2">
                  <button className="px-4 py-2 bg-red-500 text-white rounded-md">
                    Delete Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountPage;
