import express from 'express';
import * as ctrl from '../controllers/gameController.js';

const router = express.Router();

// Define routes
router.get('/', ctrl.renderPage);
            
export default router;
