<template>
	<div>
		<p>Instructions about items and comments go here.</p>
		<div v-for='user in users' :key='user.id'>
			<wl-user-items :user='user'></wl-user-items>
		</div>
	</div>
</template>

<style lang="scss" scoped>

</style>


<script lang="ts">
import Vue from 'vue';

// components
import UserItems from './user-items.vue';

// store
import appStore from '../store/app';
import itemsStore from '../store/items';
import usersStore from '../store/users';

export default Vue.extend( {
	created: function() {
		this.getItems().catch( ( err ) => {
			console.error( err );
		} );
		this.getUsers().catch( ( err ) => {
			console.error( err );
		} );
	},
	computed: {
		items() {
			return itemsStore.state().items;
		},
		users() {
			return usersStore.state().users;
		},
	},
	methods: {
		async getItems() {
			await itemsStore.retrieveItems();
		},
		async getUsers() {
			await usersStore.retrieveUsers();
		},
	},
	components: {
		'wl-user-items': UserItems,
	},
} );
</script>
