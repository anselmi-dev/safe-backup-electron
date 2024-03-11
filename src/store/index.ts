import { createStore } from "vuex"

const store = createStore({
	state: {
		directories: [],
	},
	mutations: {
		PUSH_DIRECTORIES(state:any, payload:any) {
			console.log({directories: state.directories})
			state.directories = payload;
		},
		UPDATE_DIRECTORY(state:any, payload:any) {
			let directory = state.directories.find(directory => directory.id === payload.id);
			if (directory) {
				directory.from = payload.from
				directory.to = payload.to
				directory.active = payload.active
				directory.schedule = payload.schedule
			}
		},

		DELETE_DIRECTORY(state:any, payload:any) {
			state.directories = state.directories.filter(directory => directory.id !== payload.id);
		},
		PUSH_DIRECTORY(state:any, payload:any) {
			state.directories.push(payload);
		},
	},
	actions: {
		pushDirectories(context:any, payload) {
			context.commit("PUSH_DIRECTORIES", payload);
		},
		updateDirectory(context:any, payload) {
			context.commit("UPDATE_DIRECTORY", payload);
		},
		deleteDirectory(context:any, payload) {
			context.commit("DELETE_DIRECTORY", payload);
		},
		pushDirectory(context:any, payload) {
			context.commit("PUSH_DIRECTORY", payload);
		},
	},
});

export default store;
