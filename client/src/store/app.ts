import { RootState } from './store';
import { getStoreBuilder, BareActionContext } from 'vuex-typex';

import axios from 'axios';

// state
interface User {
	id: number;
	name: string;
	is_admin: boolean;
	year_viewing: number;
}

export interface AppState {
	loggedIn: boolean;
	user: User;
}

// builder
const builder = getStoreBuilder<RootState>().module<AppState>(
	'app',
	{ loggedIn: false, user: { id: -1, name: '', is_admin: false, year_viewing: -1 } },
);

// mutations plus wrappers
function setLoggedIn( state: AppState, newLoggedIn: boolean ) {
	state.loggedIn = newLoggedIn;
}

function setUser( state: AppState, newUser?: User ) {
	// state.user = newUser;
	Object.assign( state.user, newUser );
}

const setLoggedInWrapper = builder.commit( setLoggedIn );
const setUserWrapper = builder.commit( setUser );

// actions
async function checkUser() {
	console.log( 'in store check user' );
	try {
		// this will give a 401 if we're not logged in
		const user = await axios.get( '/api/user/me' );

		// if we got here, we're logged in!
		setUserWrapper( user.data );
		setLoggedInWrapper( true );
	} catch ( err ) {
		// TODO: distinguish the 401 by code
		console.error( err );
		setLoggedInWrapper( false );
		setUserWrapper( { id: -1, name: '', is_admin: false, year_viewing: -1 } );
	}
}

const checkUserWrapper = builder.dispatch( checkUser );

async function login( _: BareActionContext<AppState, RootState>, payload: { userId: number, password: string } ) {
	console.log( 'trying to login ' + payload.userId );

	// pass errors to caller
	await axios.post( '/api/login', {
		id: payload.userId,
		password: payload.password,
	} );

	// the call didn't error, so check the current user again
	await checkUserWrapper();
}

async function logout() {
	console.log( 'logging out' );
	try {
		const response = await axios.post( '/api/logout' );
		console.log( response );
	} catch ( err ) {
		// just log errors
		console.error( err );
	} finally {
		await checkUserWrapper();
	}
}

// for consumers
export default {
	get state() { return builder.state()(); },

	checkUser: checkUserWrapper,
	login: builder.dispatch( login ),
	logout: builder.dispatch( logout ),
};
