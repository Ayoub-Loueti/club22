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
  setSignatureUrl(url);  
  setUrl(url);  
   
};

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '20px',
      }}
    >
      <div
        style={{ border: '2px solid black', width: '500px', height: '200px' }}
      >
        <SignatureCanvas
          canvasProps={{
            width: 500,
            height: 200,
            className: 'sigCanvas',
          }}
          ref={(data) => setSign(data)}
        />
      </div>

      <div style={{ marginTop: '10px' }}>
        <button
          style={{
            height: '30px',
            marginRight: '5px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
          onClick={handleClear}
        >
          Effacer
        </button>
        <button
          style={{
            height: '30px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
          onClick={handleGenerate}
        >
          Sauvegarder{' '}
        </button>
      </div>

      {url && (
        <div
          style={{
            marginTop: '10px',
            border: '1px solid #ccc',
            padding: '5px',
          }}
        >
          <img src={url} alt="Signature preview" />
        </div>
      )}
    </div>
  );
}
export default SignaturePad;
