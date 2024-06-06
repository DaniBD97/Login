import express from 'express';
import { verifyToken } from '../middleware/verifyUser.js';
import { deleteUser, forgotPassword, updatePassword, updateUser } from '../controllers/user.controller.js';

const router = express.Router();

router.post('/update/:id', verifyToken, updateUser);
router.delete('/delete/:id', verifyToken, deleteUser);


router.post('/forgotPassword', forgotPassword);
router.put('/updatePassword/:userId',verifyToken,  updatePassword);

export default router;
