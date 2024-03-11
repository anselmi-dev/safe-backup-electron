<template>
	<div class="text-center h-full flex flex-col justify-center items-center">
		<h1 class="text-6xl font-bold text-red-400">404</h1>
		<p class="text-xl text-gray-400">Not Found</p>
		<router-link :to="{ name: 'directories' }"
			class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
			Inicio
		</router-link>
	</div>
</template>