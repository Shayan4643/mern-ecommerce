import express from 'express';
import { placeOrder, getAllOrders, deleteOrder, deleteAllOrders } from '../controllers/orderController.js';

const router = express.Router();

router.post('/place-order', placeOrder);
router.get('/all', getAllOrders);
router.delete('/all', deleteAllOrders);
router.delete('/:id', deleteOrder);

export default router;

