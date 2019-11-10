<template>
	<div>
		<h3>Edit a user:</h3>
		<div class='row'>
			<div class='four columns'>
				<label for='userSelect'>User</label>
				<select v-model="userSelect" id='userSelect'>
					<option disabled :value='false'>Select a user to edit</option>
					<option v-for="user in users" :key='user.id' :value='user'>
						{{ user.name }}
					</option>
				</select>
			</div>
		</div>
		<p>Change a name:</p>
		<form v-on:submit.prevent='editName'>
			<div class='row' v-if='userNameError'>
				<div class='six columns'>
					<p class='error'>{{ userNameError }}</p>
				</div>
			</div>
			<div class='row'>
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
				<div class='three columns'>
					<input type='submit' value='Reset Password' class='button-primary' />
				</div>
			</div>
		</form>
		<form v-on:submit.prevent='updateYears'>
			<div class='row' v-if='yearsError'>
				<div class='six columns'>
					<p class='error'>{{ yearsError }}</p>
				</div>
			</div>
			<div class='row'>
				<div class='six columns'>
					<label for='userYears'>Member of years</label>
					<select v-model="userYears" id='userYears' multiple class='yearSelect'>
						<option v-for="year in years" :key='year.year' :value='year.year'>
							{{ year.year }} - {{ year.info }}
						</option>
					</select>
				</div>
			</div>
			<div class='row'>
				<div class='three columns'>
					<input type='submit' value='Update Years' class='button-primary' />
				</div>
			</div>
		</form>
		<hr>
		<h3>Add a new user:</h3>
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
			</div>
			<div class='row'>
				<div class='three columns'>
					<input type='submit' value='Add User' class='button-primary' />
				</div>
			</div>
		</form>
		<hr>
		<h3>Remove a user:</h3>
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
		<hr>
		<h3>Add a new year:</h3>
		<form v-on:submit.prevent='addYear'>
			<div class='row' v-if='addYearError'>
				<div class='six columns'>
					<p class='error'>{{ addYearError }}</p>
				</div>
			</div>
			<div class='row'>
				<div class='six columns'>
					<label for='newYear'>New year</label>
					<input v-model='newYear' id='newYear' type='text' class='u-full-width' placeholder="New year" />
				</div>
			</div>
			<div class='row'>
				<div class='six columns'>
					<label for='newYearInfo'>New year info</label>
					<input v-model='newYearInfo' id='newYearInfo' type='text' class='u-full-width' placeholder="New year info" />
				</div>
			</div>
			<div class='row'>
				<div class='six columns'>
					<label for='userYears'>Initial members</label>
					<select v-model="yearUsers" id='yearUsers' multiple class='yearSelect'>
						<option v-for="user in users" :key='user.id' :value='user.id'>
							{{ user.name }}
						</option>
					</select>
				</div>
			</div>
			<div class='row'>
				<div class='three columns'>
					<input type='submit' value='Add Year' class='button-primary' />
				</div>
			</div>
		</form>
		<hr>
		<h3>Remove a year:</h3>
		<form v-on:submit.prevent='removeYear'>
			<div class='row' v-if='removeYearError'>
				<div class='six columns'>
					<p class='error'>{{ removeYearError }}</p>
				</div>
			</div>
			<div class='row'>
				<div class='four columns'>
					<label for='yearSelectRemove'>Year</label>
					<select v-model="removeYearSelect" id='yearSelectRemove'>
						<option disabled :value='false'>Select a year to remove it</option>
						<option v-for="year in years" :key='year.year' :value='year.year'>
							{{ year.year }} - {{ year.info }}
						</option>
					</select>
				</div>
			</div>
			<div class='row'>
				<div class='three columns'>
					<input type='submit' value='Remove Year' class='button-primary' />
				</div>
			</div>
		</form>
	</div>
</template>

<style lang="scss" scoped>

.error {
	color: red;
}

.yearSelect {
	height: 8em;
}

</style>


<script lang="ts">
import Vue from 'vue';

import { errorText } from '../util';

// components

// store
import appStore from '../store/app';
import usersStore from '../store/users';
import yearsStore from '../store/years';

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
		years() {
			return yearsStore.state().years;
		},
		currentUser() {
			return appStore.state.user;
		},
	},
	data() {
		return {
			userSelect: false,

			newName: '',
			nameError: false,

			passwordError: false,
			newPassword: false,

			userYears: [],
			yearsError: false,

			newUserName: '',
			newUserAdmin: false,
			newUserError: false,
			newUser: false,

			removeUserId: false,
			removeUserError: false,

			addYearError: false,
			newYear: '',
			newYearInfo: '',
			yearUsers: [],

			removeYearError: false,
			removeYearSelect: false,
		};
	},
	watch: {
		userSelect: function ( newUser, oldUser ) {
			this.newName = newUser.name;
			this.userYears = newUser.years.map( ( year ) => year.year );
		}
	},
	methods: {
		async editName() {
			if ( this.newName === '' ) {
				this.nameError = 'New name cannot be empty';

				return;
			}

			if ( ! this.userSelect ) {
				this.nameError = 'Select a user to edit their name';

				return;
			}

			this.nameError = false;
			try {
				await usersStore.editNameAdmin( { userId: this.userSelect.id, newName: this.newName } );
				this.newName = '';
			} catch ( err ) {
				this.nameError = errorText( err );
			}
		},
		async resetPassword() {
			this.newPassword = false;

			if ( ! this.userSelect ) {
				this.passwordError = 'Select a user to reset their password';

				return;
			}

			this.passwordError = false;
			try {
				const result = await usersStore.resetPassword( { userId: this.userSelect.id } );

				if ( result && result.data && result.data.result ) {
					this.newPassword = result.data.result;
				}
			} catch ( err ) {
				this.passwordError = errorText( err );
			}
		},
		async updateYears() {
			this.yearsError = false;
			const prevId = this.userSelect.id;
			try {
				const result = await usersStore.updateYears( { userId: this.userSelect.id, years: this.userYears } );
				// TODO: this is hacky and probably needed because we reload the whole users on update
				this.userSelect = this.users.find( ( user ) => user.id === prevId );
			} catch ( err ) {
				this.yearsError = errorText( err );
			}
		},
		async addYear() {
			this.addYearError = false;
			try {
				const result = await yearsStore.addYear( {
					newYear: this.newYear, newYearInfo: this.newYearInfo, newYearMembers: this.yearUsers
				} );
			} catch ( err ) {
				this.addYearError = errorText( err );
			}
		},
		async removeYear() {
			if ( ! this.removeYearSelect ) {
				this.nameError = 'Select a year to remove it';

				return;
			}

			this.removeYearError = false;
			try {
				const result = await yearsStore.removeYear( { year: this.removeYearSelect } );
			} catch ( err ) {
				this.removeYearError = errorText( err );
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
