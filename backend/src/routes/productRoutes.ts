import { Router } from 'express';
import {
  getProducts,
  getProductById,
  addPurchase,
  getUserEcoScore,
  getTips,
} from '../controllers/productController';

const router = Router();

// Static paths must be registered before `/:id` so they are not captured as IDs.
router.get('/', getProducts);
router.post('/purchase', addPurchase);
router.get('/tips/all', getTips);
router.get('/user/:userId/eco-score', getUserEcoScore);
router.get('/:id', getProductById);

export default router;
