import request from "supertest";
import app from "../../src/app.js"; // Asegúrate de que la ruta sea correcta

// Datos de prueba para el modulo de autenticación
const newAdmin = {
	nombre: "Juan Carlos",
	apellido: "Vélez",
	email: "juan@gmail.com",
	cedula: "21222333",
	password: "Juan1234*",
	tipoUsuario: "administrador",
};

const newDoctor = {
	nombre: "Jose Luis",
	apellido: "Rodriguez Sanchez",
	email: "jose@gmail.com",
	cedula: "22333444",
	password: "Jose1234*",
	tipoUsuario: "doctor",
	especialidad: "Cardiología",
	numeroTelefono: "+58 4242223333",
};

const newPaciente = {
	nombre: "Diana Carolina",
	apellido: "Vélez",
	email: "diana@gmail.com",
	cedula: "12345678",
	password: "Diana1234*",
	tipoUsuario: "paciente",
	tipoSangre: "O+",
	direccion: "Calle 123, Ciudad",
	numeroTelefono: "+58 4241234567",
	seguroMedico: "Seguro XYZ",
};

describe("POST /register", () => {
	describe("Datos Validos", () => {
		// Datos de prueba para el registro

		test("Registra un administrador exitosamente", async () => {
			// Haciendo la solicitud POST a /register
			const response = await request(app)
				.post("/api/auth/register")
				.send(newAdmin)
				.expect(201);

			// Verificar que la respuesta sea como se espera
			expect(response.body.error).toBe(false);
			expect(response.body.status).toBe(201);
			expect(response.body.body.message).toBe(
				"Usuario registrado exitosamente."
			);
		});

		test("Registra un doctor exitosamente", async () => {
			// Haciendo la solicitud POST a /register
			const response = await request(app)
				.post("/api/auth/register")
				.send(newDoctor)
				.expect(201);

			// Verificar que la respuesta sea como se espera
			expect(response.body.error).toBe(false);
			expect(response.body.status).toBe(201);
			expect(response.body.body.message).toBe(
				"Usuario registrado exitosamente."
			);
		});

		// Test para registrar un paciente
		test("Registra un paciente exitosamente", async () => {
			// Haciendo la solicitud POST a /register
			const response = await request(app)
				.post("/api/auth/register")
				.send(newPaciente)
				.expect(201);

			// Verificar que la respuesta sea como se espera
			expect(response.body.error).toBe(false);
			expect(response.body.status).toBe(201);
			expect(response.body.body.message).toBe(
				"Usuario registrado exitosamente."
			);
		});
	});

	describe("Datos Invalidos", () => {
		// Test para verificar la duplicacion de un email
		test("Falla al registrar un usuario con email ya existente", async () => {

			// Haciendo la solicitud POST a /register
			const response = await request(app)
				.post("/api/auth/register")
				.send(newAdmin)
				.expect(409);

			// Verificar que la respuesta sea como se espera
			expect(response.body.error).toBe(true);
			expect(response.body.statusCode).toBe(409);
			expect(response.body.body.message).toBe(
				"El correo ya está en uso."
			);
		});

		// Test para verificar la duplicacion de una cedula
		test("Falla al registrar un usuario con cedula ya existente", async () => {
			
			const newUser = {
				...newAdmin,
				email: "juan123@gmail.com"
			}

			// Haciendo la solicitud POST a /register
			const response = await request(app)
				.post("/api/auth/register")
				.send(newUser)
				.expect(409);

			// Verificar que la respuesta sea como se espera
			expect(response.body.error).toBe(true);
			expect(response.body.statusCode).toBe(409);
			expect(response.body.body.message).toBe("La cedula ya está en uso.");
		});
	});
});

describe("POST /login", () => {

	// Test para verificar el inicio de sesión exitoso
	describe('Dando correctas credenciales', () => {
        test('Se logea exitosamente', async () => {
            const loginData = {
                email: newAdmin.email,
                password: newAdmin.password
            };

            const response = await request(app)
                .post('/api/auth/login')
                .send(loginData)
                .expect(200);

            expect(response.body.error).toBe(false);
            expect(response.body.status).toBe(200);
            expect(response.body.body.data).toHaveProperty('accessToken');
            expect(response.body.body.data).toHaveProperty('refreshToken');
        });
    })

	// Test para verificar el inicio de sesión fallido
	describe('Dando incorrectas credenciales', () => {
        test('No se puede logear', async () => {
            const loginData = {
                email: 'testuser@example.com',
                password: 'WrongPassword!'
            };
    
            const response = await request(app)
                .post('/api/auth/login')
                .send(loginData)
                .expect(401);
    
            expect(response.body.error).toBe(true);
            expect(response.body.statusCode).toBe(401);
            expect(response.body.body.message).toBe('El correo o la contraseña es inválida.');
        });
    })
});

describe('GET /logout', () => {
    let accessToken; 

    beforeAll(async () => {
        // Primero iniciamos sesión para obtener un token de acceso
        const loginResponse = await request(app)
            .post('/api/auth/login')
            .send({
                email: newAdmin.email,
                password: newAdmin.password
            })
            .expect(200);

        accessToken = loginResponse.body.body.data.accessToken;
    });

    test('Cierra sesión exitosamente', async () => {
        const response = await request(app)
            .get('/api/auth/logout')
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(204);

        expect(response.body).toEqual({});
    });

    test('Falla si se intenta cerrar sesión sin un token', async () => {
        const response = await request(app)
            .get('/api/auth/logout')
            .expect(401);

        expect(response.body.error).toBe(true);
    });
});
