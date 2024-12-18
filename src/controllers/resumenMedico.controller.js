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
import Schemas from '../validations/resumenMedicoValidation.js'

const { CreacionResumen } = Schemas

const getResumenes = async (req, res) => {
    try {
        
        const resumenes = await prisma.resumenMedico.findMany();
        return responds.success(req, res, {data: resumenes}, 200);

    } catch (error) {
        return responds.error(req, res, {message: error.message}, 500);
    }
} 

const getOneResumen = async (req, res) => {
    try {
        
        const { resumenId } = req.params;

        const resumen = await prisma.resumenMedico.findUnique({
            where: {
                id: resumenId
            }
        })

        if (!resumen) {
            return responds.error(req, res, {message: 'Resumen médico no encontrado.'}, 404);
        }

        return responds.success(req, res, {data: resumen, message: 'Resumen encontrado con éxito.'}, 200);

    } catch (error) {
        return responds.error(req, res, {message: error.message}, 500);
    }
} 
const getResumenesByPaciente = async (req, res) => {
    try {
        const { pacienteId } = req.params;

        const paciente = await prisma.paciente.findUnique({
            where: {
                id: pacienteId
            }
        })

        if (!paciente) {
            return responds.error(req, res, {message: 'Paciente no encontrado.'}, 404);
        }

        const resumenes = await prisma.resumenMedico.findMany({
            where: {
                pacienteId: paciente.id
            }
        })

        return responds.success(req, res, {data: resumenes, message: 'Resumenes encontrados con éxito.'}, 200);
    } catch (error) {
        return responds.error(req, res, {message: error.message}, 500);
    }
} 
const getResumenesByDoctor = async (req, res) => {
    try {
        const { doctorId } = req.params;

        const doctor = await prisma.doctor.findUnique({
            where: {
                id: doctorId
            }
        })

        if (!doctor) {
            return responds.error(req, res, {message: 'Doctor no encontrado.'}, 404);
        }

        const resumenes = await prisma.resumenMedico.findMany({
            where: {
                doctorId: doctor.id
            }
        })

        return responds.success(req, res, {data: resumenes, message: 'Resumenes encontrados con éxito.'}, 200);
    } catch (error) {
        return responds.error(req, res, {message: error.message}, 500);
    }
} 
const getResumenesByHistorial = async (req, res) => {
    try {
        const { historialId } = req.params;

        const historial = await prisma.historialMedico.findUnique({
            where: {
                id: historialId
            }
        })

        if (!historial) {
            return responds.error(req, res, {message: 'Historial médico no encontrado.'}, 404);
        }

        const resumenes = await prisma.resumenMedico.findMany({
            where: {
                historialMedicoId: historial.id
            }
        })

        return responds.success(req, res, {data: resumenes, message: 'Resumenes encontrados con éxito.'}, 200);
    } catch (error) {
        return responds.error(req, res, {message: error.message}, 500);
    }
} 
const getResumenesByCita = async (req, res) => {
    try {
        const { citaId } = req.params;

        const cita = await prisma.cita.findUnique({
            where: {
                id: citaId
            }
        })

        if (!cita) {
            return responds.error(req, res, {message: 'Cita no encontrada.'}, 404);
        }

        const resumenes = await prisma.resumenMedico.findMany({
            where: {
                citaId: cita.id
            }
        })

        return responds.success(req, res, {data: resumenes, message: 'Resumen encontrados con éxito.'}, 200);
    } catch (error) {
        return responds.error(req, res, {message: error.message}, 500);
    }
} 
const createResumen = async (req, res) => {
    try {
        
        const data = await CreacionResumen.validateAsync(req.body);

        // Verificar la existencia de la cita
        const cita = await prisma.cita.findFirst({
            where: {
                id: data.citaId
            }
        })

        if (!cita) {
            return responds.error(req, res, {message: 'La cita no pudo ser encontrada.'}, 404);
        }
        
        const historialMedico = await prisma.historialMedico.findFirst({
            where: {
                pacienteId: cita.idPaciente
            }
        })

        if (!historialMedico) {
            return responds.error(req, res, {message: 'No se pudo encontrar el historial medico del paciente.'}, 404);
        }

        const newResumen = await prisma.resumenMedico.create({
            data: {
                fecha: new Date(data.fecha),
                diagnostico: data.diagnostico,
                tratamiento: data.tratamiento,
                observaciones: data.observaciones,
                tipoServicio: data.tipoServicio,
                doctorId: cita.idDoctor,
                pacienteId: cita.idPaciente,
                historialMedicoId: historialMedico.id,
                citaId: cita.id
            }
        })

        await prisma.cita.update({
            where: {
                id: cita.id
            },
            data: {
                estado: 'Finalizada'
            }
        })

        return responds.success(req, res, {message: 'Creación del resumen médico exitosa.', data: newResumen}, 201);

    } catch (error) {

        if (error instanceof Joi.ValidationError) {
            return responds.error(req, res, { message: error.message }, 422)
        }

        return responds.error(req, res, {message: error.message}, 500);
    }
} 
const editResumen = async (req, res) => {
    try {

        const { resumenId } = req.params;

        const resumen = await prisma.resumenMedico.findUnique({
            where: {
                id: resumenId
            }
        })

        if (!resumen) {
            return responds.error(req, res, {message: 'Resumen médico no encontrado.'}, 404);
        }

        const data = await CreacionResumen.validateAsync(req.body);

        // Verificar la existencia de la cita
        const cita = await prisma.cita.findFirst({
            where: {
                id: data.citaId
            }
        })

        if (!cita) {
            return responds.error(req, res, {message: 'La cita no pudo ser encontrada.'}, 404);
        }

        const historialMedico = await prisma.historialMedico.findFirst({
            where: {
                pacienteId: cita.idPaciente
            }
        })

        if (!historialMedico) {
            return responds.error(req, res, {message: 'No se pudo encontrar el historial medico del paciente.'}, 404);
        }

        const editedResumen = await prisma.resumenMedico.update({
            data: {
                fecha: new Date(data.fecha),
                diagnostico: data.diagnostico,
                tratamiento: data.tratamiento,
                observaciones: data.observaciones,
                tipoServicio: data.tipoServicio,
                doctorId: cita.idDoctor,
                pacienteId: cita.idPaciente,
                historialMedicoId: historialMedico.id,
                citaId: cita.id
            },
            where: {
                id: resumen.id
            }
        })

        return responds.success(req, res, {message: 'Actualización del resumen médico exitosa.', data: editedResumen}, 201);
    } catch (error) {

        if (error instanceof Joi.ValidationError) {
            return responds.error(req, res, { message: error.message }, 422)
        }

        return responds.error(req, res, {message: error.message}, 500);
    }
} 
const deleteResumen = async (req, res) => {
    try {
        const { resumenId } = req.params;

        const resumen = await prisma.resumenMedico.findUnique({
            where: {
                id: resumenId
            }
        })

        if (!resumen) {
            return responds.error(req, res, {message: 'Resumen médico no encontrado.'}, 404);
        }

        await prisma.resumenMedico.delete({
            where: {
                id: resumen.id
            }
        })

        return responds.success(req, res, {message: 'Eliminación exitosa.'}, 200);
    } catch (error) {
        return responds.error(req, res, {message: error.message}, 500);
    }
} 

export default {getResumenes, getOneResumen, getResumenesByPaciente, getResumenesByDoctor, getResumenesByHistorial, getResumenesByCita, createResumen, editResumen, deleteResumen}