<script lang="ts">
	import { mapMutations } from 'vuex';
	import { defineComponent } from 'vue';
	import EmptyStates from './EmptyStates.vue';
	import { CdFileSymlinkDirectory, AkClock, AkCloudUpload  } from "@kalimahapps/vue-icons";
	
	export default defineComponent({
		components: {
			EmptyStates,
			CdFileSymlinkDirectory,
			AkClock,
			AkCloudUpload
		},
		computed: {
			directories() {
				return (this as any).$store.state.directories;
			}
		},
		methods: {
			...mapMutations([
				'PUSH_DIRECTORY'
			]),
			// eslint-disable
			async backup (directory) {
				let object = Object.assign({}, directory);
				object.schedule = Object.assign({}, object.schedule);
				// eslint-disable-next-line
				window.electronAPI.directoryBackup(object)
			}
		},
		filters: {
			schedule: function (schedule) {
				if (!schedule)
					return 'SIN FECHA';

				return schedule.hours + ':' + schedule.minutes;
			}
		}
	})
</script>

<template>
	<div class="h-full">
		<ul v-if="directories.length" role="list" class="divide-y divide-gray-100 w-full">
			<template v-for="(directory) in directories" :key="directory.id">
				<li class="relative flex justify-between gap-x-6 py-5">
					<div class="flex min-w-0 gap-x-4">
						<CdFileSymlinkDirectory class="h-12 w-12"></CdFileSymlinkDirectory>
						<div class="min-w-0 flex-auto">
							<p class="text-sm font-semibold leading-6 text-gray-900">
								<span class="relative truncate hover:underline">
									{{ directory.from }}
								</span>
							</p>
							<p class="text-sm font-semibold leading-6 text-gray-900">
								<span class="relative truncate hover:underline">
									{{ directory.to }}
								</span>
							</p>
						</div>
					</div>
					<div class="flex shrink-0 items-center gap-x-4">
						<div class="hidden sm:flex sm:flex-col sm:items-end">
							<button type="button" v-on:click="backup(directory)" class="bg-indigo-400 hover:bg-indigo-600 rounded px-1 text-white">
								<span class="flex items-center gap-1">
									<AkCloudUpload class="h-5 w-5 text-white"></AkCloudUpload>
									<span>RESPALDAR</span>
								</span>
							</button>
							<p class="mt-1 leading-5 text-gray-500 flex items-center">
								<AkClock></AkClock>
								<time datetime="2023-01-23T13:23Z">
									{{ directory.schedule.hours + ':' + directory.schedule.minutes }}
								</time>
							</p>
						</div>

						<router-link type="button" :to="{ name: 'directory', params: { id: directory.id }}" class="h-full flex items-center justify-center bg-gray-100 rounded px-2">
							<svg class="h-5 w-5 flex-none text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
								<path fill-rule="evenodd"
									d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
									clip-rule="evenodd" />
							</svg>
						</router-link>
					</div>
				</li>
			</template>
		</ul>

		<div v-else class="flex items-center justify-center h-full">
			<EmptyStates></EmptyStates>
		</div>
	</div>
</template>
