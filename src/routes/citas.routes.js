// Router de Express
import { Router } from 'express'

// Controlador del Modulo
import ctrl from '../controllers/citas.controller.js'

// Middlewares
import auth from '../middleware/auth.js';
import validate from '../middleware/validate.js'

const { validateAndConvertId } = validate

// Multer
import multer from 'multer'
const upload = multer();

// Inicialización del Router
const router = Router();

// Rutas

// Ruta para ver todas las citas
router.get('/', upload.none(), auth.ensureAuthenticated, ctrl.getCitas)

// Ruta para ver una cita
router.get('/:citaId', upload.none(), auth.ensureAuthenticated, validateAndConvertId('citaId'), ctrl.getOneCita)

// Ruta para ver todas las citas de un doctor en particular
router.get('/doctor/:doctorId', upload.none(), auth.ensureAuthenticated, validateAndConvertId('doctorId'), ctrl.getCitasByDoctor)

// Ruta para ver todas las citas de un paciente en particular
router.get('/paciente/:pacienteId', upload.none(), auth.ensureAuthenticated, validateAndConvertId('pacienteId'), ctrl.getCitasByPaciente)

// Ruta para conseguir los datos de la cita y las opciones, para PACIENTE
router.get('/opciones/:idCita', upload.none(), auth.ensureAuthenticated, validateAndConvertId('idCita'), ctrl.getOpciones)

// Ruta para crear / solicitar una cita
router.post('/', upload.none(), auth.ensureAuthenticated, ctrl.createCita)

// Ruta para dar opciones a la cita
router.post('/opciones/', upload.none(), auth.ensureAuthenticated, ctrl.crearOpciones)

// Ruta para asignar doctor a una cita
router.patch('/aprobar/:citaId', upload.none(), auth.ensureAuthenticated, validateAndConvertId('citaId'), ctrl.asignarDoctor)

// Ruta para cancelar cita
router.get('/cancelar/:citaId', upload.none(), auth.ensureAuthenticated, validateAndConvertId('citaId'), ctrl.cancelarCita);

// Ruta para cambiar el estado de una cita
router.get('/finalizar/:citaId', upload.none(), auth.ensureAuthenticated, ctrl.finalizarCita)

// Ruta para modificar los datos de una cita
router.patch('/:citaId', upload.none(), auth.ensureAuthenticated, validateAndConvertId('citaId'), ctrl.editCita)

// Ruta para eliminar una cita
router.delete('/:citaId', upload.none(), auth.ensureAuthenticated, validateAndConvertId('citaId'), ctrl.deleteCita)

// Exportación del router
export default router;