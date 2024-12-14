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
import Schemas from '../validations/citaValidation.js'

const { EdicionCita, RegistroCita } = Schemas

const getCitas = async (req, res) => {

    try {

        const citas = await prisma.cita.findMany();
        return responds.success(req, res, { data: citas }, 200);

    } catch (error) {
        return responds.error(req, res, { message: error.message })
    }

}

const getOneCita = async (req, res) => {

    // Consiguiendo los datos de una cita en especifico segun un ID
    try {

        const { citaId } = req.params;

        // Buscando la cita

        const cita = await prisma.cita.findUnique({
            where: {
                id: citaId
            }
        })

        if (!cita) {
            return responds.error(req, res, { message: 'Cita no encontrada.' }, 404);
        }

        // Devolviendo sus datos
        return responds.success(req, res, { data: cita }, 200);

    } catch (error) {
        return responds.error(req, res, { message: error.message }, 500);
    }

}

const getCitasByDoctor = async (req, res) => {

    try {

        const { doctorId } = req.params;

        // Verificando la existencia del doctor
        if (!(await prisma.doctor.findUnique({ where: { id: doctorId } }))) {
            return responds.error(req, res, { message: 'Doctor no encontrado' }, 404);
        }

        // Buscando todas las citas por este doctor
        const citas = await prisma.cita.findMany({
            where: {
                doctorId: doctorId
            }
        })

        // Devolviendo los datos de esas citas
        return responds.success(req, res, { data: citas }, 200);

    } catch (error) {
        return responds.error(req, res, { message: error.message }, 500);
    }

}

const getCitasByPaciente = async (req, res) => {

    try {

        const { pacienteId } = req.params;

        // Verificando la existencia del paciente
        if (!(await prisma.paciente.findUnique({ where: { id: pacienteId } }))) {
            return responds.error(req, res, { message: 'Paciente no encontrado' }, 404);
        }

        // Buscando todas las citas por este pacietne
        const citas = await prisma.cita.findMany({
            where: {
                idPaciente: pacienteId
            }
        })

        // Devolviendo los datos de estas citas
        return responds.success(req, res, { data: citas }, 200);

    } catch (error) {
        return responds.error(req, res, { message: error.message }, 500);
    }

}

const createCita = async (req, res) => {

    try {

        // Obteniendo los datos y comparandolos con el Schema de la libreria JOI
        const datos = await RegistroCita.validateAsync(req.body);

        // Buscando la existencia del paciente

        if (!(await prisma.paciente.findUnique({ where: { id: datos.idPaciente } }))) {
            return responds.error(req, res, { message: 'Paciente no encontrado.' }, 404);
        }

        // TODO: Verificar la incompantiblidad con las horas

        // Creando la cita
        const nuevaCita = await prisma.cita.create({
            data: datos
        })

        // Devolviendo un mensaje de exito mas los datos de la cita creada
        return responds.success(req, res, { message: 'Cita creada con éxito.', data: nuevaCita }, 200);

    } catch (error) {

        if (error instanceof Joi.ValidationError) {
            return responds.error(req, res, { message: error.message }, 422)
        }

        return responds.error(req, res, { message: error.message }, 500);
    }

}

const asignarDoctor = async (req, res) => {
    try {

        // Obteniendo el ID de la cita a editar
        const { citaId } = req.params;

        // Buscando la cita
        const cita = await prisma.cita.findUnique({
            where: {
                id: citaId
            }
        })

        if (!cita) {
            return responds.error(req, res, { message: 'Cita no encontrada.' }, 404);
        }

        // Obteniendo los datos de la asignacion y validando contra el esquema
        const data = await Schemas.AsignacionDoctor.validateAsync(req.body)

        // Obteniendo el ID del doctor de los datos validados
        const { idDoctor, fecha, observaciones, horaEstimada } = data;

        // Buscando al doctor
        const doctor = await prisma.doctor.findUnique({
            where: {
                id: idDoctor
            }
        })

        if (!doctor) {
            return responds.success(req, res, { message: 'Doctor no encontrado.' }, 404);
        }

        if (observaciones === undefined) {
            observaciones = "";
        }

        // Asignando los datos como el ID del doctor, observaciones, etc
        const citaEditada = await prisma.cita.update({
            where: {
                id: cita.id
            },
            data: {
                idDoctor: doctor.id,
                fecha: fecha,
                observaciones: observaciones,
                horaEstimada: horaEstimada,
                estado: 'Asignada'
            }
        })

        // Devolviendo los datos de la cita editada y un mensaje de exito
        return responds.success(req, res, { message: 'Doctor asignado exitosamente.', data: citaEditada }, 200);

    } catch (error) {

        if (error instanceof Joi.ValidationError) {
            return responds.error(req, res, { message: error.message }, 422)
        }


        return responds.error(req, res, { message: error.message }, 500);
    }
}

const finalizarCita = async (req, res) => {
    try {

        // Obteniendo el ID de la cita a editar
        const { citaId } = req.params;

        // Buscando la cita
        const cita = await prisma.cita.findUnique({
            where: {
                id: citaId
            }
        })

        if (!cita) {
            return responds.error(req, res, { message: 'Cita no encontrada.' }, 404);
        }

        // Cambiar el estado a finalizada
        await prisma.cita.update({
            where: {
                id: cita.id
            },
            data: {
                estado: 'Finalizada'
            }
        })

        return responds.success(req, res, {message: 'Cita finalizada con éxito.'}, 200);

    } catch (error) {
        return responds.error(req, res, {message: error.message}, 500);
    }
}

const editCita = async (req, res) => {

    try {

        // Obteniendo el ID de la cita a editar
        const { citaId } = req.params;

        // Buscando la cita
        const cita = await prisma.cita.findUnique({
            where: {
                id: citaId
            }
        })

        if (!cita) {
            return responds.error(req, res, { message: 'Cita no encontrada.' }, 404);
        }

        // Una vez encontrada la cita, se verifican los datos
        const datos = await EdicionCita.validateAsync(req.body);

        // Verificando la existencia del doctor y del paciente

        if (!(await prisma.doctor.findUnique({ where: { id: datos.idDoctor } }))) {
            return responds.error(req, res, { message: 'Doctor no encontrado.' }, 404);
        }

        if (!(await prisma.paciente.findUnique({ where: { id: datos.idPaciente } }))) {
            return responds.error(req, res, { message: 'Paciente no encontrado.' }, 404);
        }

        // Realizando la modificacion
        const citaEditada = await prisma.cita.update({
            where: {
                id: cita.id
            },
            data: datos
        })

        // Devolviendo un mensaje de exito
        return responds.success(req, res, { message: 'Modificación realizada con éxito.', data: citaEditada }, 200);

    } catch (error) {
        if (error instanceof Joi.ValidationError) {
            return responds.error(req, res, { message: error.message }, 422)
        }

        return responds.error(req, res, { message: error.message }, 500);
    }

}

const deleteCita = async (req, res) => {
    try {

        // Obteniendo el ID de la cita a editar
        const { citaId } = req.params;

        // Buscando la cita
        const cita = await prisma.cita.findUnique({
            where: {
                id: citaId
            }
        })

        if (!cita) {
            return responds.error(req, res, { message: 'Cita no encontrada.' }, 404);
        }

        // No se pueden eliminar las citas ya aceptadas, rechazadas o finalizadas
        // Para que queden en el historial

        if (cita.estado === 'Asignada' || cita.estado === 'Finalizada') {
            return responds.error(req, res, { message: 'Esta cita no puede ser eliminada.' }, 401);
        }

        // Procediendo con la elmininación
        await prisma.cita.delete({
            where: {
                id: cita.id
            }
        })

        // Devolviendo un mensaje de éxito
        return responds.success(req, res, { message: 'Cita eliminada con éxito.' }, 200);

    } catch (error) {
        return responds.error(req, res, { message: error.message }, 500);
    }
}


export default { getCitas, getOneCita, getCitasByDoctor, getCitasByPaciente, createCita, editCita, deleteCita, asignarDoctor, finalizarCita }
