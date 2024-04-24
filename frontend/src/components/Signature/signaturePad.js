import React, { useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';

function SignaturePad({ setSignatureUrl }) {
  const [sign, setSign] = useState();
  const [url, setUrl] = useState();

  const handleClear = () => {
    sign.clear();
    setUrl('');
  };
  const handleGenerate = () => {
  const url = sign.getTrimmedCanvas().toDataURL('image/png');
  setSignatureUrl(url);  // Make sure this function is properly updating the parent state
  setUrl(url);  // This updates the local state for display 
   
};

  return (
    <div>
      <div style={{ border: '2px solid black', width: 500, height: 200 }}>
        <SignatureCanvas
          canvasProps={{ width: 500, height: 200, className: 'sigCanvas' }}
          ref={(data) => setSign(data)}
        />
      </div>

      <br></br>
      <button style={{ height: '30px', width: '60px' }} onClick={handleClear}>
        Clear
      </button>
      <button
        style={{ height: '30px', width: '60px' }}
        onClick={handleGenerate}
      >
        Save
      </button>

      <br />
      <br />
      <img src={url} />
    </div>
  );
}
export default SignaturePad;
