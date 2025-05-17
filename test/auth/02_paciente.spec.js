import request from 'supertest';
import app from '../../src/app.js'; // Asegúrate de que la ruta sea correcta

// Administrador para poder realizar las pruebas
const admin = {
	nombre: "Juan Carlos",
	apellido: "Vélez",
	email: "juan@gmail.com",
	cedula: "21222333",
	password: "Juan1234*",
	tipoUsuario: "administrador",
};

const paciente = {
	nombre: "Diana Carolina",
	apellido: "Vélez",
	email: "diana@gmail.com",
	cedula: "12345678",
	tipoSangre: "O+",
	direccion: "Calle 123, Ciudad",
	numeroTelefono: "+58 4241234567",
	seguroMedico: "Seguro XYZ",
};

// Probando ruta para obtener todos los pacientes
describe ('GET /api/pacientes', () => {

    // Haciendo Inicio de Sesion como Administrador
    let accessToken;
    beforeAll(async () => {
        const loginResponse = await request(app)
            .post("/api/auth/login")
            .send({ email: admin.email, password: admin.password })
            .expect(200);

        accessToken = loginResponse.body.body.data.accessToken;
    });

    // Probando la ruta de obtener todos los pacientes
    test('Obtener todos los pacientes', async () => {
        const response = await request(app)
            .get('/api/pacientes')
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200);

        // Verificar que la respuesta sea como se espera
        expect(response.body.error).toBe(false);
        expect(Array.isArray(response.body.body.data)).toBe(true);
        expect(response.body.body.data[0]).toHaveProperty("id");
            expect(response.body.body.data[0]).toHaveProperty("usuario");
    });
});

// Probando ruta para obtener un paciente por ID
describe ('GET /api/pacientes/:pacienteId', () => {

    // Haciendo Inicio de Sesion como Administrador
    let accessToken;
    beforeAll(async () => {
        const loginResponse = await request(app)
            .post("/api/auth/login")
            .send({ email: admin.email, password: admin.password })
            .expect(200);

        accessToken = loginResponse.body.body.data.accessToken;
    });

    // Probando la ruta de obtener un paciente por ID
    test('Obtener un paciente por ID', async () => {
        const response = await request(app)
            .get('/api/pacientes/1')
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200);

        // Verificar que la respuesta sea como se espera
        expect(response.body.error).toBe(false);
        expect(response.body.body.data).toHaveProperty("id");
        expect(response.body.body.data).toHaveProperty("nombre");
    });
});

// Probando ruta para editar un paciente por ID
describe ('PATCH /api/pacientes/:pacienteId', () => {

    // Haciendo Inicio de Sesion como Administrador
    let accessToken;
    beforeAll(async () => {
        const loginResponse = await request(app)
            .post("/api/auth/login")
            .send({ email: admin.email, password: admin.password })
            .expect(200);

        accessToken = loginResponse.body.body.data.accessToken;
    });

    // Probando la ruta de editar un paciente por ID
    test('Editar un paciente por ID', async () => {
        
        const newPaciente = {
            ...paciente,
            "nombre": "Diana"
        }
        
        const response = await request(app)
            .patch('/api/pacientes/1')
            .set('Authorization', `Bearer ${accessToken}`)
            .send(newPaciente)
            .expect(200);


        // Verificar que la respuesta sea como se espera
        expect(response.body.error).toBe(false);
        expect(response.body.body.message).toBe("Modificación de datos realizada con éxito.");
    });
});

// describe ('DELETE /api/pacientes/:pacienteId', () => {
//     // Haciendo Inicio de Sesion como Administrador
//     let accessToken;
//     beforeAll(async () => {
//         const loginResponse = await request(app)
//             .post("/api/auth/login")
//             .send({ email: admin.email, password: admin.password })
//             .expect(200);

//         accessToken = loginResponse.body.body.data.accessToken;
//     });

//     // Probando la ruta de eliminar un paciente por ID
//     test('Eliminar un paciente por ID', async () => {
        
//         const response = await request(app)
//             .delete('/api/pacientes/1')
//             .set('Authorization', `Bearer ${accessToken}`)
//             .expect(200);


//         // Verificar que la respuesta sea como se espera
//         expect(response.body.error).toBe(false);
//         expect(response.body.body.message).toBe("Eliminación realizada con éxito.");
//     });

//     test('Eliminar un paciente que no existe', async () => {
        
//         const response = await request(app)
//             .delete('/api/pacientes/9999')
//             .set('Authorization', `Bearer ${accessToken}`)
//             .expect(404);


//         // Verificar que la respuesta sea como se espera
//         expect(response.body.error).toBe(true);
//         expect(response.body.body.message).toBe("Paciente no encontrado.");
//     });
// })
