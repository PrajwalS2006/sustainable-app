import { Router } from 'express';
import {
  addSupplyChainMovement,
  getSupplyChainAnomalies,
  getSupplyChainGraph,
  listActors,
} from '../controllers/supplyChainController';
import { requireAdmin, requireAuth } from '../middleware/authMiddleware';

const router = Router();

// Admin/operator can record movement events that define the supply-chain graph.
router.post('/:productId/movements', requireAuth, requireAdmin, addSupplyChainMovement);

// Public endpoints (verification + anomaly flags included).
router.get('/actors', listActors);
router.get('/:productId', getSupplyChainGraph);
router.get('/:productId/anomalies', getSupplyChainAnomalies);

export default router;

