// backend/src/routes/productRoutes.ts
import { Router } from 'express';
import { getProducts, getProductById, signup, login, addPurchase, getUserEcoScore, getTips } from '../controllers/productController';
const router = Router();
// Product routes
router.get('/', getProducts);
router.get('/:id', getProductById);
// Auth routes
router.post('/auth/signup', signup);
router.post('/auth/login', login);
// User purchase routes
router.post('/purchase', addPurchase);
router.get('/user/:userId/eco-score', getUserEcoScore);
// Tips routes
router.get('/tips/all', getTips);
export default router;
//# sourceMappingURL=productRoutes.js.map