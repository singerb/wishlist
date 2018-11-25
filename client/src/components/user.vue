<template>
	<span class='userName'>{{ user.name }}</span>
</template>

<style lang="scss">

span.userName {
	background-color: lightsalmon;
	border-radius: 0.5em;
	padding: 0.25em;
	margin: 0.25em;
}

</style>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend( {
	props: [ 'user' ],
} );
</script>
