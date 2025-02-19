import { Router } from 'express';
import { healthcheck } from '../controllers/healthcheck-controllers.js';

const router = Router(); 

// Healthcheck route to verify server status (could include additional details like DB status)
router.get('/health', healthcheck); 

export default router; 
