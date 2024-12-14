import Joi from "joi"

const CreacionResumen = Joi.object({

    fecha: Joi.string().required(),
    diagnostico: Joi.string().required(),
    tratamiento: Joi.string().required(),
    observaciones: Joi.string().required(),
    tipoServicio: Joi.string().required(),

    // Relaciones
    citaId: Joi.number().required()
})

export default {CreacionResumen}