import responds from '../red/responds.js';

// --------------------
// Prisma Module
// --------------------
import prisma from '../../prisma/prismaClient.js'

// --------------------
// External Dependencies
// --------------------
import Joi from "joi";

// Schema
import Schemas from '../validations/userValidation.js'

const encontrarPaciente = async (pacienteId) => {

    try {

        // Si hay problemas con el numero de ID del paciente
        if (pacienteId === undefined || pacienteId === null || !pacienteId) {
            return false;
        }

        // Buscando el paciente
        const paciente = await prisma.paciente.findUnique({
            where: {
                id: pacienteId
            }
        })

        if (!paciente) {
            return false;
        }

        return paciente;

    } catch (error) {
        throw new Error(error.message)
    }

}

const getPacientes = async (req, res) => {
    try {

        // Obteniendo todos los pacientes desde PRISMA
        const pacientes = await prisma.paciente.findMany({
            include: {
                usuario: true
            },
            where: {
                activo: true
            }
        });

        // Devolviendo los datos de todos los pacientes
        return responds.success(req, res, { data: pacientes }, 200);

    } catch (error) {
        return responds.error(req, res, { message: error.message }, 500);
    }
}

const getOnePaciente = async (req, res) => {
    try {

        // Obteniendo el ID del paciente despues de haber pasado por el middleware
        const { pacienteId } = req.params;

        // Verificando la existencia del paciente
        const paciente = await encontrarPaciente(pacienteId);
        if (!paciente) {
            return responds.error(req, res, { message: 'Paciente no encontrado.' }, 404);
        }

        // Encontrando su usuario para rellenar el resto de los datos
        const usuario = await prisma.usuario.findUnique({
            where: {
                id: paciente.userId
            }
        })

        // Rellenando el resto de los datos que no pertenecen a la entidad paciente
        paciente.nombre = usuario.nombre
        paciente.apellido = usuario.apellido
        paciente.cedula = usuario.cedula
        paciente.email = usuario.email

        // Devolviendo los datos del paciente si se encontró
        return responds.success(req, res, { message: 'Paciente encontrado con éxito.', data: paciente }, 200);

    } catch (error) {
        return responds.error(req, res, { message: error.message }, 500);
    }
}

const editPaciente = async (req, res) => {
    try {

        // Obteniendo el ID del paciente despues de haber pasado por el middleware
        const { pacienteId } = req.params;

        // Verificando la existencia del paciente
        const paciente = await encontrarPaciente(pacienteId);
        if (!paciente) {
            return responds.error(req, res, { message: 'Paciente no encontrado.' }, 404);
        }

        // Hay que validar los datos que pertenecen a la entidad usuario y los que pertenecen a la entidad paciente

        // 1. Verificando contra el esquema general
        const datos = await Schemas.userEdit.validateAsync(req.body);

        // 2. Verificando los datos contra el esquema especifico de paciente
        await Schemas.pacienteRegister.validateAsync({
            tipoSangre: datos.tipoSangre,
            direccion: datos.direccion,
            numeroTelefono: datos.numeroTelefono,
            seguroMedico: datos.seguroMedico
        })

        // 3. Hay que verificar que no se este duplicando el email
        const emailDuplicado = await prisma.usuario.findFirst({
            where: {
                email: datos.email,
                NOT: { id: paciente.userId }
            }
        })

        if (emailDuplicado) {
            return responds.error(req, res, { message: 'El email ya está en uso.' }, 409);
        }

        // 4. Hay que verificar que no se este duplicando la cedula
        const cedulaDuplicada = await prisma.usuario.findFirst({
            where: {
                cedula: datos.cedula,
                NOT: { id: paciente.userId }
            }
        })

        if (cedulaDuplicada) {
            return responds.error(req, res, { message: 'La cedula ya está en uso.' }, 409);
        }

        // Una vez verificados los datos, se realiza la modificacion
        const datosParaEdicion = {
            nombre: datos.nombre,
            apellido: datos.apellido,
            email: datos.email,
            cedula: datos.cedula,
            tipoSangre: datos.tipoSangre,
            direccion: datos.direccion,
            numeroTelefono: datos.numeroTelefono,
            seguroMedico: datos.seguroMedico
        }


        // Realizando la modificacion en la entidad de paciente
        const pacienteEditado = await prisma.paciente.update({
            where: {
                id: pacienteId
            },
            data: {
                tipoSangre: datosParaEdicion.tipoSangre,
                direccion: datosParaEdicion.direccion,
                numeroTelefono: datosParaEdicion.numeroTelefono,
                seguroMedico: datosParaEdicion.seguroMedico
            }
        })

        await prisma.usuario.update({
            where: {
                id: paciente.userId
            },
            data: {
                nombre: datosParaEdicion.nombre,
                apellido: datosParaEdicion.apellido,
                email: datosParaEdicion.email,
                cedula: datosParaEdicion.cedula,
            }
        })
        
        return responds.success(req, res, { message: 'Modificación de datos realizada con éxito.', data: pacienteEditado }, 200);

    } catch (error) {

        if (error instanceof Joi.ValidationError) {
            return responds.error(req, res, { message: error.message }, 422)
        }

        return responds.error(req, res, { message: error.message }, 500);
    }
}

const deletePaciente = async (req, res) => {
    try {

        // Obteniendo el ID del paciente despues de haber pasado por el middleware
        const { pacienteId } = req.params;

        // Verificando la existencia del paciente
        const paciente = await encontrarPaciente(pacienteId);
        if (!paciente) {
            return responds.error(req, res, { message: 'Paciente no encontrado.' }, 404);
        }

        // La eliminacion de un paciente implica el cambiar el estado de activo de la entidad paciente

        // 1. Eliminando el paciente de forma logica
        await prisma.paciente.update({
            where: {
                id: pacienteId
            },
            data: {
                activo: false
            }
        })

        // 2. Enviando la respuesta al usuario
        return responds.success(req, res, { message: 'Eliminación realizada con éxito.' }, 200);

    } catch (error) {
        return responds.error(req, res, { message: error.message }, 500);
    }
}

export default { getOnePaciente, getPacientes, editPaciente, deletePaciente }