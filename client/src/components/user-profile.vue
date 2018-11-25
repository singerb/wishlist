<template>
	<div>
		<p>Change your name:</p>
		<form v-on:submit.prevent='editName'>
			<div class='row' v-if='nameError'>
				<div class='six columns'>
					<p class='error'>{{ nameError }}</p>
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
		<hr>
		<p>Change your password:</p>
		<form v-on:submit.prevent='changePassword'>
			<div class='row' v-if='passwordError'>
				<div class='six columns'>
					<p class='error'>{{ passwordError }}</p>
				</div>
			</div>
			<div class='row'>
				<div class='six columns'>
					<label for='oldPassword'>Old Password</label>
					<input v-model='oldPassword' id='oldPassword' type='password' class='u-full-width' placeholder="Password" />
				</div>
			</div>
			<div class='row'>
				<div class='six columns'>
					<label for='newPasswordOne'>New Password</label>
					<input v-model='newPasswordOne' id='newPasswordOne' type='password' class='u-full-width' placeholder="Password" />
				</div>
			</div>
			<div class='row'>
				<div class='six columns'>
					<label for='newPasswordTwo'>New Password (again)</label>
					<input v-model='newPasswordTwo' id='newPasswordTwo' type='password' class='u-full-width' placeholder="Password" />
				</div>
			</div>
			<div class='row'>
				<div class='three columns'>
					<input type='submit' value='Change Password' class='button-primary' />
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
	computed: {
		user() {
			return appStore.state.user;
		},
	},
	data() {
		return {
			oldPassword: '',
			newPasswordOne: '',
			newPasswordTwo: '',
			newName: '',
			nameError: false,
			passwordError: false,
		};
	},
	methods: {
		async editName() {
			if ( this.newName === '' ) {
				this.nameError = 'New name cannot be empty';

				return;
			}

			this.nameError = false;
			try {
				await usersStore.editName( { newName: this.newName } );
			} catch ( err ) {
				this.nameError = errorText( err );
			}
		},
		async changePassword() {
			if ( this.oldPassword === '' ) {
				this.passwordError = 'Old password cannot be empty';

				return;
			}

			if ( this.newPasswordOne === '' || this.newPasswordTwo === '' ) {
				this.passwordError = 'New password cannot be empty';

				return;
			}

			if ( this.newPasswordOne !== this.newPasswordTwo ) {
				this.passwordError = 'New passwords must match';

				return;
			}

			this.passwordError = false;
			try {
				await usersStore.changePassword(
					{ oldPassword: this.oldPassword, newPasswordOne: this.newPasswordOne, newPasswordTwo: this.newPasswordTwo },
				);
			} catch ( err ) {
				this.passwordError = errorText( err );
			}
		},
	},
	components: {
	},
} );
</script>
