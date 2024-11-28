import Joi from "joi";

const userRegister = Joi.object({

    // Name
    nombre: Joi.string().min(3).max(50).required(),

    // Last Name
    apellido: Joi.string().min(3).max(99).required(),

    // Email
    email: Joi.string().email().lowercase().required(),

    cedula: Joi.string().required(),

    // Password
    password: Joi.string()
        .min(8)
        .required()
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'))
        .messages({
            'string.min': 'La contraseña debe tener al menos 8 caracteres.',
            'string.pattern.base': 'La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial.',
            'any.required': 'La contraseña es obligatoria.'
        }),

    // Tipo de Usuario
    tipoUsuario: Joi.string().valid(...['administrador', 'paciente', 'doctor']).required(),

    // Datos por si fuera Paciente
    tipoSangre: Joi.string(),
    direccion: Joi.string(),
    numeroTelefono: Joi.string(),
    seguroMedico: Joi.string(),

    // Datos por si fuera Doctor
    especialidad: Joi.string(),
})

const pacienteRegister = Joi.object({
    // Datos por si fuera Paciente
    tipoSangre: Joi.string().required(),
    direccion: Joi.string().required(),
    numeroTelefono: Joi.string().required(),
    seguroMedico: Joi.string().required(),
})

const doctorRegister = Joi.object({
    // Datos por si fuera Doctor
    especialidad: Joi.string().required(),
    numeroTelefono: Joi.string().required()
})

const userEdit = Joi.object({
    // Name
    nombre: Joi.string().min(3).max(50).required(),

    // Last Name
    apellido: Joi.string().min(3).max(99).required(),

    // Email
    email: Joi.string().email().lowercase().required(),
})

const userLogin = Joi.object({
    // Email
    email: Joi.string()
        .email()
        .lowercase()
        .required()
        .messages({
            'string.empty': 'El correo electrónico no puede estar vacío.',
            'string.email': 'El correo electrónico debe ser un correo válido.',
            'any.required': 'El correo electrónico es obligatorio.'
        }),

    // Password
    password: Joi.string()
        .required()
        .messages({
            'any.required': 'La contraseña es obligatoria.'
        }),

    // Tipo de Usuario
    // tipoUsuario: Joi.string().valid('administrador', 'paciente', 'doctor').required().messages({
    //     'any.required': 'Se debe indicar el tipo de usuario.',
    //     'string.empty': 'Se debe indicar el tipo de usuario.',
    //     // No se agrega mensaje para `any.only` para no exponer los valores válidos
    // })
});

const changePassword = Joi.object({

    // Current password
    currentPassword: Joi.string()
        .min(8)
        .required()
        .messages({
            'string.min': 'La contraseña debe tener al menos 8 caracteres.',
            'any.required': 'La contraseña actual es obligatoria.'
        }),

    // New password
    newPassword: Joi.string()
        .min(8)
        .required()
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'))
        .messages({
            'string.min': 'La contraseña debe tener al menos 8 caracteres.',
            'string.pattern.base': 'La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial.',
            'any.required': 'La nueva contraseña es obligatoria.'
        }),

    // Confirm password
    confirmPassword: Joi.string()
        .min(8)
        .required()
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'))
        .valid(Joi.ref('newPassword'))
        .messages({
            'string.min': 'La contraseña de confirmación debe tener al menos 8 caracteres.',
            'string.pattern.base': 'La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial.',
            'any.required': 'La contraseña de confirmación es obligatoria.',
            'any.only': 'La contraseña de confirmación no coincide con la nueva contraseña.'
        }),
})

export default { userRegister, userLogin, userEdit, changePassword, doctorRegister, pacienteRegister };