import "./BuyerConfirmationPage.css";
import { Header } from "@/components/Header";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

function BuyerConfirmationPage() {
  const { id } = useParams();
  const [data, setData] = useState({
    sellerName: " ",
    meetupLocation: " ",
    meetupTimeString: " ",
    sellerPhone: " ",
  });
  const navigate = useNavigate();

  function stringifyDate(dateObj) {
    let nowTime = new Date();
    let scheduledDate = new Date(dateObj);
    console.log(scheduledDate.toDateString());
    let distanceMs = scheduledDate - nowTime;
    let distanceHrs = Math.floor(distanceMs / (1000 * 60 * 60));
    let distanceMins = Math.floor(
      (distanceMs % (1000 * 60 * 60)) / (1000 * 60),
    );
    let toReturn = "";

    if (nowTime.toDateString() === scheduledDate.toDateString()) {
      toReturn = `Today at ${format(scheduledDate, "h:mm a")}`;
      if (distanceHrs === 0) {
        toReturn += `, in ${distanceMins}m`;
      } else if (distanceHrs > 0) {
        toReturn += `, in ${distanceHrs}h ${distanceMins}m`;
      }
    } else {
      toReturn = `${scheduledDate.toDateString()} at ${format(scheduledDate, "h:mm a")}`;
    }
    return toReturn;
  }

  function handleComplete() {
    fetch(`/api/purchases/${id}/complete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        purchaseId: id,
      }),
    }).then((r) => {
      if (!r.ok) {
        console.error("Failed to mark purchase as complete");
        return;
      }
      r.json().then((data) => {
        navigate(`/purchases/${data.id}/rate`);
      });
    });
  }

  function handleCancel() {
    fetch(`/api/purchases/${id}/cancel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        purchaseId: id,
      }),
    }).then((r) => {
      if (!r.ok) {
        console.error("Failed to cancel purchase");
        return;
      }
      r.json().then(() => {
        navigate(`/marketplace`);
      });
    });
  }

  function handleCall() {
    window.location.href = `tel:${data.sellerPhone}`;
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
        console.log(purchaseDetails);
        let paymentTypeString = "";
        let paymentMethods = purchaseDetails.paymentMethods
          .map((method) =>
            (method.charAt(0).toUpperCase() + method.slice(1)).replace(
              "_c",
              " Pay C",
            ),
          )
          .join(", ");

        if (purchaseDetails.paymentMethods.length > 2) {
          // insert "or"
          let lastCommaIndex = paymentMethods.lastIndexOf(",");
          paymentTypeString =
            paymentMethods.substring(0, lastCommaIndex) +
            ", or" +
            paymentMethods.substring(lastCommaIndex + 1);
        } else if (purchaseDetails.paymentMethods.length === 2) {
          let lastCommaIndex = paymentMethods.lastIndexOf(",");
          paymentTypeString =
            paymentMethods.substring(0, lastCommaIndex) +
            " or" +
            paymentMethods.substring(lastCommaIndex + 1);
        } else {
          paymentTypeString = paymentMethods;
        }

        setData({
          sellerName:
            purchaseDetails.seller.firstName +
            " " +
            purchaseDetails.seller.lastInitial,
          meetupLocation: purchaseDetails.diningHall
            ? purchaseDetails.diningHall.name
            : "GrubHub",
          meetupTimeString: purchaseDetails.meetAt
            ? stringifyDate(purchaseDetails.meetAt)
            : "",
          sellerPhone: purchaseDetails.sellerPhone,
          paymentTypeString: paymentTypeString,
        });
      });
    });
  }, [id]);

  return (
    <div>
      {/* <Header title="Purchase Confirmed" showBack={false}/> */}
      <div className="confirmation-container">
        <div className="confirmation-icon-container">
          <FontAwesomeIcon
            icon={faCheckCircle}
            className="confirmation-icon"
            style={{ fontSize: "80px", color: "forestGreen" }}
          />
          <p className="confirmation-message">
            Purchase
            <br />
            Confirmed
          </p>
        </div>
        <p className="confirmation-meetup-name">
          {data.meetupTimeString
            ? "Meet " + data.sellerName + ". outside"
            : data.sellerName + " will purchase from"}
        </p>
        <p className="confirmation-meetup-location">{data.meetupLocation}</p>
        <p className="confirmation-meetup-time">{data.meetupTimeString}</p>
        <p className="confirmation-payment-methods">
          Pay by {data.paymentTypeString}
        </p>
        <button className="submit-button" onClick={handleComplete}>
          Mark as Complete
        </button>
        <button className="submit-button" onClick={handleCancel}>
          Cancel Purchase
        </button>
        <button className="submit-button" onClick={handleCall}>
          Call Seller
        </button>
      </div>
    </div>
  );
}

export default BuyerConfirmationPage;
