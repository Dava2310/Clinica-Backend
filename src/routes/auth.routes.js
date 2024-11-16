import { Router } from 'express'
import auth from '../middleware/auth.js';

// Controller
import ctrl from '../controllers/auth.controller.js'
import responds from '../red/responds.js';
const { registerUser, loginUser, refreshToken, logoutUser, changePassword } = ctrl

const router = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             oneOf:
 *               - type: object
 *                 properties:
 *                   nombre:
 *                     type: string
 *                     description: User's first name
 *                     example: John
 *                   apellido:
 *                     type: string
 *                     description: User's last name
 *                     example: Doe
 *                   email:
 *                     type: string
 *                     description: User's email address
 *                     example: john.doe@example.com
 *                   cedula:
 *                     type: string
 *                     description: User's identification number
 *                     example: V12345678
 *                   password:
 *                     type: string
 *                     description: User's password
 *                     example: P@ssw0rd!
 *                   tipoUsuario:
 *                     type: string
 *                     description: User's role
 *                     enum: [administrador, paciente, doctor]
 *                     example: administrador
 *               - type: object
 *                 properties:
 *                   nombre:
 *                     type: string
 *                     description: User's first name
 *                     example: Jane
 *                   apellido:
 *                     type: string
 *                     description: User's last name
 *                     example: Smith
 *                   email:
 *                     type: string
 *                     description: User's email address
 *                     example: jane.smith@example.com
 *                   cedula:
 *                     type: string
 *                     description: User's identification number
 *                     example: V87654321
 *                   password:
 *                     type: string
 *                     description: User's password
 *                     example: D@rknight123!
 *                   tipoUsuario:
 *                     type: string
 *                     description: User's role
 *                     enum: [administrador, paciente, doctor]
 *                     example: paciente
 *                   tipoSangre:
 *                     type: string
 *                     description: Blood type (required if user is a patient)
 *                     example: O+
 *                   direccion:
 *                     type: string
 *                     description: Address (required if user is a patient)
 *                     example: 123 Main St
 *                   numeroTelefono:
 *                     type: string
 *                     description: Phone number (required if user is a patient or doctor)
 *                     example: 555-1234
 *                   seguroMedico:
 *                     type: string
 *                     description: Medical insurance (required if user is a patient)
 *                     example: XYZ Insurance
 *               - type: object
 *                 properties:
 *                   nombre:
 *                     type: string
 *                     description: User's first name
 *                     example: Dr. Carlos
 *                   apellido:
 *                     type: string
 *                     description: User's last name
 *                     example: Rodriguez
 *                   email:
 *                     type: string
 *                     description: User's email address
 *                     example: dr.carlos@example.com
 *                   cedula:
 *                     type: string
 *                     description: User's identification number
 *                     example: V11223344
 *                   password:
 *                     type: string
 *                     description: User's password
 *                     example: C@rdi0logy2024!
 *                   tipoUsuario:
 *                     type: string
 *                     description: User's role
 *                     enum: [administrador, paciente, doctor]
 *                     example: doctor
 *                   especialidad:
 *                     type: string
 *                     description: Specialty (required if user is a doctor)
 *                     example: Cardiology
 *                   numeroTelefono:
 *                     type: string
 *                     description: Phone number (required if user is a patient or doctor)
 *                     example: 555-9876
 *     responses:
 *       '201':
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 status:
 *                   type: integer
 *                   example: 201
 *                 body:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Usuario registrado exitosamente.
 *                     usuario:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         nombre:
 *                           type: string
 *                           example: John
 *                         apellido:
 *                           type: string
 *                           example: Doe
 *                         email:
 *                           type: string
 *                           example: john.doe@example.com
 *                         cedula:
 *                           type: string
 *                           example: V12345678
 *                         tipoUsuario:
 *                           type: string
 *                           example: paciente
 *       '409':
 *         description: Email or cedula already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: true
 *                 statusCode:
 *                   type: integer
 *                   example: 409
 *                 body:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: El correo ya está en uso.
 *       '422':
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: true
 *                 statusCode:
 *                   type: integer
 *                   example: 422
 *                 body:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: La contraseña debe tener al menos 8 caracteres.
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: true
 *                 statusCode:
 *                   type: integer
 *                   example: 500
 *                 body:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Internal server error
 */

router.post('/api/auth/register', registerUser);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email address
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 description: User's password
 *                 example: P@ssw0rd!
 *               tipoUsuario:
 *                 type: string
 *                 description: User's type of user
 *                 example: administrador
 *     responses:
 *       '200':
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 body:
 *                   type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         nombre:
 *                           type: string
 *                           example: John Doe
 *                         email:
 *                           type: string
 *                           example: john.doe@example.com
 *                         accessToken:
 *                           type: string
 *                           example: JWT_ACCESS_TOKEN
 *                         refreshToken:
 *                           type: string
 *                           example: JWT_REFRESH_TOKEN
 *       '401':
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: true
 *                 statusCode:
 *                   type: integer
 *                   example: 401
 *                 body:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Email or password is invalid
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: true
 *                 statusCode:
 *                   type: integer
 *                   example: 500
 *                 body:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Internal server error
 */
router.post('/api/auth/login', loginUser);

/**
 * @swagger
 * /api/auth/logout:
 *   get:
 *     summary: Logout the user
 *     tags:
 *       - Autenticación
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '204':
 *         description: User logged out successfully, no content returned
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: true
 *                 statusCode:
 *                   type: integer
 *                   example: 500
 *                 body:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Internal server error
 */
router.get('/api/auth/logout', auth.ensureAuthenticated, logoutUser);

/**
 * @swagger
 * /api/auth/changePassword:
 *   patch:
 *     summary: Change the password of an authenticated user
 *     tags:
 *       - Autenticación
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 description: The current password of the user
 *                 example: oldPassword123
 *               newPassword:
 *                 type: string
 *                 description: The new password to set for the user
 *                 example: newPassword456
 *               confirmPassword:
 *                 type: string
 *                 description: The new password confirmed
 *                 example: newPassword456
 *     responses:
 *       200:
 *         description: Password updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Contraseña actualizada correctamente.
 *       404:
 *         description: User not found or another error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Hubo un error. Intente de nuevo.
 *       409:
 *         description: The current password is incorrect
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: La contraseña actual no es correcta.
 *       422:
 *         description: Validation error for input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "'currentPassword' is required"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error message details
 *     description: This endpoint allows an authenticated user to change their password. The user must provide their current password and a new password. The new password will be hashed and updated in the system.
 */

router.patch('/api/auth/changePassword', auth.ensureAuthenticated, changePassword);

/**
 * @swagger
 * /api/auth/verify-token:
 *   get:
 *     summary: Verify the validity of the JWT token
 *     tags:
 *       - Autenticación
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token is valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Token is valid
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error message details
 *     description: This endpoint verifies the validity of the provided JWT token. It requires the user to be authenticated.
 */
router.get('/api/auth/verify-token', auth.ensureAuthenticated, (req, res) => {
    try {
        responds.success(req, res, { message: "Token is valid" }, 200);
    } catch (error) {
        responds.error(req, res, { message: error.message }, 500);
    }
})

/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     summary: Refresh the access token using a refresh token
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: JWT refresh token
 *                 example: JWT_REFRESH_TOKEN
 *     responses:
 *       '200':
 *         description: Access token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 body:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       example: NEW_JWT_ACCESS_TOKEN
 *                     newRefreshToken:
 *                       type: string
 *                       example: NEW_JWT_REFRESH_TOKEN
 *       '401':
 *         description: Invalid or expired refresh token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: true
 *                 statusCode:
 *                   type: integer
 *                   example: 401
 *                 body:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Refresh token invalid or expired
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: true
 *                 statusCode:
 *                   type: integer
 *                   example: 500
 *                 body:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Internal server error
 */
router.post('/api/auth/refresh-token', refreshToken);

export default router;