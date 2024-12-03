// Router de Express
import { Router } from 'express'

// Controlador del Modulo
import ctrl from '../controllers/pacientes.controller.js'

// Middlewares
import auth from '../middleware/auth.js';
import validate from '../middleware/validate.js'

// Multer
import multer from 'multer'
const upload = multer();

// Inicialización del Router
const router = Router();

// Rutas
router.get('/', upload.none(), auth.ensureAuthenticated, ctrl.getPacientes)

// Exportación del router
export default router;