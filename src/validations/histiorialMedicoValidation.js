import Joi from "joi";

const ModificacionHistorial = Joi.object({

    // Observaciones
    observaciones: Joi.string().required(),

})

export default {ModificacionHistorial}