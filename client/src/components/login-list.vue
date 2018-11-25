<template>
	<div>
		<form v-on:submit.prevent='login'>
			<div class='row' v-if='loginError'>
				<div class='four columns'>
					<p class='error'>{{ loginError }}</p>
				</div>
			</div>
			<div class='row'>
				<div class='four columns'>
					<label for='userSelect'>User</label>
					<select v-model="loginAs" id='userSelect'>
						<option disabled :value='false'>Select a user to log in as</option>
						<option v-for="user in users" :key='user.id' :value='user.id'>
							{{ user.name }}
						</option>
					</select>
				</div>
				<div class='six columns'>
					<label for='password'>Password</label>
					<input v-model='password' id='password' type='password' placeholder="Password" class='u-full-width'/>
				</div>
				<div class='two columns'>
					<label>&nbsp;</label>
					<input type='submit' value='Login' class='button-primary' />
				</div>
			</div>
		</form>
	</div>
</template>

<style lang="scss" scoped>

.error {
	color: red;
}

</style>


<script lang="ts">
import Vue from 'vue';

import { errorText } from '../util';

// components

// store
import appStore from '../store/app';
import usersStore from '../store/users';

export default Vue.extend( {
	created: function() {
		this.getUsers().catch( ( err ) => {
			console.error( err );
		} );
	},
	computed: {
		users() {
			return usersStore.state().users;
		},
	},
	data() {
		return {
			loginAs: false,
			password: '',
			loginError: false,
		};
	},
	methods: {
		async getUsers() {
			await usersStore.retrieveUsers();
		},
		async login() {
			if ( ! this.loginAs ) {
				this.loginError = 'Select a user to log in';

				return;
			}

			if ( this.password === '' ) {
				this.loginError = 'Enter a password to log in';

				return;
			}

			try {
				this.loginError = false;
				await appStore.login( { userId: this.loginAs, password: this.password } );
				this.$router.push( '/' );
			} catch ( err ) {
				this.loginError = errorText( err );
			}
		},
	},
	components: {
	},
} );
</script>
