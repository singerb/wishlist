import { RootState } from './store';
import { getStoreBuilder } from 'vuex-typex';

import appStore from './app';

import axios from 'axios';

// state
interface User {
	id: number;
	name: string;
	years: Array<{ year: string, info: string }>;
}

export interface UsersState {
	users: User[];
}

// builder
const builder = getStoreBuilder<RootState>() .module<UsersState>( 'users', { users: [] } );

// mutations plus wrappers
function setUsers( state: UsersState, newUsers: User[] ) {
	state.users = newUsers;
}

const setUsersWrapper = builder.commit( setUsers );

// actions
async function getUsers() {
	console.log( 'in store get users' );
	try {
		// TODO: add a network layer that caches/debounces requests
		const users = await axios.get( '/api/users' );

		setUsersWrapper( users.data );
	} catch ( err ) {
		console.error( err );
		setUsersWrapper( [] );
	}
}

const retrieveUsers = builder.dispatch( getUsers );

async function editName( _: any, payload: { newName: string } ) {
	console.log( 'in store edit name' );

	// pass errors up to caller
	await axios.post( '/api/user/name', payload );

	try {
		await retrieveUsers();
		await appStore.checkUser();
	} catch ( err ) {
		console.error( err );
	}
}

async function changePassword(
	_: any,
	payload: { oldPassword: string, newPasswordOne: string, newPasswordTwo: string },
) {
	console.log( 'in store change password' );

	// pass errors up to caller
	await axios.post( '/api/user/password', payload );
}

async function editNameAdmin(
	_: any,
	payload: { newName: string, userId: number },
) {
	console.log( 'in store edit name admin' );

	// pass errors up to caller
	await axios.post( '/api/admin/user/edit', payload );

	try {
		await retrieveUsers();
		await appStore.checkUser();
	} catch ( err ) {
		console.error( err );
	}
}

async function resetPassword(
	_: any,
	payload: { userId: number },
) {
	console.log( 'in store reset password admin' );

	// pass errors or result up to caller
	return axios.post( '/api/admin/user/reset', payload );
}

async function addUser(
	_: any,
	payload: { newUserName: string, is_admin: boolean },
) {
	console.log( 'in store add user admin' );

	// pass errors or result up to caller
	const result = await axios.post( '/api/admin/user/add', payload );

	try {
		await retrieveUsers();
	} catch ( err ) {
		console.error( err );
	}

	return result;
}

async function removeUser(
	_: any,
	payload: { userId: number },
) {
	console.log( 'in store remove user admin' );

	// pass errors or result up to caller
	const result = await axios.post( '/api/admin/user/remove', payload );

	try {
		// TODO: doesn't seem to notice the removal?
		await retrieveUsers();
	} catch ( err ) {
		console.error( err );
	}

	return result;
}

async function updateYears(
	_: any,
	payload: { userId: number, years: string[] },
) {
	console.log( 'in store update years admin' );

	// pass errors or result up to caller
	const result = await axios.post( '/api/admin/user/years', payload );

	try {
		await retrieveUsers();
	} catch ( err ) {
		console.error( err );
	}

	return result;
}

// for consumers
export default {
	get state() { return builder.state(); },

	retrieveUsers: retrieveUsers,
	editName: builder.dispatch( editName ),
	changePassword: builder.dispatch( changePassword ),

	editNameAdmin: builder.dispatch( editNameAdmin ),
	resetPassword: builder.dispatch( resetPassword ),
	addUser: builder.dispatch( addUser ),
	removeUser: builder.dispatch( removeUser ),
	updateYears: builder.dispatch( updateYears ),
};
