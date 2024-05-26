import React,{useState} from 'react';
import axios from 'axios';
function Payment() {

const[form,setForm]=useState({})
const onchange = (e)=>{
    setForm({
        ...form,
        [e.target.name]:e.target.value,
    });
};
const onsubmit = (e)=>{
    e.preventDefault();
axios
.post("api/payment",form)
.then(res =>
    {
        const{result}=res.data
        window.location.href = result.link
        console.log(res.data)
    }
)
.catch(err => console.error(err));
}



  return (
    <div >
    <h2>Page de paiement</h2>
      <form  onSubmit={onsubmit}>
        <input type="text" name="amount"  onChange={onchange} />
        <button >Payer</button>
      </form>
    </div>
  );
}

export default Payment;
