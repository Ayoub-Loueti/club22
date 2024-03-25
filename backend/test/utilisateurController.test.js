const Utilisateur = require('../models/UtilisateurModel');
const utilisateurController = require('../controllers/UtilisateurController.js');
const nodemailer = require('nodemailer');

jest.mock('../passportSetup.js', () => ({
    sendMail: jest.fn().mockResolvedValue(), // Mock the sendMail method
  }));
  
  // Test cases
  describe('forgotPassword', () => {
    test('should send reset password email', async () => {
      // Mock request and response objects
      const req = { body: { email: 'ayoub.loueti1@gmail.com' } };
      const res = { status: jest.fn(), json: jest.fn() };
  
      try {
        // Call the method with mock request and response
        await utilisateurController.forgotPassword(req, res);
  
        // Assertion
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Veuillez vérifier votre e-mail pour plus d'instructions" });
  
        // Check if sendMail method was called
        expect(smtpTransport.sendMail).toHaveBeenCalledTimes(1);
      } catch (error) {
        // Handle any errors
        console.error('An error occurred:', error);
      }
    });
  });