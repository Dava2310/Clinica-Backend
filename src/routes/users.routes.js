import { Router } from 'express'
import ctrl from '../controllers/users.controller.js'
import auth from '../middleware/auth.js';
import validate from '../middleware/validate.js'

// Multer
import multer from 'multer'
const upload = multer();

const router = Router();

router.get('/api/users/current', auth.ensureAuthenticated, ctrl.viewUser);

router.get('/api/users/tipo/:tipoUsuario', auth.ensureAuthenticated, ctrl.getUsers)

router.get('/api/users/:userId', auth.ensureAuthenticated, validate.validateAndConvertId('userId'), ctrl.getOneUser)

router.patch('/api/users/:userId', upload.none() ,auth.ensureAuthenticated, validate.validateAndConvertId('userId'), ctrl.editUser)

router.delete('/api/users/:userId', auth.ensureAuthenticated, validate.validateAndConvertId('userId'), ctrl.deleteUser)


export default router;