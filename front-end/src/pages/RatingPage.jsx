import "./RatingPage.css";
import { Header } from "@/components/Header";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import RatingSlider from "../components/ratingSlider.jsx";

function RatingPage() {
  const { id } = useParams();
  const [slot, setSlot] = useState(<span></span>);
  const [userRating, setUserRating] = useState(-1);

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
      r.json().then((response) => {
        // TODO link back to marketplace or whatever
        console.log("review sent");
      });
    });
  }

  useEffect(() => {
    fetch(`/api/purchases/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((r) => {
      if (!r.ok) {
        console.error("Failed to fetch purchase details");
        return;
      }

      r.json().then((purchaseDetails) => {
        console.log("returning");
        setSlot(<p className="rate-name">{purchaseDetails.seller}</p>);
      });
    });
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
