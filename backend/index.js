const express = require('express');
const mydb = require('./config/db');
const app = express();
const utilisateur = require('./routes/UtilisateurRoute');
const admin = require('./routes/AdminRoute');
const post = require('./routes/PostRoute');
const notif = require('./routes/NotificationRoute');
const likes = require('./routes/LikesRoute');
const comments = require('./routes/CommentairesRoute');
const reservation = require('./routes/ReservationRoute');
const collaborateur = require('./routes/CollaborateurRoute');
const offre = require('./routes/OffreRoute');
const employe = require('./routes/EmployeRoute');
const messages = require('./routes/MessagesRoute');
const dashboard = require('./routes/DashboardRoute');
const dotenv = require('dotenv');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const multer = require('multer');
const path = require('path');
require('./passportSetup'); // Path to your passport configuration file
dotenv.config();
app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:3000', // Adjust this to match your frontend's URL
    credentials: true, // Allows cookies and credentials to be sent along with the request
  })
);

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === 'production', // Only use secure cookies in production
      httpOnly: true, // Helps mitigate XSS attacks
      maxAge: 24 * 60 * 60 * 1000, // 24 hours, for example
    },
  })
);
// Initialize Passport and session handling
app.use(passport.initialize());
app.use(passport.session());

app.use(utilisateur);
app.use(admin);
app.use(post);
app.use(notif);
app.use(likes);
app.use(comments);
app.use(reservation);
app.use(collaborateur);
app.use(offre);
app.use(employe);
app.use(dashboard);
app.use(messages);

app.use('/uploads', express.static('uploads'));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // save files to the 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // set unique filename
  },
});

const upload = multer({ storage });

// Handle image upload
app.post('/upload-image', upload.single('file'), (req, res) => {
  const imageUrl = `uploads/${req.file.filename}`;
  res.json({ imageUrl });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {

  console.log(`Server is running on port ${PORT}`);
});

const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
      origin:"http://localhost:3000",
    },
});

io.on("connection", (socket) => {
  console.log("connected to socket io");
  socket.on("setup", (userId) => {
    socket.join(userId);
    console.log(userId);
    socket.emit("connected");
  });

  socket.on('join chat', (room) => {
    socket.join(room);
    console.log('User joined Room: ' + room);
  });
  
  socket.on ('typing',(room) => socket.in (room).emit("typing"));
  socket.on ('stop typing',(room) => socket.in (room).emit("stop typing"));

  socket.on("new message", (messageData) => {
    io.to(messageData.room).emit("message received", messageData.message,messageData.userId);
  });
});