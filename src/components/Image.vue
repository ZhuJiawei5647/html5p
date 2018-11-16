<template>
	<div>
		<span>{{b}}</span>
		<span>{{a}}</span>
		<input v-focus="a"/>
	</div>
</template>
<script>
	import imageUrl from '@/assets/logo.png'
	export default {
		data () {
			return {
				a: Number(0).toFixed(2),
				b: 0.00
			}
		},
		methods: {
			
		}
	}
</script>
<style scoped>
	/*.img-box {
		float: left;
		margin: auto;
		position: relative;
		cursor: pointer;
	}
	img {
		display: block;
		height: 150px;
	}
	input {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		opacity: 0;
		z-index: 1;
	}*/
</style>