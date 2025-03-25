const getState = ({ getStore, getActions, setStore }) => {
	const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

	return {
		store: {
			message: null,
			auth: false,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			]
		},
		actions: {
			login: async (email, password) => {
				try {
					const response = await fetch(`${BACKEND_URL}/api/login`, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ email, password }),
					});

					const result = await response.json();

					if (response.status === 200) {
						localStorage.setItem("token", result.access_token);
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
				try {
					const token = localStorage.getItem("token");
					const response = await fetch(`${BACKEND_URL}/api/profile`, {
						method: "GET",
						headers: { "Authorization": `Bearer ${token}` },
					});

					const result = await response.json();
					console.log("Perfil:", result);
				} catch (error) {
					console.error("Error al obtener perfil:", error);
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

			changeColor: (index, color) => {
				const store = getStore();
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});
				setStore({ demo });
			}
		}
	};
};

export default getState;