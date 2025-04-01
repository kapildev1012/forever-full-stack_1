import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";

const ReviewSection = ({ productId }) => {
  const { user } = useContext(ShopContext); // Get user details
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [editingReview, setEditingReview] = useState(null);

  // Fetch reviews
  useEffect(() => {
    axios
      .get(`/api/reviews/${productId}`)
      .then((res) => setReviews(res.data))
      .catch((err) => console.error("Error fetching reviews:", err));
  }, [productId]);

  // Submit a new review
  const handleReviewSubmit = async () => {
    try {
      const response = await axios.post(
        "/api/reviews",
        { ...newReview, productId },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setReviews([...reviews, response.data]);
      setNewReview({ rating: 5, comment: "" });
    } catch (error) {
      alert("You have already reviewed this product!");
    }
  };

  // Edit a review
  const handleEditReview = async (reviewId) => {
    try {
      const response = await axios.put(`/api/reviews/${reviewId}`, newReview, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setReviews(reviews.map((r) => (r._id === reviewId ? response.data : r)));
      setEditingReview(null);
    } catch (error) {
      alert("Error updating review!");
    }
  };

  return (
    <div className="mt-10">
      <h3 className="text-xl font-semibold">Customer Reviews</h3>
      <div>
        {reviews.map((review) => (
          <div key={review._id} className="border p-3 my-2">
            <p>
              <b>{review.userId.name}</b> rated: {review.rating}⭐
            </p>
            <p>{review.comment}</p>
            {user && user.id === review.userId._id && (
              <>
                <button
                  onClick={() => setEditingReview(review._id)}
                  className="text-blue-500"
                >
                  Edit
                </button>
              </>
            )}
          </div>
        ))}
      </div>

      {user && (
        <div className="mt-5">
          <h4>{editingReview ? "Edit Review" : "Add a Review"}</h4>
          <select
            value={newReview.rating}
            onChange={(e) =>
              setNewReview({ ...newReview, rating: e.target.value })
            }
          >
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>
                {num} Stars
              </option>
            ))}
          </select>
          <textarea
            value={newReview.comment}
            onChange={(e) =>
              setNewReview({ ...newReview, comment: e.target.value })
            }
            className="border p-2 w-full"
          />
          <button
            onClick={
              editingReview
                ? () => handleEditReview(editingReview)
                : handleReviewSubmit
            }
            className="bg-black text-white px-4 py-2 mt-2"
          >
            {editingReview ? "Update Review" : "Submit Review"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
