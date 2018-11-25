<template>
	<div>
		<p>Change a name:</p>
		<form v-on:submit.prevent='editName'>
			<div class='row' v-if='nameError'>
				<div class='six columns'>
					<p class='error'>{{ nameError }}</p>
				</div>
			</div>
			<div class='row'>
				<div class='four columns'>
					<label for='userSelectName'>User</label>
					<select v-model="userSelectName" id='userSelectName'>
						<option disabled :value='false'>Select a user to edit their name</option>
						<option v-for="user in users" :key='user.id' :value='user.id'>
							{{ user.name }}
						</option>
					</select>
				</div>
				<div class='six columns'>
					<label for='newName'>New name</label>
					<input v-model='newName' id='newName' type='text' class='u-full-width' placeholder="New name" />
				</div>
			</div>
			<div class='row'>
				<div class='three columns'>
					<input type='submit' value='Change Name' class='button-primary' />
				</div>
			</div>
		</form>
		<hr>
		<p>Reset a password:</p>
		<form v-on:submit.prevent='resetPassword'>
			<div class='row' v-if='passwordError'>
				<div class='six columns'>
					<p class='error'>{{ passwordError }}</p>
				</div>
			</div>
			<div class='row' v-if='newPassword'>
				<div class='six columns'>
					<p class='success'>Password was reset to: {{ newPassword }}</p>
				</div>
			</div>
			<div class='row'>
				<div class='four columns'>
					<label for='userSelectPassword'>User</label>
					<select v-model="resetPasswordFor" id='userSelectPassword'>
						<option disabled :value='false'>Select a user to reset their password</option>
						<option v-for="user in users" :key='user.id' :value='user.id'>
							{{ user.name }}
						</option>
					</select>
				</div>
			</div>
			<div class='row'>
				<div class='three columns'>
					<input type='submit' value='Reset Password' class='button-primary' />
				</div>
			</div>
		</form>
		<hr>
		<p>Add a new user:</p>
		<form v-on:submit.prevent='addUser'>
			<div class='row' v-if='addUserError'>
				<div class='six columns'>
					<p class='error'>{{ addUserError }}</p>
				</div>
			</div>
			<div class='row' v-if='newUser'>
				<div class='six columns'>
					<p class='success'>New user created with initial password: {{ newUser }}</p>
				</div>
			</div>
			<div class='row'>
				<div class='six columns'>
					<label for='newUserName'>New user name</label>
					<input v-model='newUserName' id='newUserName' type='text' class='u-full-width' placeholder="New name" />
				</div>
			</div>
			<div class='row'>
				<div class='nine columns'>
					<label>
						<input type='checkbox' v-model='newUserAdmin'>
						<span class='label-body'>Make this user an admin</span>
					</label>
				</div>
				<div class='three columns'>
					<input type='submit' value='Add User' class='button-primary' />
				</div>
			</div>
		</form>
		<hr>
		<p>Remove a user:</p>
		<form v-on:submit.prevent='removeUser'>
			<div class='row' v-if='removeUserError'>
				<div class='six columns'>
					<p class='error'>{{ removeUserError }}</p>
				</div>
			</div>
			<div class='row'>
				<div class='four columns'>
					<label for='userSelectRemove'>User</label>
					<select v-model="removeUserId" id='userSelectRemove'>
						<option disabled :value='false'>Select a user to remove them</option>
						<option v-for="user in users" :key='user.id' :value='user.id'>
							{{ user.name }}
						</option>
					</select>
				</div>
			</div>
			<div class='row'>
				<div class='three columns'>
					<input type='submit' value='Remove User' class='button-primary' />
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
		currentUser() {
			return appStore.state.user;
		},
	},
	data() {
		return {
			userSelectName: false,
			newName: '',
			nameError: false,

			resetPasswordFor: false,
			passwordError: false,
			newPassword: false,

			newUserName: '',
			newUserAdmin: false,
			newUserError: false,
			newUser: false,

			removeUserId: false,
			removeUserError: false,
		};
	},
	methods: {
		async editName() {
			// TODO: all these selects need updates to clear or set initial value when changed!

			if ( this.newName === '' ) {
				this.nameError = 'New name cannot be empty';

				return;
			}

			if ( ! this.userSelectName ) {
				this.nameError = 'Select a user to edit their name';

				return;
			}

			this.nameError = false;
			try {
				await usersStore.editNameAdmin( { userId: this.userSelectName, newName: this.newName } );
			} catch ( err ) {
				this.nameError = errorText( err );
			}
		},
		async resetPassword() {
			this.newPassword = false;

			if ( ! this.resetPasswordFor ) {
				this.passwordError = 'Select a user to reset their password';

				return;
			}

			this.passwordError = false;
			try {
				const result = await usersStore.resetPassword( { userId: this.resetPasswordFor } );

				if ( result && result.data && result.data.result ) {
					this.newPassword = result.data.result;
				}
			} catch ( err ) {
				this.passwordError = errorText( err );
			}
		},
		async addUser() {
			this.newUser = false;

			if ( this.newUserName === '' ) {
				this.newUserError = 'New name cannot be empty';

				return;
			}

			this.newUserError = false;
			try {
				const result = await usersStore.addUser( { newUserName: this.newUserName, is_admin: this.newUserAdmin } );

				if ( result && result.data && result.data.result ) {
					this.newUser = result.data.result;
				}
			} catch ( err ) {
				this.passwordError = errorText( err );
			}
		},
		async removeUser() {
			if ( ! this.removeUserId ) {
				this.removeUserError = 'Select a user to remove them';

				return;
			}

			if ( this.removeUserId === this.currentUser ) {
				this.removeUserError = 'Cannot remove your own user';

				return;
			}

			this.removeUserError = false;
			try {
				await usersStore.removeUser( { userId: this.removeUserId } );
			} catch ( err ) {
				this.removeUserError = errorText( err );
			}
		},
		async getUsers() {
			await usersStore.retrieveUsers();
		},
	},
	components: {
	},
} );
</script>
