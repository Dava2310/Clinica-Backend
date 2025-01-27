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

//Encontrar un doctor por medio del id de usuario
const getADoctor = async(req, res) => {
    try {
        const { userId } = req.params;

        const doctor = await prisma.doctor.findFirst({
            where : {
                userId: Number(userId)
            }
        });
    
        if (!doctor) {
            return responds.error(req, res, { message: 'Doctor no encontrado.' }, 404);
        }
    
        // const dataUser = await prisma.usuario.findFirst({
        //     where: {
        //         id: Number(userId)
        //     }
        // })
    
        // const data = {...doctor };
    
        // Devolviendo los datos de todos los doctores
        return responds.success(req, res, { data: doctor }, 200);
    } catch (error) {
        return responds.error(req, res, { message: error.message }, 500);
    }
}

const encontrarDoctor = async (doctorId) => {

    try {

        // Si hay problemas con el numero de ID del doctor
        if (doctorId === undefined || doctorId === null || !doctorId) {
            return false;
        }

        // Buscando el doctor
        const doctor = await prisma.doctor.findUnique({
            where: {
                id: doctorId
            }
        })

        if (!doctor) {
            return false;
        }

        return doctor;

    } catch (error) {
        throw new Error(error.message)
    }

}

const getDoctores = async (req, res) => {
    try {

        // Obteniendo todos los doctores desde PRISMA
        const doctores = await prisma.doctor.findMany();

        // Rellenando los datos de usuario
        let usuario;

        for (const doctor of doctores) {

            // Buscando su usuario correspondiente
            usuario = await prisma.usuario.findUnique({
                where: {
                    id: doctor.userId
                }
            })

            if (!usuario) {
                return responds.error(req, res, {message: 'Hubo un problema con la busqueda de datos.'}, 401);
            }

            // Rellenando el resto de los datos que no pertenecen a la entidad doctor
            doctor.nombre = usuario.nombre
            doctor.apellido = usuario.apellido
            doctor.cedula = usuario.cedula
            doctor.email = usuario.email

        }

        // Devolviendo los datos de todos los doctores
        return responds.success(req, res, { data: doctores }, 200);

    } catch (error) {
        return responds.error(req, res, { message: error.message }, 500);
    }
}

const getOneDoctor = async (req, res) => {
    try {

        // Obteniendo el ID del doctor despues de haber pasado por el middleware
        const { doctorId } = req.params;

        // Verificando la existencia del doctor
        const doctor = await encontrarDoctor(doctorId);
        if (!doctor) {
            return responds.error(req, res, { message: 'Doctor no encontrado.' }, 404);
        }

        // Encontrando su usuario para rellenar el resto de los datos
        const usuario = await prisma.usuario.findUnique({
            where: {
                id: doctor.userId
            }
        })

        // Rellenando el resto de los datos que no pertenecen a la entidad doctor
        doctor.nombre = usuario.nombre
        doctor.apellido = usuario.apellido
        doctor.cedula = usuario.cedula
        doctor.email = usuario.email

        // Devolviendo los datos del doctor si se encontró
        return responds.success(req, res, { message: 'Doctor encontrado con éxito.', data: doctor }, 200);

    } catch (error) {
        return responds.error(req, res, { message: error.message }, 500);
    }
}

const editDoctor = async (req, res) => {
    try {

        // Obteniendo el ID del doctor despues de haber pasado por el middleware
        const { doctorId } = req.params;

        // Verificando la existencia del doctor
        const doctor = await encontrarDoctor(doctorId);
        if (!doctor) {
            return responds.error(req, res, { message: 'Doctor no encontrado.' }, 404);
        }

        // Hay que validar los datos que pertenecen a la entidad usuario y los que pertenecen a la entidad doctor

        // 1. Verificando contra el esquema general
        const datos = await Schemas.userEdit.validateAsync(req.body);

        // 2. Verificando los datos contra el esquema especifico de doctor
        await Schemas.doctorRegister.validateAsync({
            especialidad: datos.especialidad,
            numeroTelefono: datos.numeroTelefono
        })

        // 3. Hay que verificar que no se este duplicando el email
        const emailDuplicado = await prisma.usuario.findFirst({
            where: {
                email: datos.email,
                NOT: { id: doctor.userId }
            }
        })

        if (emailDuplicado) {
            return responds.error(req, res, { message: 'El email ya está en uso.' }, 409);
        }

        // 4. Hay que verificar que no se este duplicando la cedula
        const cedulaDuplicada = await prisma.usuario.findFirst({
            where: {
                cedula: datos.cedula,
                NOT: { id: doctor.userId }
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
            especialidad: datos.especialidad,
            numeroTelefono: datos.numeroTelefono,
        }


        // Realizando la modificacion en la entidad de doctor
        const doctorEditado = await prisma.doctor.update({
            where: {
                id: doctorId
            },
            data: {
                numeroTelefono: datosParaEdicion.numeroTelefono,
                especialidad: datosParaEdicion.especialidad    
            }
        })

        await prisma.usuario.update({
            where: {
                id: doctor.userId
            },
            data: {
                nombre: datosParaEdicion.nombre,
                apellido: datosParaEdicion.apellido,
                email: datosParaEdicion.email,
                cedula: datosParaEdicion.cedula,
            }
        })
        
        return responds.success(req, res, { message: 'Modificación de datos realizada con éxito.', data: doctorEditado }, 200);

    } catch (error) {

        if (error instanceof Joi.ValidationError) {
            return responds.error(req, res, { message: error.message }, 422)
        }

        return responds.error(req, res, { message: error.message }, 500);
    }
}

const deleteDoctor = async (req, res) => {
    try {

        // Obteniendo el ID del doctor despues de haber pasado por el middleware
        const { doctorId } = req.params;

        // Verificando la existencia del doctor
        const doctor = await encontrarDoctor(doctorId);
        if (!doctor) {
            return responds.error(req, res, { message: 'Doctor no encontrado.' }, 404);
        }

        // Para hacer una eliminacion de doctor, hay que primero eliminar la entidad doctor y posteriormente la entidad usuario
        const usuarioId = doctor.userId; // ID del usuario con que eliminaramos la entidad

        // 1. Eliminando el doctor
        await prisma.doctor.delete({
            where: {
                id: doctorId
            }
        })

        // 2. Eliminando el usuario
        await prisma.usuario.delete({
            where: {
                id: usuarioId
            }
        })

        // 3. Enviando la respuesta al usuario
        return responds.success(req, res, { message: 'Eliminación realizada con éxito.' }, 200);

    } catch (error) {
        return responds.error(req, res, { message: error.message }, 500);
    }
}

export default { getDoctores, getOneDoctor, deleteDoctor, editDoctor, getADoctor}