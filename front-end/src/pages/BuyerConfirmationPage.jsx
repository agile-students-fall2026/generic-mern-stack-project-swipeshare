import './BuyerConfirmationPage.css';
import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { useParams } from "react-router";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import { format } from 'date-fns';
import { useNavigate } from "react-router";


function BuyerConfirmationPage() {
    const { id } = useParams();
    const [data, setData] = useState({
        sellerName: ' ',
        meetupLocation: ' ',
        meetupTimeString: ' ',
        sellerPhone: ' '
    });
    const navigate = useNavigate();

    function stringifyDate(dateObj) {
        let nowTime = new Date();
        let scheduledDate = new Date(dateObj);
        console.log(scheduledDate.toDateString())
        let hoursDistance = scheduledDate.getHours() - nowTime.getHours();
        let minutesDistance = scheduledDate.getMinutes() - nowTime.getMinutes();
        let toReturn = ''

        if (nowTime.toDateString() === scheduledDate.toDateString()) {
            toReturn = `Today at ${format(scheduledDate, 'h:mm a')}`;
            if (hoursDistance === 0) {
                toReturn += `, in ${minutesDistance}m`;
            } else if (hoursDistance > 0) {
                toReturn += `, in ${hoursDistance}h ${minutesDistance}m`;
            }
        } else {
            toReturn = `${scheduledDate.toDateString()} at ${format(scheduledDate, 'h:mm a')}`;
        }
        return toReturn;
    }

    function handleComplete() {
        fetch('/api/purchase/complete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                purchaseId: id
            })
        }).then(r => {
            if (!r.ok) {
                console.error('Failed to mark purchase as complete');
                return;
            }
            r.json().then(() => {
                navigate(`/purchases/${id}/rate`);
            });
        });
    }

    function handleCancel() {
        fetch('/api/purchase/cancel', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                purchaseId: id
            })
        }).then(r => {
            if (!r.ok) {
                console.error('Failed to cancel purchase');
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
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(r => {
            if (!r.ok) {
                console.error('Failed to fetch purchase details');
                return;
            }

            r.json().then(purchaseDetails => {
                console.log(purchaseDetails.scheduledDate)
                setData(
                    {
                        sellerName: purchaseDetails.seller,
                        meetupLocation: purchaseDetails.location,
                        meetupTimeString: stringifyDate(purchaseDetails.scheduledDate),
                        sellerPhone: purchaseDetails.sellerPhone
                    }
                );
            })
        })
    }, [id]);

    return (
        <div>
            {/* <Header title="Purchase Confirmed" showBack={false}/> */}
            <div className="confirmation-container">
                <div className="confirmation-icon-container">
                    <FontAwesomeIcon icon={faCheckCircle} className="confirmation-icon" style={{"fontSize": "80px", "color":"forestGreen"}} />
                    <p className="confirmation-message">Purchase<br />Confirmed</p>
                </div>
                <p className="confirmation-meetup-name">Meet {data.sellerName} outside</p>
                <p className="confirmation-meetup-location">{data.meetupLocation}</p>
                <p className="confirmation-meetup-time">{data.meetupTimeString}</p>
                <p className="confirmation-payment-methods">Pay in-person by Venmo, Zelle, Cash, or Apple Pay Cash</p>
                <button className="submit-button" onClick={handleComplete}>Mark as Complete</button>
                <button className="submit-button" onClick={handleCancel}>Cancel Purchase</button>
                <button className="submit-button" onClick={handleCall}>Call Seller</button>
            </div>
        </div>

    )
}

export default BuyerConfirmationPage;