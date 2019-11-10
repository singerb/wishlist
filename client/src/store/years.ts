import { RootState } from './store';
import { getStoreBuilder } from 'vuex-typex';

import axios from 'axios';

// state
interface Year {
	year: string;
	info: string;
}

export interface YearsState {
	years: Year[];
}

// builder
const builder = getStoreBuilder<RootState>() .module<YearsState>( 'years', { years: [] } );

// mutations plus wrappers
function setYears( state: YearsState, newYears: Year[] ) {
	state.years = newYears;
}

const setYearsWrapper = builder.commit( setYears );

// actions
async function getYears() {
	console.log( 'in store get years' );
	try {
		// TODO: add a network layer that caches/debounces requests
		const years = await axios.get( '/api/years' );

		setYearsWrapper( years.data );
	} catch ( err ) {
		console.error( err );
		setYearsWrapper( [] );
	}
}

const retrieveYears = builder.dispatch( getYears );

async function addYear(
	_: any,
	payload: { newYear: string, newYearInfo: string, newYearMembers?: number[] },
) {
	console.log( 'in store add year admin' );

	// pass errors or result up to caller
	const result = await axios.post( '/api/admin/year/add', payload );

	try {
		await retrieveYears();
	} catch ( err ) {
		console.error( err );
	}

	return result;
}

async function removeYear(
	_: any,
	payload: { year: string },
) {
	console.log( 'in store remove year admin' );

	// pass errors or result up to caller
	const result = await axios.post( '/api/admin/year/remove', payload );

	try {
		// TODO: doesn't seem to notice the removal?
		await retrieveYears();
	} catch ( err ) {
		console.error( err );
	}

	return result;
}

// for consumers
export default {
	get state() { return builder.state(); },

	retrieveYears: retrieveYears,
	addYear: builder.dispatch( addYear ),
	removeYear: builder.dispatch( removeYear ),
};
