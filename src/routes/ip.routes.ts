import { Router } from 'express';
import { IpController } from '../controllers/ip.controller';
import { writeOperationsLimiter, heavyQueriesLimiter } from '../middlewares/rate-limiter';

const router = Router();
const controller = new IpController();

router.get('/highlighted-ips', controller.getAll);
router.post('/highlighted-ips', writeOperationsLimiter, controller.create);
router.put('/highlighted-ips/:id', writeOperationsLimiter, controller.update);
router.delete('/highlighted-ips/:id', writeOperationsLimiter, controller.delete);

router.get('/alerts/monitoring', heavyQueriesLimiter, controller.getMonitoring);

export default router;
