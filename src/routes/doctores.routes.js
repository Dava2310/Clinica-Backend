// Router de Express
import { Router } from 'express'

// Controlador del Modulo
import ctrl from '../controllers/doctores.controller.js'

// Middlewares
import auth from '../middleware/auth.js';
import validate from '../middleware/validate.js'

const {validateAndConvertId} = validate

// Multer
import multer from 'multer'
const upload = multer();

// Inicialización del Router
const router = Router();

// Rutas
router.get('/', upload.none(), auth.ensureAuthenticated, ctrl.getDoctores);
router.get('/:doctorId', auth.ensureAuthenticated, validateAndConvertId('doctorId'), ctrl.getOneDoctor);
router.patch('/:doctorId', auth.ensureAuthenticated, validateAndConvertId('doctorId'), ctrl.editDoctor);
router.delete('/:doctorId', auth.ensureAuthenticated, validateAndConvertId('doctorId'), ctrl.deleteDoctor)

// Nota: No existe ruta de creación porque su creación depende de la de un usuario

// Exportación del router
export default router;