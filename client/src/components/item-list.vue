<template>
	<div>
		<p>Welcome to the holiday wishlist, newly updated for 2018 and 2019. Here's a brief reivew and explanation of some new things:</p>
		<ul>
			<li>You can see items on other people's lists, and items on your own list that you've added or that were marked as visible to you. Note that this means Ben and Anne can see Wren's items, for now.</li>
			<li>You can see comments on other people's items (so Ben and Anne can see comments on Wren's items, for now).</li>
			<li>You can add items to your own list.</li>
			<li>You can add items to other people's lists, choosing whether to make them visible to that person.</li>
			<li>When adding items, you can add optional links to that item; new in 2018, you can add multiple links to one item. Use multiple links if you're giving people a choice, or showing some examples for a single item; keep multiple items separate.</li>
			<li>You can comment on other people's items; new in 2018, if you're commenting to say you bought or will buy something, you can choose to claim the item when you comment, which will flag it to remind other people not to get that.</li>
			<li>As of 2018 you can change your password and your name in the profile screen.</li>
			<li>As of 2019 you can view previous years and their items (although due to a migration issue some 2018 data was lost).</li>
			<li>As of 2020, you can remove items that you own (i.e. items on your list).</li>
			<li>And finally, as of 2020 you can duplicate items from previous years, along with their links but not comments (since those are usually year-specific); you can only duplicate items that you created originally.</li>
		</ul>
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
		year() {
			return appStore.state.yearViewing;
		},
		items() {
			return itemsStore.state().items;
		},
		users() {
			return usersStore.state().users.filter( ( user ) => user.years.map( ( year ) => year.year ).includes( this.year ) );
		},
	},
	methods: {
		async getItems() {
			await itemsStore.retrieveItems( { year: this.year } );
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
