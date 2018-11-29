<template>
	<wl-pill :color='"lightsalmon"'>{{ user.name }}</wl-pill>
</template>

<style lang="scss">

</style>

<script lang="ts">
import Vue from 'vue';

import Pill from './pill.vue';

export default Vue.extend( {
	props: [ 'user' ],
	components: {
		'wl-pill': Pill,
	},
} );
</script>
