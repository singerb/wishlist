<template>
	<span class='pill' :style='{ "background-color": color }'><slot></slot></span>
</template>

<style lang="scss">

span.pill {
	border-radius: 0.5em;
	padding: 0.25em;
	margin: 0.25em;
}

</style>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend( {
	props: [ 'color' ],
} );
</script>
