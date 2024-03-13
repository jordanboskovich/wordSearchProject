// routes/routes.js
import express from 'express';
import * as ctrl from '../controllers/gameController.js';
import * as authController from '../controllers/authController.js';

const router = express.Router();

// Define routes
router.get('/', authController.isAuthenticated, ctrl.renderPage);
// Login route
router.get('/login', authController.login);

// Authentication route
router.post('/login', authController.authenticate);
router.get('/register', authController.register);
router.post('/register', authController.verifyRegister);
router.get('/logout', authController.logout);


export default router;
