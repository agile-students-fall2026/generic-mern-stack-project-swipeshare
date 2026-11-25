import "./RatingPage.css";
import { Header } from "@/components/Header";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import RatingSlider from "../components/ratingSlider.jsx";

function RatingPage() {
  const { id } = useParams();
  const [slot, setSlot] = useState(<span></span>);
  const [userRating, setUserRating] = useState(-1);
  const navigate = useNavigate();

  function handleReviewSubmit() {
    fetch("/api/review", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        purchaseId: id,
        rating: userRating,
        comment: document.querySelector(".comment-box").value,
      }),
    }).then((r) => {
      if (!r.ok) {
        console.error("Failed to submit review");
        return;
      }
      r.json().then(() => {
        navigate("/select-user-type", { replace: true });
      });
    });
  }

  useEffect(() => {
    async function fetchOtherParty() {
      const [purchaseRes, meRes] = await Promise.all([
        fetch(`/api/purchases/${id}`),
        fetch("/api/me"),
      ]);
      if (!purchaseRes.ok || !meRes.ok) {
        console.error("Failed to fetch purchase details");
        return;
      }
      const purchase = await purchaseRes.json();
      const me = await meRes.json();
      // Sellers rate the buyer, buyers rate the seller.
      const other =
        purchase.seller.id === me.id ? purchase.buyer : purchase.seller;
      setSlot(
        <p className="rate-name">
          {other.firstName} {other.lastInitial}.
        </p>,
      );
    }
    fetchOtherParty();
  }, [id]);

  return (
    <div>
      <Header title="Rating" />
      <div className="rating-container">
        <p className="rate-name-header">Rate your experience with</p>
        {slot}
        <RatingSlider setUserRating={setUserRating} />
        <p className="comment-box-header">Comment</p>
        <textarea
          className="comment-box"
          type="text"
          placeholder="Write a comment..."
        />
        <button className="submit-button" onClick={handleReviewSubmit}>
          Submit Rating
        </button>
      </div>
    </div>
  );
}

export default RatingPage;
