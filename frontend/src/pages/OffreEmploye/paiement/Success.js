import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

function Success() {
    const [searchParams] = useSearchParams();
    const [result, setResult] = useState("");

    useEffect(() => {
        const paymentId = searchParams.get('payment_id');
        const reservationId = localStorage.getItem('reservationId');

        if (reservationId) {
            axios.post(`api/payment/${paymentId}`)
                .then((res) => {
                    if (res.data.result.status === 'SUCCESS') {
                        axios.put(`http://localhost:5000/reservations/${reservationId}/payereserv`)
                            .then((updateRes) => {
                                setResult('Payment status updated to paid successfully');
                                localStorage.removeItem('reservationId');
                            })
                            .catch((updateErr) => {
                                console.error('Error updating payment status:', updateErr);
                                setResult('Failed to update payment status');
                            });
                    } else {
                        setResult('Payment failed');
                    }
                })
                .catch((err) => {
                    console.error(err);
                    setResult('Error during payment verification');
                });
        } else {
            setResult('Reservation ID not found in local storage');
        }
    }, [searchParams]);

    return (
        <React.Fragment>
            <div>{result}</div>
        </React.Fragment>
    );
}

export default Success;