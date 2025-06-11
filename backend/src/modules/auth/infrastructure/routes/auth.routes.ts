import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../../application/services/auth.service';
import { PrismaUserRepository } from '../repositories/user.repository';
import { PrismaRefreshTokenRepository } from '../repositories/refresh-token.repository';
import { getDatabase } from '@/infrastructure/database/connection';
import { validateRequest } from '@/shared/middleware/validation.middleware';
import { authenticateToken } from '@/shared/middleware/auth.middleware';
import { 
  loginSchema, 
  registerSchema, 
  refreshTokenSchema, 
  changePasswordSchema 
} from '../../application/dto/auth.dto';

const router = Router();

// Initialize dependencies
const prisma = getDatabase();
const userRepository = new PrismaUserRepository(prisma);
const refreshTokenRepository = new PrismaRefreshTokenRepository(prisma);
const authService = new AuthService(userRepository, refreshTokenRepository);
const authController = new AuthController(authService);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: User login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', validateRequest({ body: loginSchema }), authController.login);

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: User registration
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - username
 *               - password
 *               - firstName
 *               - lastName
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               username:
 *                 type: string
 *                 minLength: 3
 *               password:
 *                 type: string
 *                 minLength: 8
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               middleName:
 *                 type: string
 *     responses:
 *       201:
 *         description: Registration successful
 *       409:
 *         description: Email or username already exists
 */
router.post('/register', validateRequest({ body: registerSchema }), authController.register);

/**
 * @swagger
 * /api/v1/auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       401:
 *         description: Invalid refresh token
 */
router.post('/refresh', validateRequest({ body: refreshTokenSchema }), authController.refreshToken);

/**
 * @swagger
 * /api/v1/auth/change-password:
 *   post:
 *     summary: Change user password
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *                 minLength: 8
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/change-password', authenticateToken, validateRequest({ body: changePasswordSchema }), authController.changePassword);

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     summary: User logout
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.post('/logout', authController.logout);

/**
 * @swagger
 * /api/v1/auth/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/profile', authenticateToken, authController.profile);

export { router as authRouter };
