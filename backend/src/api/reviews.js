const express = require("express");
const Review = require("../models/Review");

const router = express.Router();

router.get('/ratings', async (req, res) => {
  try {
    const reviews = await Review.aggregate([
      {
        $group: {
          _id: "$breweryId",
          averageRating: { $avg: "$rating" }
        }
      }
    ]);
    const ratingsObject = reviews.reduce((acc, review) => {
      acc[review._id] = review.averageRating;
      return acc;
    }, {});
    res.json(ratingsObject);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});




// POST a new review
router.post("/add", async (req, res) => {
  try {
    const { breweryId, rating, description, user } = req.body;
    const newReview = new Review({ breweryId, rating, description, user });
    const savedReview = await newReview.save();
    res.status(201).json(savedReview);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});



// GET all reviews for a specific brewery
router.get("/:breweryId", async (req, res) => {
  try {
    const reviews = await Review.find({ breweryId: req.params.breweryId });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
