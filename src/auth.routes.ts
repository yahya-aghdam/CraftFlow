import express from 'express';
import AuthController from './auth.controller';

const router = express.Router();
const authController = new AuthController()

router.get('/register_login', authController.register_login.bind(authController));
router.get('/google', authController.google.bind(authController));
router.get("/successful_auth", authController.successfulAuth.bind(authController))

export default router;
