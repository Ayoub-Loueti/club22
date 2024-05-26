const axios = require('axios');
   
module.exports = {
  Add: async (req, res) => {
         const { offreId, prix } = req.body;
    const url = 'https://developers.flouci.com/api/generate_payment';
    const payload = {
      app_token: '2724dad8-3f89-4edd-94d1-7ad3a23826aa',
      app_secret: process.env.FLOUCI_SECRET,
      amount: prix,
      accept_card: 'true',
      session_timeout_secs: 1200,
      success_link: 'http://localhost:3000/success',
      fail_link: 'http://localhost:3000/fail',
      developer_tracking_id: 'a1802106-55b6-482a-8069-8b72033b9188',
    };

    await axios
      .post(url, payload)
      .then((result) => {
        res.send(result.data);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({
          message: 'Échec de la création du paiement',
          error: err.message,
        });
      });
  },
  Verify: async (req, res) => {
    const payment_id = req.params.id;

    await axios
      .get(`https://developers.flouci.com/api/verify_payment/${payment_id}`, {
        headers: {
          'Content-Type': 'application/json',
          apppublic: '2724dad8-3f89-4edd-94d1-7ad3a23826aa',
          appsecret: process.env.FLOUCI_SECRET,
        },
      })
      .then((result) => {
        res.send(result.data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  },
};
