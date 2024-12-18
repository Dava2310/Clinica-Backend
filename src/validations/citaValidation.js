import Joi from "joi";

const RegistroCita = Joi.object({

    // Tipo de Servicio
    tipoServicio: Joi.string().required(),

    // Especialidad
    especialidad: Joi.string().required(),

})

const AsignacionDoctor = Joi.object({

    // Datos del Doctor
    idDoctor: Joi.number().required(),
    fecha: Joi.date().required(),
})

const EdicionCita = Joi.object({

    // Id Paciente
    idPaciente: Joi.number().required(),

    // Id Doctor
    idDoctor: Joi.number().required(),

    // Tipo de Servicio
    tipoServicio: Joi.string().required(),

    // Fecha
    fecha: Joi.date().required(),

    // Estado
    estado: Joi.string().required(),

    // Hora
    horaEstimada: Joi.string().required()
})

export default { RegistroCita, AsignacionDoctor, EdicionCita};