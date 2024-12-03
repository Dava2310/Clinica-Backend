// Router de Express
import { Router } from 'express'

// Controlador del Modulo
import ctrl from '../controllers/pacientes.controller.js'

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
router.get('/', upload.none(), auth.ensureAuthenticated, ctrl.getPacientes);
router.get('/:pacienteId', auth.ensureAuthenticated, validateAndConvertId('pacienteId'), ctrl.getOnePaciente);
router.patch('/:pacienteId', auth.ensureAuthenticated, validateAndConvertId('pacienteId'), ctrl.editPaciente);
router.delete('/:pacienteId', auth.ensureAuthenticated, validateAndConvertId('pacienteId'), ctrl.deletePaciente)

// Nota: No existe ruta de creación porque su creación depende de la de un usuario

// Exportación del router
export default router;