import { Router } from 'express';
import { ResidentController } from '../controllers/resident.controller';
import { ResidentService } from '../../application/services/resident.service';
import { PrismaResidentRepository } from '../repositories/resident.repository';
import { getDatabase } from '@/infrastructure/database/connection';
import { validateRequest } from '@/shared/middleware/validation.middleware';
import { authenticateToken, AuthenticatedRequest } from '@/shared/middleware/auth.middleware';
import { requireRole } from '@/shared/middleware/role.middleware';
import { z } from 'zod';

const router = Router();

// Initialize dependencies
const prisma = getDatabase();
const residentRepository = new PrismaResidentRepository(prisma);
const residentService = new ResidentService(residentRepository);
const residentController = new ResidentController(residentService);

// Validation schemas
const createResidentSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  middleName: z.string().optional(),
  suffix: z.string().optional(),
  gender: z.enum(['MALE', 'FEMALE']),
  birthDate: z.string().min(1, 'Birth date is required'),
  birthPlace: z.string().min(1, 'Birth place is required'),
  civilStatus: z.enum(['SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED', 'SEPARATED']),
  nationality: z.string().min(1, 'Nationality is required'),
  religion: z.string().optional(),
  occupation: z.string().optional(),
  monthlyIncome: z.number().optional(),
  educationalAttainment: z.string().optional(),
  completeAddress: z.string().min(1, 'Complete address is required'),
  purok: z.string().optional(),
  mobileNumber: z.string().optional(),
  telephoneNumber: z.string().optional(),
  emailAddress: z.string().email().optional(),
  voterStatus: z.enum(['REGISTERED', 'NOT_REGISTERED']),
  precinctNumber: z.string().optional(),
  seniorCitizen: z.boolean().optional(),
  personWithDisability: z.boolean().optional(),
  soloParent: z.boolean().optional(),
  indigent: z.boolean().optional(),
  fourPsBeneficiary: z.boolean().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactNumber: z.string().optional(),
  emergencyContactRelationship: z.string().optional(),
  householdId: z.string().optional(),
  isHouseholdHead: z.boolean().optional(),
});

const updateResidentSchema = createResidentSchema.partial();

const residentQuerySchema = z.object({
  page: z.string().transform(Number).optional(),
  limit: z.string().transform(Number).optional(),
  search: z.string().optional(),
  gender: z.enum(['MALE', 'FEMALE']).optional(),
  civilStatus: z.enum(['SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED', 'SEPARATED']).optional(),
  purok: z.string().optional(),
  seniorCitizen: z.string().transform(Boolean).optional(),
  personWithDisability: z.string().transform(Boolean).optional(),
  fourPsBeneficiary: z.string().transform(Boolean).optional(),
  isHouseholdHead: z.string().transform(Boolean).optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

/**
 * @swagger
 * /api/v1/residents:
 *   post:
 *     summary: Create a new resident
 *     tags: [Residents]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - gender
 *               - birthDate
 *               - birthPlace
 *               - civilStatus
 *               - nationality
 *               - completeAddress
 *               - voterStatus
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               middleName:
 *                 type: string
 *               gender:
 *                 type: string
 *                 enum: [MALE, FEMALE]
 *               birthDate:
 *                 type: string
 *                 format: date
 *               civilStatus:
 *                 type: string
 *                 enum: [SINGLE, MARRIED, DIVORCED, WIDOWED, SEPARATED]
 *     responses:
 *       201:
 *         description: Resident created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/', 
  authenticateToken, 
  requireRole(['ADMIN', 'STAFF']),
  validateRequest({ body: createResidentSchema }), 
  residentController.create
);

/**
 * @swagger
 * /api/v1/residents:
 *   get:
 *     summary: Get all residents with pagination and filtering
 *     tags: [Residents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: gender
 *         schema:
 *           type: string
 *           enum: [MALE, FEMALE]
 *     responses:
 *       200:
 *         description: Residents retrieved successfully
 */
router.get('/', 
  authenticateToken,
  validateRequest({ query: residentQuerySchema }),
  residentController.findAll
);

/**
 * @swagger
 * /api/v1/residents/statistics:
 *   get:
 *     summary: Get resident statistics
 *     tags: [Residents]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 */
router.get('/statistics', authenticateToken, residentController.getStatistics);

/**
 * @swagger
 * /api/v1/residents/household-heads:
 *   get:
 *     summary: Get all household heads
 *     tags: [Residents]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Household heads retrieved successfully
 */
router.get('/household-heads', authenticateToken, residentController.getHouseholdHeads);

/**
 * @swagger
 * /api/v1/residents/search:
 *   get:
 *     summary: Search residents
 *     tags: [Residents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Search results retrieved successfully
 */
router.get('/search', authenticateToken, residentController.search);

/**
 * @swagger
 * /api/v1/residents/{id}:
 *   get:
 *     summary: Get resident by ID
 *     tags: [Residents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Resident retrieved successfully
 *       404:
 *         description: Resident not found
 */
router.get('/:id', authenticateToken, residentController.findOne);

/**
 * @swagger
 * /api/v1/residents/{id}:
 *   put:
 *     summary: Update resident
 *     tags: [Residents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Resident updated successfully
 *       404:
 *         description: Resident not found
 */
router.put('/:id', 
  authenticateToken, 
  requireRole(['ADMIN', 'STAFF']),
  validateRequest({ body: updateResidentSchema }), 
  residentController.update
);

/**
 * @swagger
 * /api/v1/residents/{id}:
 *   delete:
 *     summary: Delete resident
 *     tags: [Residents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Resident deleted successfully
 *       404:
 *         description: Resident not found
 */
router.delete('/:id', 
  authenticateToken, 
  requireRole(['ADMIN']),
  residentController.remove
);

export { router as residentRouter };
