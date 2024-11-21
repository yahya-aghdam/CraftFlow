import express from 'express';
import AuthController from './auth.controller';

const router = express.Router();
// Initialize an Express router instance to define route handlers

const authController = new AuthController();
// Create an instance of the AuthController to handle authentication logic

// Route for user registration and login
router.get('/register_login', authController.register_login.bind(authController));
// Bind the `register_login` method of the AuthController to the `/register_login` route
// `bind(authController)` ensures the method retains the correct `this` context

// Route for Google OAuth handling
router.get('/google', authController.google.bind(authController));
// Bind the `google` method of the AuthController to the `/google` route
// This is triggered after Google redirects back to your app with an authorization code

// Route to confirm successful authentication
router.get("/successful_auth", authController.successfulAuth.bind(authController));
// Bind the `successfulAuth` method to the `/successful_auth` route
// This route provides feedback that the authentication process completed successfully

export default router;
// Export the router so it can be imported and used in the main app file

