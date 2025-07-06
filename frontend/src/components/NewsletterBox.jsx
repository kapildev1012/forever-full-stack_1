import React, { useState } from "react";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { toast } from "react-toastify";

const NewsletterBox = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (!email) {
      toast.error("Please enter a valid email.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await new Promise((resolve) =>
        setTimeout(() => resolve({ success: true }), 1500)
      );

      if (response.success) {
        toast.success("Subscribed successfully! Enjoy your 20% off.");
        setEmail("");
      }
    } catch (error) {
      toast.error("There was an error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="text-center py-10 px-5 bg-white">
      <p className="text-2xl sm:text-3xl font-semibold text-gray-800">
        Subscribe now & get exclusive offers
      </p>
      <p className="text-gray-500 mt-2 text-sm sm:text-base">
        Get the latest updates and exclusive offers!
      </p>

      <form
        onSubmit={onSubmitHandler}
        className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-lg mx-auto"
      >
        <input
          className="w-full py-3 px-4 rounded border text-sm outline-none focus:ring-2 focus:ring-black transition"
          type="email"
          placeholder="Enter your email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          type="submit"
          className={`w-full sm:w-auto bg-black text-white text-sm px-6 py-3 rounded transition ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? "SUBSCRIBING..." : "SUBSCRIBE"}
        </button>
      </form>

      {/* Social Buttons */}
      <div className="flex  sm:flex-row justify-center items-center gap-3 mt-8">
        <a
          href="https://www.instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-pink-600 text-white px-3 py-2 text-sm rounded-full shadow hover:scale-105 transition"
        >
          <FaInstagram /> Instagram
        </a>
        <a
          href="https://www.facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 text-sm rounded-full shadow hover:scale-105 transition"
        >
          <FaFacebookF /> Facebook
        </a>
        <a
          href="https://wa.me/917650965133"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-green-500 text-white px-3 py-2 text-sm rounded-full shadow hover:scale-105 transition"
        >
          <FaWhatsapp /> WhatsApp
        </a>
      </div>
    </div>
  );
};

export default NewsletterBox;
