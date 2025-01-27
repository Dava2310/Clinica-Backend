// Router de Express
import { Router } from 'express'

// Controlador del Modulo
import ctrl from '../controllers/resumenMedico.controller.js'

// Middlewares
import auth from '../middleware/auth.js';
import validate from '../middleware/validate.js'

const { validateAndConvertId } = validate

// Multer
import multer from 'multer'
const upload = multer();

// Inicialización del Router
const router = Router();

// =================================== Rutas ===================================

// Obtener todos los resumenes medicos
router.get('/', upload.none(), auth.ensureAuthenticated, ctrl.getResumenes)

// Obtener resumenes medicos por paciente
router.get('/paciente/:pacienteId', upload.none(), auth.ensureAuthenticated, validateAndConvertId('pacienteId'), ctrl.getResumenesByPaciente)

// Obtener resumenes medicos por doctor
router.get('/doctor/:doctorId', upload.none(), auth.ensureAuthenticated, validateAndConvertId('doctorId'), ctrl.getResumenesByDoctor)

// Obtener resumenes medicos por historial
router.get('/historial/:historialId', upload.none(), auth.ensureAuthenticated, validateAndConvertId('historialId'), ctrl.getResumenesByHistorial)

// Obtener resumenes medicos por cita
router.get('/cita/:citaId', upload.none(), auth.ensureAuthenticated, validateAndConvertId('citaId'), ctrl.getResumenesByCita)

// Obtener resumen medico por ID
router.get('/:resumenId', upload.none(), validateAndConvertId('resumenId'), ctrl.getOneResumen)

// Creacion de resumen medico
router.post('/', upload.none(), auth.ensureAuthenticated, ctrl.createResumen)

// Actualizar resumen medico
router.patch('/:resumenId', upload.none(), auth.ensureAuthenticated, validateAndConvertId('resumenId'), ctrl.editResumen)

// Eliminar resumen medico
router.delete('/:resumenId', upload.none(), auth.ensureAuthenticated, validateAndConvertId('resumenId'), ctrl.deleteResumen)

// Exportación del router
export default router;