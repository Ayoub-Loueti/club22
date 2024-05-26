import React, { useEffect, useState } from 'react';
import {useSearchParams} from 'react-router-dom'
import axios from 'axios';
function Success() {
    const [searchParams] = useSearchParams();
    const [result,setResult]= useState("");
    useEffect(() => {
      const paymentId = searchParams.get('payment_id'); // Correction ici
      axios
        .post(`api/payment/${paymentId}`)
        .then((res) => {
setResult(res.data.result.status)
        })
        .catch((err) => console.error(err));
    }, []); 
    
  return (
    <React.Fragment>
      {result === 'SUCCESS' && (
        <div>
          <div>Success payment</div>
        </div>
      )}

    </React.Fragment>
  );
}

export default Success