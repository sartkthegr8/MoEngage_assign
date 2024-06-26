import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const BreweryDetails = () => {
  const { breweryId } = useParams();
  const [brewery, setBrewery] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(1); // Default rating value
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
        const response = await axios.get(`/api/reviews/${breweryId}`); // Adjust URL to your backend API
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
      };
      // Assuming your backend API endpoint for posting reviews is `/api/reviews`
      const response = await axios.post(`/api/reviews`, newReview);
      setReviews([...reviews, response.data]); // Add new review to the state
      setRating(1); // Reset rating input
      setDescription(""); // Clear description input
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
              <li key={review.id} className="my-2">
                <strong>Rating:</strong> {review.rating} <br />
                <strong>Description:</strong> {review.description}
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

export default BreweryDetails;
