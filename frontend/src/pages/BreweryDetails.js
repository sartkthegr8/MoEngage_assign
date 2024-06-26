import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { connect } from "react-redux";

const API_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

const BreweryDetails = ({ user }) => {
  const { breweryId } = useParams();
  const [brewery, setBrewery] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(1);
  const [description, setDescription] = useState("");

  useEffect(() => {
    const fetchBrewery = async () => {
      try {
        const response = await axios.get(
          `https://api.openbrewerydb.org/breweries/${breweryId}`
        );
        setBrewery(response.data);
      } catch (error) {
        console.error("Error fetching brewery details:", error);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await axios.get(`${API_URL}/reviews/${breweryId}`);
        setReviews(response.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchBrewery();
    fetchReviews();
  }, [breweryId]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const newReview = {
        breweryId,
        rating,
        description,
        user: user.name,
      };
      const response = await axios.post(`${API_URL}/reviews/add`, newReview);
      setReviews([...reviews, response.data]);
      setRating(1);
      setDescription("");
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  return (
    <div className="p-8">
      {brewery ? (
        <div>
          <h1 className="text-2xl font-bold mb-4">{brewery.name}</h1>
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
          </a>
          <h2 className="text-xl font-bold mt-4">Reviews</h2>
          <ul>
            {reviews.map((review) => (
              <li key={review.id} className="my-4 p-4 bg-gray-100 bg-opacity-50 border rounded shadow">
                <p><strong>User:</strong> {review.user}</p>
                <p><strong>Rating:</strong> {review.rating}</p>
                <p><strong>Description:</strong> {review.description}</p>
              </li>
            ))}
          </ul>
          <h2 className="text-xl font-bold mt-4">Add a Review</h2>
          <form onSubmit={handleReviewSubmit} className="my-4">
            <div className="mb-4">
              <label className="block text-gray-700">Rating</label>
              <select
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="border p-2 w-full"
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border p-2 w-full"
                required
              />
            </div>
            <button type="submit" className="bg-blue-500 text-white p-2">
              Submit Review
            </button>
          </form>
        </div>
      ) : (
        <p>Loading brewery details...</p>
      )}
    </div>
  );
};

const mapStateToProps = ({ session }) => {
  return { user: session.user };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(BreweryDetails);
