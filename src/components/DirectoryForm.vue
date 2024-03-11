<script lang="ts">
import { mapMutations } from 'vuex';
import { defineComponent } from 'vue';
import { AdClose } from "@kalimahapps/vue-icons";
import { ref } from 'vue';
import { FwbToggle } from 'flowbite-vue'
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import { toast } from 'vue3-toastify';

export default defineComponent({
	props: ['id'],
	components: {
		AdClose,
		FwbToggle,
		VueDatePicker,
	},
	data() {
		return {
			time: ref({
				hours: new Date().getHours(),
				minutes: new Date().getMinutes()
			}),
			directory: {
				id: null,
				from: '',
				to: '',
				schedule: '',
				active: true
			}
		}
	},
	mounted() {
		if (this.id) {
			const directory = this.directories.find(directory => directory.id === this.id);
			if (directory) {
				this.directory.id = this.id;
				this.directory.from = directory.from;
				this.directory.to = directory.to;
				this.directory.schedule = directory.schedule;
				this.directory.active = directory.active;

			}
		} else {
			this.directory.id = this.$uuid.v4();
		}
	},
	computed: {
		directories() {
			return (this as any).$store.state.directories;
		}
	},
	methods: {
		...mapMutations([
			'PUSH_DIRECTORY',
			'DELETE_DIRECTORY',
			'UPDATE_DIRECTORY'
		]),
		async selectDirectory(dir) {
			window.electronAPI.openDialogDirectory().then((filePath) => {
				if (dir == 'from')
					this.directory.from = filePath;
				else
					this.directory.to = filePath;

			})
			.catch((error) => {
				console.error('Error al abrir el archivo:', error)
			});
		},
		async onSubmit() {
			if (!(this.directory.from && this.directory.to && this.directory.schedule)) {
				toast.warn("Complete los datos para continuar", {
					theme: "dark",
					autoClose: 2000,
					position: toast.POSITION.TOP_RIGHT,
				});
				return;
			}
			if (this.id) {
				this.update()
			} else {
				this.create()
			}

			this.back();
		},
		create () {
			let object = Object.assign({}, this.directory);
			
			this.PUSH_DIRECTORY(object);	
			
			window.electronAPI.dbDirectoryWrite(JSON.stringify(this.directories));
		},
		update () {
			let object = Object.assign({}, this.directory);
			object.schedule = Object.assign({}, object.schedule);

			this.UPDATE_DIRECTORY(object);

			window.electronAPI.dbDirectoryWrite(JSON.stringify(this.directories));
		},
		destroy () {
			let object = Object.assign({}, this.directory);
			this.DELETE_DIRECTORY(object);

			window.electronAPI.dbDirectoryWrite(JSON.stringify(this.directories));

			this.back();
		},
		back () {
			this.$router.push('/');
		}
	}
})
</script>

<template>
	<div>
		<form @submit="onSubmit">
			<div class="space-y-12 sm:space-y-16 _py-10">
				<div>
					<div
						class="mt-10 space-y-8 border-b border-gray-900/10 pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">
						<!-- DIR:FROM -->
						<div class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
							<label for="from" class="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
								Directorio a respaldar
							</label>
							<div class="mt-2 sm:col-span-2 sm:mt-0 flex items-center gap-2 w-full">
								<div
									class="flex flex-1 rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
									<span class="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
										<AdClose></AdClose>
									</span>
									<input v-model="directory.from" type="text" name="from" id="from" disabled="true"
										class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6">
								</div>
								<button type="button" @click="selectDirectory('from')"
									class="rounded-md bg-white px-2.5 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">Seleccionar</button>
							</div>
						</div>

						<!-- DIR:TO -->
						<div class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
							<label for="to" class="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
								Directorio del respaldo
							</label>
							<div class="mt-2 sm:col-span-2 sm:mt-0 flex items-center gap-2 w-full">
								<div
									class="flex flex-1 rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
									<span class="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
										<AdClose></AdClose>
									</span>
									<input v-model="directory.to" type="text" name="to" id="to" disabled="true"
										class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6">
								</div>
								<button type="button" @click="selectDirectory('to')"
									class="rounded-md bg-white px-2.5 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">Seleccionar</button>
							</div>
						</div>

						<!-- INPUT:ACTIVE -->
						<div class="sm:grid sm:grid-cols-3 sm:items-center sm:gap-4 sm:py-6">
							<label for="photo" class="block text-sm font-medium leading-6 text-gray-900">
								Horario de respaldo
							</label>
							<div class="mt-2 sm:col-span-2 sm:mt-0">
								<VueDatePicker v-model="directory.schedule" time-picker type="HH:mm"
									placeholder="Select Time"></VueDatePicker>
							</div>
						</div>

						<!-- INPUT:ACTIVE -->
						<div class="sm:grid sm:grid-cols-3 sm:items-center sm:gap-4 sm:py-6">
							<div class="mt-2 sm:col-span-2 sm:mt-0">
								<fwb-toggle v-model="directory.active" label="Activo" />
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="mt-6 flex items-center justify-between gap-x-6">
				<button v-show="id" v-on:click="destroy()" type="button" class="inline-flex justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">
					Eliminar
				</button>
				<div class="flex items-center justify-end gap-x-6">

					<button v-on:click="back()" type="button" class="text-sm font-semibold leading-6 text-gray-900">
						Cancelar
					</button>

					<button type="submit"
					class="inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
						Guardar
					</button>
				</div>
			</div>
		</form>
	</div>
</template>
