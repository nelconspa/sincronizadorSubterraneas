import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate';

export default createStore({
	state: {
		sidebarVisible: '',
		sidebarUnfoldable: false,
		theme: 'light',
		token: '',
		name: '',
		backendUrl: 'https://back1.sincronizador.cl/api', // agregar archivo .env para estos datos
	},
	mutations: {
		/*
			Funciones propias para el almacenamiento de token
		*/
		initialiseStore(state) {
			if (localStorage.getItem('token')) {
				state.token = localStorage.getItem('token');
			}
			if (localStorage.getItem('name')) {
				state.name = localStorage.getItem('name'); 
			}
			if (state.token == "") {
				return false; 
			}

			return true;
		},
		
		saveLogin(state, loginData) {
			
			state.token = loginData.token; 
			state.name = loginData.name; 

			localStorage.setItem('token', loginData.token); 
			localStorage.setItem('name', loginData.name); 
		},

		logOut(state) {
			state.token = ""; 
			state.name = ""; 

			localStorage.removeItem('token'); 
			localStorage.removeItem('name'); 
		}, 

		/* Fin Funciones Propias */ 

		toggleSidebar(state) {
			state.sidebarVisible = !state.sidebarVisible
		},
		toggleUnfoldable(state) {
			state.sidebarUnfoldable = !state.sidebarUnfoldable
		},
		updateSidebarVisible(state, payload) {
			state.sidebarVisible = payload.value
		},
	},
	actions: {},
	modules: {},
	plugins: [createPersistedState({
		// Opciones de configuración del plugin
		storage: window.localStorage, // Puedes cambiar esto a sessionStorage si prefieres
	  })]
})
