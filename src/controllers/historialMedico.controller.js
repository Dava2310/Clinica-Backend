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
import Schemas from '../validations/histiorialMedicoValidation.js'

const { ModificacionHistorial } = Schemas


const getHistoriales = async (req, res) => {
    try {

        const historiales = await prisma.historialMedico.findMany({
            include: {
                paciente: {
                    include: {
                        usuario: true
                    }
                },
                resumenesMedicos: {
                    include: {
                        doctor: {
                            include: {
                                usuario: true
                            }
                        }
                    },
                    orderBy: {
                        id: 'desc'
                    }
                }
            }
        });
        return responds.success(req, res, { data: historiales }, 200);

    } catch (error) {
        return responds.error(req, res, { message: error.message }, 500);
    }
}

const getOneHistorial = async (req, res) => {
    try {

        const { historialId } = req.params;

        const historial = await prisma.historialMedico.findUnique({
            where: {
                id: historialId
            },
             include: {
                paciente: {
                    include: {
                        usuario: true
                    }
                },
                resumenesMedicos: {
                    include: {
                        doctor: {
                            include: {
                                usuario: true
                            }
                        }
                    },
                    orderBy: {
                        id: 'desc'
                    }
                }
            }
        })

        if (!historial) {
            return responds.error(req, res, { message: 'Historial no encontrado.' }, 404);
        }

        return responds.success(req, res, { message: 'Historial encontrado con éxito.', data: historial }, 200);

    } catch (error) {
        return responds.error(req, res, { message: error.message }, 500);
    }
}

const getOneHistorialByPaciente = async (req, res) => {
    try {

        const { pacienteId } = req.params;

        const paciente = await prisma.paciente.findUnique({
            where: {
                id: pacienteId
            }
        })

        if (!paciente) {
            return responds.error(req, res, { message: 'El paciente no fue encontrado.' }, 404);
        }

        const historial = await prisma.historialMedico.findFirst({
            where: {
                pacienteId: paciente.id
            }
        })

        if (!historial) {
            return responds.error(req, res, {message: 'No se pudo encontrar el historial de este paciente. Contacte a servicio técnico.'}, 404);
        }

        return responds.success(req, res, { message: 'Historial encontrado con éxito.', data: historial }, 200);

    } catch (error) {
        return responds.error(req, res, { message: error.message }, 500);
    }
}

const editHistorial = async (req, res) => {
    try {

        const { historialId } = req.params;

        const historial = await prisma.historialMedico.findUnique({
            where: {
                id: historialId
            }
        })

        if (!historial) {
            return responds.error(req, res, { message: 'Historial no encontrado.' }, 404);
        }

        // Obteniendo los datos
        const data = await ModificacionHistorial.validateAsync(req.body);

        // Haciendo la edicion
        const updatedHistorial = await prisma.historialMedico.update({
            where: {
                id: historial.id
            },
            data: {
                observaciones: data.observaciones
            }
        })

        return responds.success(req, res, {message: 'Historial modificado éxitosamente.', data: updatedHistorial}, 201);

    } catch (error) {
        if (error instanceof Joi.ValidationError) {
            return responds.error(req, res, { message: error.message }, 422)
        }

        return responds.error(req, res, {message: error.message}, 500);
    }
}

export default { getHistoriales, getOneHistorial, getOneHistorialByPaciente, editHistorial }