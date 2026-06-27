import { Router } from 'express';
import { AlertController } from '../controllers/alert.controller';
import { heavyQueriesLimiter } from '../middlewares/rate-limiter';

const router = Router();
const controller = new AlertController();

router.get('/alerts', heavyQueriesLimiter, controller.getFilteredAlerts);
router.get('/alerts/top-targeted', heavyQueriesLimiter, controller.getTopTargetedAssets);

export default router;
