import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";


const Dashboard = ({ user }) => {
  const [query, setQuery] = useState("");
  const [searchBy, setSearchBy] = useState("city");
  const [breweries, setBreweries] = useState([]);
  const [ratings, setRatings] = useState({});

  useEffect(() => {
    try {
      const response = axios.get(`${API_URL}/reviews/ratings`); // Adjust URL to your backend API
      response.then((res)=>{setRatings(res.data)});
      // console.log(response);
      // setRatings(response.data);
    } catch (error) {
      setRatings({});
      console.error("Error fetching breweries:", error);
    }
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `https://api.openbrewerydb.org/breweries?by_${searchBy}=${query}`
      );
      setBreweries(response.data);
    } catch (error) {
      console.error("Error fetching breweries:", error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">
        Welcome {user.name} to the Brewery Dashboard
      </h1>
      <form onSubmit={handleSearch} className="my-4 flex space-x-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
          className="border p-2 flex-1"
        />
        <select
          value={searchBy}
          onChange={(e) => setSearchBy(e.target.value)}
          className="border p-2"
        >
          <option value="city">City</option>
          <option value="name">Name</option>
          <option value="type">Type</option>
        </select>
        <button type="submit" className="bg-blue-500 text-white p-2">
          Search
        </button>
      </form>

      {breweries.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          {breweries.map((brewery) => (
            <div key={brewery.id} className="bg-white shadow-md rounded-lg p-4">
              <h2 className="text-xl font-bold mb-2">
                <Link
                  to={`/brewery/${brewery.id}`} // Link to BreweryDetails
                  className="text-blue-500 hover:underline"
                >
                  {brewery.name}
                </Link>
              </h2>
              <p>{brewery.street}</p>
              <p>
                {brewery.city}, {brewery.state}
              </p>
              <p>Phone: {brewery.phone}</p>
              <a
                href={brewery.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {brewery.website_url}
              </a>{console.log(ratings,brewery)}
              {!!Object.keys(ratings||{})?.length && ratings[brewery.id]  &&(<p className="mt-2">Current Rating: {ratings[brewery.id]}</p>
              )}            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const mapStateToProps = ({ session }) => {
  return { user: session.user };
};

export default connect(mapStateToProps)(Dashboard);
