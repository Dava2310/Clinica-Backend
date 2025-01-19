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

        const { userId } = req.params;

        const doctor = await prisma.doctor.findFirst({ where: { id: userId } }) 

        // Verificando la existencia del doctor
        if (!(doctor)) {
            return responds.error(req, res, { message: 'Doctor no encontrado' }, 404);
        }

        // Buscando todas las citas por este doctor
        const citas = await prisma.cita.findMany({
            where: {
                idDoctor: doctor.id
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

        const { userId } = req.params;

        const paciente = await prisma.paciente.findFirst({ where: { userId: userId } })

        // Verificando la existencia del paciente
        if (!(paciente)) {
            return responds.error(req, res, { message: 'Paciente no encontrado' }, 404);
        }

        // Buscando todas las citas por este paciente
        const citas = await prisma.cita.findMany({
            where: {
                idPaciente: paciente.id
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

        const paciente = await prisma.paciente.findFirst({
            where: {
                userId: req.user.id
            }
        })        

        if (!paciente) {
            return responds.error(req, res, { message: 'Paciente no encontrado.' }, 404);
        }

        // TODO: Verificar la incompantiblidad con las horas

        // Creando la cita / Solicitando
        const nuevaCita = await prisma.cita.create({
            data: {
                idPaciente: paciente.id,
                tipoServicio: datos.tipoServicio,
                especialidad: datos.especialidad
            }
        })

        // Devolviendo un mensaje de exito mas los datos de la cita creada
        return responds.success(req, res, { message: 'Cita solicitada con éxito.', data: nuevaCita }, 201);

    } catch (error) {

        if (error instanceof Joi.ValidationError) {
            return responds.error(req, res, { message: error.message }, 422)
        }

        return responds.error(req, res, { message: error.message }, 500);
    }

}

const getOpciones = async (req, res) => {
    try {
        
        const { idCita } = req.params;

        const cita = await prisma.cita.findUnique({
            where: {
                id: idCita
            }
        })

        if (!cita) {
            return responds.error(req, res, {message: 'La cita no fue encontrada.'}, 404);
        }

        const opciones = await prisma.opcionesCita.findMany({
            where: {
                idCita: idCita
            }
        })

        if (opciones.length < 1) {
            return responds.error(req, res, {message: 'La cita no tiene opciones disponibles.'}, 401);
        }

        const data = {
            tipoServicio: cita.tipoServicio,
            especialidad: cita.especialidad,
            estado: cita.estado,
            opciones: opciones 
        }

        return responds.success(req, res, {message: 'Opciones encontradas.', data: data}, 200);

    } catch (error) {
        return responds.error(req, res, {message: error.message}, 500);
    }
}

const crearOpciones = async (req, res) => {
    try {

        const datos = [...req.body];
        //return responds.success(req, res, {message: 'Opciones creadas de forma exitosa', d:datos}, 200);
        
        // Verificar el tamaño del arreglo
        if (datos.length < 1) {
            return responds.error(req, res, { message: 'Debe seleccionar al menos una opción.' }, 401);
        }

        const idCita = datos[0].idCita;

        await prisma.$transaction(async (prisma) => {
            // Recorre cada opción en los datos y crea la entrada en la tabla opcionesCita
            for (const opcion of datos) {

                const fecha = new Date(opcion.fecha);  // Asegúrate de que la fecha esté en formato Date

                if (isNaN(fecha)) {
                    return responds.error(req, res, { message: 'Fecha inválida proporcionada.' }, 400);
                }
                await prisma.opcionesCita.create({
                    data: {
                        idCita: opcion.idCita,
                        fecha: fecha,
                        idDoctor: opcion.idDoctor
                    }
                });
            }

            await prisma.cita.update({
                where: {
                    id: idCita
                }, 
                data: {
                    estado: "Opciones"
                }
            })
        })

        return responds.success(req, res, {message: 'Opciones creadas de forma exitosa'}, 201);

    } catch (error) {
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

        // Verificar si ya tiene un doctor asignado
        if (cita.estado === 'Programada') {
            return responds.error(req, res, { message: 'No se puede re asignar un doctor a una cita.' }, 409);
        }

        // Obteniendo los datos de la asignacion y validando contra el esquema
        const data = await Schemas.AsignacionDoctor.validateAsync(req.body)

        // Obteniendo el ID del doctor de los datos validados
        const { idDoctor, fecha } = data;

        // Buscando al doctor
        const doctor = await prisma.doctor.findUnique({
            where: {
                id: idDoctor
            }
        })

        if (!doctor) {
            return responds.success(req, res, { message: 'Doctor no encontrado.' }, 404);
        }

        // Asignando los datos como el ID del doctor, observaciones, etc
        const citaEditada = await prisma.cita.update({
            where: {
                id: cita.id
            },
            data: {
                idDoctor: doctor.id,
                fecha: fecha,
                estado: 'Programada'
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

const cancelarCita = async (req, res) => {
    try{

        const { citaId } = req.params;

        const cita = await prisma.cita.findUnique({
            where: {
                id: citaId
            }
        })

        if (!cita) {
            return responds.error(req, res, {message: 'La cita no fue encontrada.'}, 404);
        }

        if (cita.estado === 'Finalizada') {
            return responds.error(req, res, {message: 'La cita se encuentra finalizada.'}, 401);
        }

        await prisma.cita.update({
            where: {
                id: citaId
            },
            data: {
                estado: 'Cancelada'
            }
        })

        return responds.success(req, res, {message: 'Cita cancelada exitosamente.'}, 200);

    }catch(error) {
        return responds.error(req, res, {message: error.message}, 500);
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

        return responds.success(req, res, { message: 'Cita finalizada con éxito.' }, 200);

    } catch (error) {
        return responds.error(req, res, { message: error.message }, 500);
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


export default { getCitas, getOneCita, getCitasByDoctor, getCitasByPaciente, createCita, editCita, deleteCita, crearOpciones, getOpciones, asignarDoctor, cancelarCita, finalizarCita }
