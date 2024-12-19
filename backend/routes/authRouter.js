import express from 'express';
import { signin,signOut,customerSignup } from '../controllers/auth.controller.js';

const router = express.Router();

router.post("/signin", signin);
router.post("/signup", customerSignup);
router.post('/signout', signOut)

export default router;