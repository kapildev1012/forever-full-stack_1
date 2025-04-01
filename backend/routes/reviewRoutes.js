import express from "express";
import Review from "../models/Review.js";
import { verifyToken } from "../middleware/auth.js"; // Ensures only logged-in users can review

const router = express.Router();

// ✅ Add a new review
router.post("/", verifyToken, async(req, res) => {
    try {
        const { productId, rating, comment } = req.body;
        const userId = req.user.id; // Get user from token

        // Check if the user already reviewed this product
        const existingReview = await Review.findOne({ productId, userId });
        if (existingReview) return res.status(400).json({ message: "You have already reviewed this product!" });

        const newReview = new Review({ productId, userId, rating, comment });
        await newReview.save();
        res.status(201).json(newReview);
    } catch (error) {
        res.status(500).json({ message: "Failed to add review", error });
    }
});

// ✅ Fetch all reviews for a product
router.get("/:productId", async(req, res) => {
    try {
        const reviews = await Review.find({ productId: req.params.productId }).populate("userId", "name");
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch reviews", error });
    }
});

// ✅ Edit a review
router.put("/:reviewId", verifyToken, async(req, res) => {
    try {
        const { rating, comment } = req.body;
        const review = await Review.findById(req.params.reviewId);

        if (!review) return res.status(404).json({ message: "Review not found" });
        if (review.userId.toString() !== req.user.id) return res.status(403).json({ message: "Not authorized!" });

        review.rating = rating;
        review.comment = comment;
        await review.save();
        res.status(200).json(review);
    } catch (error) {
        res.status(500).json({ message: "Failed to update review", error });
    }
});

export default router;