<script>
import { mapMutations } from 'vuex'

export default {
  mounted() {
    this.initRepositories();
  },
  computed: {
    directories() {
      return this.$store.state.directories
    },
  },
  methods: {
    ...mapMutations(['PUSH_DIRECTORY', 'PUSH_DIRECTORIES']),
    initRepositories() {
      window.electronAPI.dbDirectories().then((directories) => {
        this.PUSH_DIRECTORIES(directories)
      })
      .catch((error) => {
        console.error('Error al abrir el archivo:', error);
      });
    }
  },
}
</script>

<template>
  <main class="pt-5 | h-full flex flex-col items-center justify-center w-full">
    <div class="px-4 sm:px-6 lg:px-8 | relative border-b border-gray-200 pb-5 sm:pb-0 w-full">
      <div class="flex items-center justify-between pb-2">
        <router-link to="/" class="text-2xl font-semibold leading-6 text-gray-900">
          Directorios
        </router-link>
        <div class="flex md:right-0 md:mt-0" v-if="directories.length">
          <router-link type="button" to="/directory"
            class="ml-3 inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            Nuevo respaldo
          </router-link>
        </div>
      </div>
    </div>

    <div class="w-full flex-1 overflow-y-auto overflow-x-hidden">
      <div class="px-4 sm:px-6 lg:px-8 h-full w-full">
        <router-view>
        </router-view>
      </div>
    </div>
  </main>
</template>
