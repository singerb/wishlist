<template>
	<div>
		<h3>{{ user.name }}</h3>
		<wl-item v-for='item in items' :key='item.id' v-if='item.owner.id == user.id' :item='item'></wl-item>
		<div class='addItem'>
		<div class='row'>
			<div class='three columns'>
				<button class='button' @click='adding = ! adding'>{{ adding ? ' v Add Item' : '> Add Item' }}</button>
			</div>
		</div>
		<form v-if='adding' v-on:submit.prevent='addItem'>
			<div class='row'>
				<label :for='"text" + user.id'>Item Text</label>
				<textarea :id='"text" + user.id' v-model='text' placeholder='Describe the item here along with any instructions' class='u-full-width'></textarea>
			</div>
			<div class='row'>
				<div class='three columns'>
					<button class='button-primary' v-on:click.prevent='addLink'>+ Add Link</button>
				</div>
			</div>
			<div class='row' v-for='(link, index) in addingLinks' :key='link.id'>
				<div class='nine columns'>
					<label :for='"linkUrl" + user.id + "-" + index'>Link</label>
					<input :id='"linkUrl" + user.id + "-" + index' v-model='link.url' class='u-full-width' type='text' placeholder='Link URL'>
				</div>
				<div class='three columns'>
					<button class='button-primary' v-on:click.prevent='removeLink(index)'>- Remove Link</button>
				</div>
			</div>
			<div class='row'>
				<div class='nine columns'>
					<label v-if='user.id !== currentUser.id'>
						<input type='checkbox' v-model='visible_to_owner'>
						<span class='label-body'>Check to make this item visible to the person it's for ({{ user.name }})</span>
					</label>
					<span v-else>&nbsp;</span>
				</div>
				<div class='three columns'>
					<input class='button-primary' type='submit' value='Add Item'>
				</div>
			</div>
		</form>
		</div>
	</div>
</template>

<style lang="scss" scoped>

.addItem {
	margin: 1em;
}

</style>


<script lang="ts">
import Vue from 'vue';

// components
import Item from './item.vue';

// store
import appStore from '../store/app';
import itemsStore from '../store/items';
// import usersStore from '../store/users';

export default Vue.extend( {
	props: [ 'user' ],
	created: function() {
		this.getItems().catch( ( err ) => {
			console.error( err );
		} );
	},
	computed: {
		items() {
			return itemsStore.state().items;
		},
		currentUser() {
			return appStore.state.user;
		},
	},
	data: () => {
		return {
			adding: false,
			addingLinks: [],
			visible_to_owner: false,
			text: '',
		};
	},
	methods: {
		addLink() {
			this.addingLinks.push( { url: '' } );
		},
		removeLink( index ) {
			this.addingLinks.splice( index, 1 );
		},
		async getItems() {
			await itemsStore.retrieveItems();
		},
		async addItem() {
			await itemsStore.addItem( {
				text: this.text,
				ownerId: this.user.id,
				visible_to_owner: this.visible_to_owner,
				links: this.addingLinks,
			} );

			this.text = '';
			this.visible_to_owner = false;
			this.addingLinks = [];
		},
	},
	components: {
		'wl-item': Item,
	},
} );
</script>
