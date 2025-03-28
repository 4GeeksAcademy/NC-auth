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
				const store = getStore();
				console.log("Store actual antes de guardar:", store);
				console.log("Perfil recibido para guardar:", profile);
				setStore({ user: profile });
				console.log("Usuario guardado en store (después de setStore):", getStore().user);
			},			

			setAuth: (authStatus) => {
				setStore({ ...store, auth: authStatus });
			},

			// login: async (email, password) => {
			// 	try {
			// 		const response = await fetch(`${BACKEND_URL}/api/login`, {
			// 			method: "POST",
			// 			headers: { "Content-Type": "application/json" },
			// 			body: JSON.stringify({ email, password }),
			// 		});
			
			// 		const result = await response.json();
					
			
			// 		if (response.status === 200 && result.access_token) {
			// 			localStorage.setItem("access_token", result.access_token); // Guarda el token
			// 			setStore({ auth: true });
			// 			alert("Inicio de sesión exitoso");
			// 			return true;
			// 		} else {
			// 			alert(result.error || "Error al iniciar sesión");
			// 			return false;
			// 		}
			// 	} catch (error) {
			// 		console.error("Error en login:", error);
			// 		alert("Error al conectar con el servidor");
			// 		return false;
			// 	}
			// },			
			login: async (email, password) => {
				try {
					const response = await fetch(`${BACKEND_URL}/api/login`, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ email, password }),
					});
			
					const result = await response.json();
			
					if (response.status === 200 && result.access_token) {
						console.log("🔑 Nuevo token recibido:", result.access_token);
						
						// 1. Guarda el token antes de llamar a getProfile
						localStorage.setItem("access_token", result.access_token);
			
						// 2. Actualiza el estado de autenticación
						setStore({ auth: true });
			
						// 3. Llama a getProfile() para cargar el usuario
						await getActions().getProfile();
			
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
	
			// getProfile: async () => {
			// 	const actions = getActions();
			// 	try {
			// 		const response = await fetch(`${BACKEND_URL}/api/private`, {
			// 			method: "GET",
			// 			headers: {
			// 				"Content-Type": "application/json",
			// 				"Authorization": `Bearer ${localStorage.getItem("access_token")}`
			// 			}
			// 		});
			
			// 		const data = await response.json();
			// 		console.log("📊 Respuesta de getProfile:", response);
			// 		console.log("🧑‍🚀 Perfil recibido en getProfile:", data);
			
			// 		if (!response.ok) {
			// 			throw new Error(data.msg || "Error al obtener perfil");
			// 		}
			
			// 		actions.setProfile(data);
			// 	} catch (error) {
			// 		console.error("❌ Error en getProfile:", error);
			// 		alert("Error al obtener perfil: " + error.message);
			// 	}
			// },			
			getProfile: async () => {
				const token = localStorage.getItem("access_token");
				if (!token) {
					console.warn("⛔ No hay token, no se ejecuta getProfile");
					return;
				}
			
				try {
					const response = await fetch(`${BACKEND_URL}/api/private`, {
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							"Authorization": `Bearer ${token}`,
						},
					});
			
					if (!response.ok) {
						throw new Error("Error al obtener el perfil");
					}
			
					const profile = await response.json();
					console.log("🧑‍🚀 Perfil recibido en getProfile:", profile);
			
					// Guarda el perfil en el store
					getActions().setProfile(profile);
				} catch (error) {
					console.error("❌ Error en getProfile:", error);
					alert("Error al obtener perfil: " + error.message);
				}
			},
			
			// tokenVerify: async () => {
			// 	try {
			// 		const token = localStorage.getItem("access_token");
			
			// 		// Validar si existe el token antes de hacer la petición
			// 		if (!token) {
			// 			console.warn("No hay token, no se realiza la verificación.");
			// 			setStore({ auth: false, user: null });
			// 			return;
			// 		}
			
			// 		console.log("Enviando token para verificar:", token);
			
			// 		const response = await fetch(`${BACKEND_URL}/api/verify-token`, {
			// 			method: "GET",
			// 			headers: { "Authorization": `Bearer ${token}` },
			// 		});
			
			// 		if (!response.ok) {
			// 			console.warn("Token inválido o expirado.");
			// 			setStore({ auth: false, user: null });
			// 			localStorage.removeItem("access_token");
			// 			return;
			// 		}
			
			// 		setStore({ auth: true });
			// 		console.log("✅ Token válido, usuario autenticado.");
			
			// 		// Llama a getProfile para actualizar el usuario en el store
			// 		await getActions().getProfile();
			// 	} catch (error) {
			// 		console.error("❌ Error al verificar token:", error);
			// 		setStore({ auth: false, user: null });
			// 	}
			// },
			tokenVerify: async () => {
				try {
					const token = localStorage.getItem("access_token");
					
					if (!token) {
						console.warn("⛔ No hay token, no se realiza la verificación.");
						setStore({ auth: false, user: null });
						return;
					}
			
					const response = await fetch(`${BACKEND_URL}/api/verify-token`, {
						method: "GET",
						headers: { "Authorization": `Bearer ${token}` },
					});
			
					if (!response.ok) {
						console.warn("❌ Token inválido o expirado.");
						setStore({ auth: false, user: null });
						localStorage.removeItem("access_token");
						return;
					}
			
					console.log("✅ Token válido, usuario autenticado.");
			
					setStore({ auth: true });
			
					// Asegúrate de que el perfil esté actualizado
					await getActions().getProfile();
			
				} catch (error) {
					console.error("❌ Error al verificar token:", error);
					setStore({ auth: false, user: null });
				}
			},							

			logout: () => {
				localStorage.removeItem("access_token");
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