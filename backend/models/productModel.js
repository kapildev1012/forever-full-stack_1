import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: [String], required: true }, // Clarified image is an array of URLs
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    sizes: { type: [String], required: true }, // List of size labels (e.g., "S", "M", "1kg")
    bestseller: { type: Boolean, default: false },
    date: { type: Number, required: true } // Usually use `Date` type instead
});

// Optional: Create index to speed up category-based filtering
productSchema.index({ category: 1, subCategory: 1 });

const productModel = mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;