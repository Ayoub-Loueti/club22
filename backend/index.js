const express = require('express');
const mydb = require('./config/db');
const app = express();
const utilisateur = require('./routes/UtilisateurRoute');
const admin = require('./routes/AdminRoute');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
app.use(express.json()); 
app.use(cors());



app.use(utilisateur);
app.use(admin);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
