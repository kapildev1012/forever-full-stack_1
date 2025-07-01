import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";

const ReviewSection = ({ productId }) => {
  const { user } = useContext(ShopContext);

  const [reviews, setReviews] = useState([]);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [form, setForm] = useState({
    rating: 5,
    comment: "",
    media: [],
  });

  const [previewMedia, setPreviewMedia] = useState([]);

  // Fetch Reviews
  useEffect(() => {
    axios
      .get(`/api/reviews/${productId}`)
      .then((res) => setReviews(res.data))
      .catch((err) => console.error("Fetch review error:", err));
  }, [productId]);

  // Media selection
  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    setForm((prev) => ({ ...prev, media: files }));

    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewMedia(previews);
  };

  // Submit new or edited review
  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("username", user?.name || "Guest"); // ✅ Required by backend
    formData.append("rating", form.rating);
    formData.append("comment", form.comment);
    formData.append("timestamp", new Date().toISOString());

    form.media.forEach((file) => formData.append("media", file));

    try {
      if (editingReviewId) {
        // If you want to implement review updating via PUT, uncomment below and fix backend first
        /*
        await axios.put(`/api/reviews/${editingReviewId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        */
      } else {
        // ✅ New review
        const res = await axios.post(
          `/api/reviews/add-review/${productId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        // Push latest review from response
        const updatedProduct = res.data.product;
        const newReview = updatedProduct.reviews.at(-1);
        setReviews((prev) => [...prev, newReview]);
      }

      // Reset form
      setForm({ rating: 5, comment: "", media: [] });
      setPreviewMedia([]);
      setEditingReviewId(null);
    } catch (error) {
      console.error("Review error:", error);
      alert("Error submitting review!");
    }
  };

  const toggleReadMore = (e) => {
    const el = e.target;
    el.classList.toggle("line-clamp-4");
  };

  return (
    <div className="mt-10">
      <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>

      <div className="grid sm:grid-cols-2 gap-4">
        {reviews.map((review) => (
          <div
            key={review._id}
            className="border rounded-lg p-4 shadow-sm bg-white"
          >
            <div className="flex justify-between items-center">
              <h4 className="font-semibold">
                {review.username || review.name || review.userId?.name}
              </h4>
              <span className="text-yellow-500 font-medium">
                {review.rating} ★
              </span>
            </div>
            <p
              className="text-sm text-gray-600 mt-2 line-clamp-4 cursor-pointer"
              onClick={toggleReadMore}
            >
              {review.comment}
            </p>

            {review.media?.length > 0 && (
              <div className="flex gap-2 flex-wrap mt-3">
                {review.media.map((file, i) =>
                  file.url?.includes("video") || file.includes("video") ? (
                    <video
                      key={i}
                      src={file.url || file}
                      className="w-24 h-24 object-cover rounded"
                      controls
                    />
                  ) : (
                    <img
                      key={i}
                      src={file.url || file}
                      alt="review media"
                      className="w-24 h-24 object-cover rounded"
                    />
                  )
                )}
              </div>
            )}

            {user?.id === review.userId?._id && (
              <button
                onClick={() => {
                  setEditingReviewId(review._id);
                  setForm({
                    rating: review.rating,
                    comment: review.comment,
                    media: [], // not reuploading old media
                  });
                }}
                className="text-blue-500 text-sm mt-3 underline"
              >
                Edit
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Review Form */}
      {user && (
        <div className="mt-10 border rounded p-4 bg-gray-50">
          <h4 className="font-semibold mb-2">
            {editingReviewId ? "Edit Your Review" : "Write a Review"}
          </h4>

          <select
            value={form.rating}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, rating: e.target.value }))
            }
            className="border px-3 py-1 mb-2"
          >
            {[5, 4, 3, 2, 1].map((num) => (
              <option key={num} value={num}>
                {num} Stars
              </option>
            ))}
          </select>

          <textarea
            placeholder="Write your honest experience..."
            value={form.comment}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, comment: e.target.value }))
            }
            className="w-full border px-3 py-2 rounded h-24 mb-2"
          />

          <input
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleMediaChange}
            className="mb-2"
          />

          {previewMedia.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {previewMedia.map((file, i) => (
                <img
                  key={i}
                  src={file}
                  alt="preview"
                  className="w-20 h-20 object-cover rounded border"
                />
              ))}
            </div>
          )}

          <button
            onClick={handleSubmit}
            className="bg-black text-white px-6 py-2 mt-4 rounded"
          >
            {editingReviewId ? "Update Review" : "Submit Review"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
