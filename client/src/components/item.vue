<template>
	<div class='item'>
		<div class='row'>
			<div class='eight columns'>
				<span v-if='item.owner.id !== currentUser.id && ( item.claimed || ( item.visible_to_owner && item.owner.id !== item.creator.id ) )'>
					<small v-if='item.claimed'><wl-pill :color='"lightyellow"'>Claimed</wl-pill></small>
					<small v-if='item.visible_to_owner && item.owner.id !== item.creator.id'><wl-pill :color='"lightblue"'>Visible to {{ item.owner.name }}</wl-pill></small>
					<br />
				</span>
				{{ item.text }}
				<br />
				<small>added by <wl-user :user='item.creator'></wl-user></small>
			</div>
			<div class='four columns'>
				<ul>
					<li v-for='link in item.links' :key='link.id'>
						<a :href='link.url' target='_blank'>{{ link.url }}</a>
					</li>
				</ul>
			</div>
		</div>
		<div class='row' v-if='item.creator.id == currentUser.id'>
			<div class='three columns'>
				<button class='button add' @click='duplicating = ! duplicating'>{{ duplicating ? ' v Duplicate' : '> Duplicate' }}</button>
			</div>
		</div>
		<form v-if='duplicating' v-on:submit.prevent='duplicateItem'>
			<div class='row'>
				<div class='six columns'>
					<label for='yearSelect' style='display: inline-block;'>To year:</label>
					<select v-model="targetYear" id='targetYearSelect'>
						<option v-for="year in years" :key='year.year' :value='year.year'>
							{{ year.year }} - {{ year.info }}
						</option>
					</select>
				</div>
				<div class='three columns'>
					<input class='button-primary' type='submit' value='Duplicate Item'>
				</div>
			</div>
		</form>
		<div class='row' v-if='item.owner.id !== currentUser.id'>
			<div class='three columns'>
				<button class='button add' @click='commenting = ! commenting'>{{ commenting ? ' v Comment' : '> Comment' }}</button>
			</div>
		</div>
		<form v-if='commenting' v-on:submit.prevent='addComment'>
			<div class='row'>
				<label :for='"comment" + item.id'>Comment</label>
				<textarea :id='"comment" + item.id' v-model='text' placeholder='Type your comment here' class='u-full-width'></textarea>
			</div>
			<div class='row'>
				<div class='nine columns'>
					<label v-if='! item.claimed'>
						<input type='checkbox' v-model='claimed'>
						<span class='label-body'>Check to claim this item (you have already bought or are buying it)</span>
					</label>
					<span v-else>
						This item is already claimed.
					</span>
				</div>
				<div class='three columns'>
					<input class='button-primary' type='submit' value='Comment'>
				</div>
			</div>
		</form>
		<div class='row' v-for='comment in item.comments' :key='comment.id'>
			<div class='three columns'></div>
			<div class='nine columns comment'>
				{{ comment.text }}
				<br />
				<small>by <wl-user :user='comment.creator'></wl-user> {{ niceDate( comment.created_at ) }}</small>
			</div>
		</div>
		<div class='row' v-if='item.owner.id === currentUser.id'>
			<div class='three columns'>
				<button class='button add' @click='deleting = ! deleting'>{{ deleting ? ' v Remove' : '> Remove' }}</button>
			</div>
		</div>
		<div class='row' v-if='deleting'>
			<form v-on:submit.prevent='removeItem'>
				<div class='six columns'>
					<p class='warning'>WARNING: will remove the item, all comments, and all links associated with it</p>
				</div>
				<div class='three columns'>
					<input class='button-primary' type='submit' value='Remove Item'>
				</div>
			</form>
		</div>
	</div>
</template>

<style lang="scss" scoped>

.item {
	background-color: #aaa;
	border-radius: 0.5em;
	padding: 1em;
	margin: 1em;
}
.item:nth-child(2n) {
	background-color: #ccc;
}

.comment {
	background-color: #eee;
	border-radius: 0.5em;
	padding: 0.5em;
	margin-top: 0.5em;
	margin-bottom: 0.5em;
}

.add {
	margin-top: 1rem;
}

.warning {
	background-color: #eee;
	color: red;
	border-radius: 0.5em;
	padding: 0.5em;
	margin-bottom: 0.5em;
}

</style>


<script lang="ts">
import Vue from 'vue';
import { niceDate } from '../util';

// components
import User from './user.vue';
import Pill from './pill.vue';

// store
import appStore from '../store/app';
import itemsStore from '../store/items';
import yearsStore from '../store/years';
// import usersStore from '../store/users';

export default Vue.extend( {
	props: [ 'item', 'year' ],
	computed: {
		currentUser() {
			return appStore.state.user;
		},
		years() {
			return yearsStore.state().years;
		},
	},
	data: () => {
		return {
			commenting: false,
			duplicating: false,
			deleting: false,
			text: '',
			claimed: false,
			targetYear: false,
		};
	},
	components: {
		'wl-user': User,
		'wl-pill': Pill,
	},
	methods: {
		async addComment() {
			await itemsStore.addComment( { text: this.text, itemId: this.item.id, claimed: this.claimed, year: this.year } );
			this.text = '';
			this.claimed = false;
		},
		async duplicateItem() {
			await itemsStore.duplicateItem( { itemId: this.item.id, year: this.targetYear } );
			this.targetYear = false;
			this.duplicating = false;
		},
		async removeItem() {
			await itemsStore.removeItem( { itemId: this.item.id, year: this.year } );
			this.deleting = false;
		},
		niceDate,
	},
} );
</script>
