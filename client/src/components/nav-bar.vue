<template>
	<div class='navbar'>
		<div v-if='loggedIn'>
			<router-link to='/items' tag='button' active-class='button-primary'>Items</router-link>
			<router-link to='/profile' tag='button' exact active-class='button-primary'>User Profile</router-link>
			<router-link to='/admin' tag='button' exact active-class='button-primary' v-if='user.is_admin'>Admin Settings</router-link>
			<div style='display: inline-block;'>Welcome, {{ user.name }}!</div>
			<div class='right' v-if='yearViewing'>
				<label for='yearSelect' style='display: inline-block;'>Year</label>
				<select v-model="yearViewing" id='yearSelect'>
					<option v-for="year in years" :key='year.year' :value='year.year'>
						{{ year.year }} - {{ year.info }}
					</option>
				</select>
				<button v-on:click.prevent='logout'>Logout</button>
			</div>
		</div>
		<div v-else>
			<button v-on:click.prevent='nothing'>Logged Out</button>
		</div>
	</div>
</template>

<style lang="scss" scoped>
div.navbar {
	overflow:         hidden;
	background-color: #eee;
	position:         fixed; /* Set the navbar to fixed position */
	top:              0; /* Position the navbar at the top of the page */
	width:            100%; /* Full width */
	border-bottom: 1px black solid;
	padding-top: 1rem;
	padding-left: 1rem;
	z-index: 999;
}

.navbar .left {
	float: left;
}

.navbar .right {
	float: right;
	margin-right: 2rem;
}

</style>


<script lang="ts">
import Vue from 'vue';

// store
import appStore from '../store/app';
import yearsStore from '../store/years';
import itemsStore from '../store/items';

export default Vue.extend( {
	created: function() {
		this.getUser().catch( ( err ) => {
			console.error( err );
		} );
		this.getYears().catch( ( err ) => {
			console.error( err );
		} );
	},
	computed: {
		user() {
			return appStore.state.user;
		},
		loggedIn() {
			return appStore.state.loggedIn;
		},
		years() {
			return yearsStore.state().years;
		},
		yearViewing: {
			get() {
				return appStore.state.yearViewing;
			},
			set( value: string ) {
				// our routing will take care of updating the stat and getting new items
				this.$router.push( '/items/' + value );
			}
		}
	},
	methods: {
		async getUser() {
			await appStore.checkUser();
		},
		async logout() {
			await appStore.logout();
			this.$router.push( '/login' );
		},
		async getYears() {
			await yearsStore.retrieveYears();
		},
		nothing() {
			// do nothing
		}
	},
} );
</script>
