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

const doctor = {
	nombre: "Jose Luis",
	apellido: "Rodriguez Sanchez",
	email: "jose@gmail.com",
	cedula: "22333444",
	especialidad: "Cardiología",
	numeroTelefono: "+58 4242223333",
};

// Probando ruta para obtener todos los doctores
describe ('GET /api/doctores', () => {

    // Haciendo Inicio de Sesion como Administrador
    let accessToken;
    beforeAll(async () => {
        const loginResponse = await request(app)
            .post("/api/auth/login")
            .send({ email: admin.email, password: admin.password })
            .expect(200);

        accessToken = loginResponse.body.body.data.accessToken;
    });

    // Probando la ruta de obtener todos los doctores
    test('Obtener todos los doctores', async () => {
        const response = await request(app)
            .get('/api/doctores')
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200);

        // Verificar que la respuesta sea como se espera
        expect(response.body.error).toBe(false);
        expect(Array.isArray(response.body.body.data)).toBe(true);
        expect(response.body.body.data[0]).toHaveProperty("id");
        expect(response.body.body.data[0]).toHaveProperty("usuario");
    });
});

// Probando ruta para obtener un doctor por ID
describe ('GET /api/doctores/:doctorId', () => {

    // Haciendo Inicio de Sesion como Administrador
    let accessToken;
    beforeAll(async () => {
        const loginResponse = await request(app)
            .post("/api/auth/login")
            .send({ email: admin.email, password: admin.password })
            .expect(200);

        accessToken = loginResponse.body.body.data.accessToken;
    });

    // Probando la ruta de obtener un doctor por ID
    test('Obtener un doctor por ID', async () => {
        const response = await request(app)
            .get('/api/doctores/1')
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200);

        // Verificar que la respuesta sea como se espera
        expect(response.body.error).toBe(false);
        expect(response.body.body.data).toHaveProperty("id");
        expect(response.body.body.data).toHaveProperty("nombre");
    });
});

// Probando ruta para editar un doctor por ID
describe ('PATCH /api/doctores/:doctorId', () => {

    // Haciendo Inicio de Sesion como Administrador
    let accessToken;
    beforeAll(async () => {
        const loginResponse = await request(app)
            .post("/api/auth/login")
            .send({ email: admin.email, password: admin.password })
            .expect(200);

        accessToken = loginResponse.body.body.data.accessToken;
    });

    // Probando la ruta de editar un doctor por ID
    test('Editar un doctor por ID', async () => {
        
        const newDoctor = {
            ...doctor,
            nombre: "Jose"
        }
        
        const response = await request(app)
            .patch('/api/doctores/1')
            .set('Authorization', `Bearer ${accessToken}`)
            .send(newDoctor)
            .expect(200);


        // Verificar que la respuesta sea como se espera
        expect(response.body.error).toBe(false);
        expect(response.body.body.message).toBe("Modificación de datos realizada con éxito.");
    });
});

describe ('DELETE /api/doctores/:doctorId', () => {
    // Haciendo Inicio de Sesion como Administrador
    let accessToken;
    beforeAll(async () => {
        const loginResponse = await request(app)
            .post("/api/auth/login")
            .send({ email: admin.email, password: admin.password })
            .expect(200);

        accessToken = loginResponse.body.body.data.accessToken;
    });

    // Probando la ruta de eliminar un doctor por ID
    test('Eliminar un doctor por ID', async () => {
        
        const response = await request(app)
            .delete('/api/doctores/1')
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200);


        // Verificar que la respuesta sea como se espera
        expect(response.body.error).toBe(false);
        expect(response.body.body.message).toBe("Eliminación realizada con éxito.");
    });

    test('Eliminar un doctor que no existe', async () => {
        
        const response = await request(app)
            .delete('/api/doctores/9999')
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(404);


        // Verificar que la respuesta sea como se espera
        expect(response.body.error).toBe(true);
        expect(response.body.body.message).toBe("Doctor no encontrado.");
    });
})
