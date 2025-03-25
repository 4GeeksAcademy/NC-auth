const getState = ({ getStore, getActions, setStore }) => {
	const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

	return {
		store: {
			message: null,
            auth: false,
            user: null,
		},
		actions: {
			setProfile: (profile) => {
				setStore((prevStore) => ({ ...prevStore, user: profile }));
			},
			
			setAuth: (authStatus) => {
				setStore({ ...store, auth: authStatus });
			},

			login: async (email, password) => {
				try {
					const response = await fetch(`${BACKEND_URL}/api/login`, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ email, password }),
					});
			
					const result = await response.json();
					console.log("Respuesta del backend:", result); // 👈 LOG para depurar
			
					if (response.status === 200 && result.access_token) {
						localStorage.setItem("token", result.access_token); // Guarda el token
						setStore({ auth: true });
						alert("Inicio de sesión exitoso");
						return true;
					} else {
						alert(result.error || "Error al iniciar sesión");
						return false;
					}
				} catch (error) {
					console.error("Error en login:", error);
					alert("Error al conectar con el servidor");
					return false;
				}
			},			

			signup: async (email, password) => {
				try {
					const response = await fetch(`${BACKEND_URL}/api/signup`, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ email, password }),
					});

					const result = await response.json();

					if (response.status === 201) {
						alert("Usuario registrado correctamente");
						return true;
					} else {
						alert(result.error || "Error al registrar usuario");
						return false;
					}
				} catch (error) {
					console.error("Error en signup:", error);
					alert("Error al conectar con el servidor");
					return false;
				}
			},

			getProfile: async () => {
				const actions = getActions(); // Obtener las acciones dentro de la función
				try {
					const response = await fetch(`${BACKEND_URL}/api/private`, {  // Usar BACKEND_URL aquí
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							"Authorization": `Bearer ${localStorage.getItem("token")}`
						}
					});
			
					if (!response.ok) {
						const errorDetail = await response.json();
						throw new Error(errorDetail.message || "Error al obtener perfil");
					}
			
					const profile = await response.json();
					actions.setProfile(profile); // Guardas el perfil en el store
				} catch (error) {
					console.error("Error en getProfile:", error);
					alert("Error al obtener perfil: " + error.message);
				}
			},		
			
			tokenVerify: async () => {
				try {
					const token = localStorage.getItem("token");
					const response = await fetch(`${BACKEND_URL}/api/verify-token`, {
						method: "GET",
						headers: { "Authorization": `Bearer ${token}` },
					});

					if (response.status === 200) {
						setStore({ auth: true });
						console.log("Token válido");
					} else {
						setStore({ auth: false });
						localStorage.removeItem("token");
					}
				} catch (error) {
					console.error("Error al verificar token:", error);
					setStore({ auth: false });
				}
			},

			logout: () => {
				localStorage.removeItem("token");
				setStore({ auth: false });
				alert("Sesión cerrada");
			},

			getMessage: async () => {
				try {
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello");
					if (!resp.ok) {
						throw new Error(`Error en la solicitud: ${resp.status}`);
					}
			
					const data = await resp.json();
					setStore({ message: data.message });
			
					return data;
				} catch (error) {
					console.error("Error en getMessage:", error);
				}
			},			

		}
	};
};

export default getState;