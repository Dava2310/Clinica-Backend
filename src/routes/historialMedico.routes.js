// Router de Express
import { Router } from 'express'

// Controlador del Modulo
import ctrl from '../controllers/historialMedico.controller.js'

// Middlewares
import auth from '../middleware/auth.js';
import validate from '../middleware/validate.js'

const { validateAndConvertId } = validate;

// Multer
import multer from 'multer'
const upload = multer();

// Inicialización del Router
const router = Router();

// ========================================================== Rutas ================================================================================

// Conseguir el historial de un paciente en particular
router.get('/paciente/:pacienteId', upload.none(), auth.ensureAuthenticated, validateAndConvertId('pacienteId'), ctrl.getOneHistorialByPaciente)

// Conseguir los datos de un historial medico en particular
router.get('/:historialId', upload.none(), auth.ensureAuthenticated, validateAndConvertId('historialId'), ctrl.getOneHistorial)

// Conseguir todos los historiales medicos
router.get('/', upload.none(), auth.ensureAuthenticated, ctrl.getHistoriales)

// Modificar las observaciones generales del historial
router.patch('/:historialId', upload.none(), auth.ensureAuthenticated, validateAndConvertId('historialId'), ctrl.editHistorial)


// Exportación del router
export default router;