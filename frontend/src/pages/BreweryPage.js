import React, { useState, useEffect } from "react";
import axios from "axios";

const BreweryPage = ({ breweryId }) => {
  const [brewery, setBrewery] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(1); // Default rating value
  const [description, setDescription] = useState("");
  const [user, setUser] = useState(""); // Replace with actual user info if needed

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
        const response = await axios.get(
          `http://localhost:5000/api/reviews/${breweryId}`
        );
        setReviews(response.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchBrewery();
    fetchReviews();
  }, [breweryId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newReview = {
        breweryId,
        rating,
        description,
        user, // Assuming you have user information available
      };
      // Assuming your backend API endpoint for posting reviews is `/api/reviews`
      const response = await axios.post("http://localhost:5000/api/reviews", newReview);
      setReviews([...reviews, response.data]); // Add new review to the state
      setRating(1); // Reset rating input
      setDescription(""); // Clear description input
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  return (
    <div className="p-4">
      {brewery && (
        <>
          <h1 className="text-xl font-bold mb-2">{brewery.name}</h1>
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
        </>
      )}

      <hr className="my-4" />

      <h2 className="text-lg font-bold mb-2">Reviews</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex items-center mb-2">
          <label className="mr-2">Rating:</label>
          <select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="border p-2"
          >
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-2">
          <label className="block">Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-2 w-full"
            rows="4"
          ></textarea>
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2">
          Submit Review
        </button>
      </form>

      {reviews.length > 0 ? (
        <div>
          {reviews.map((review) => (
            <div key={review._id} className="border p-2 mb-2">
              <p>
                <strong>{review.user}</strong> rated: {review.rating}
              </p>
              <p>{review.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No reviews yet.</p>
      )}
    </div>
  );
};

export default BreweryPage;
