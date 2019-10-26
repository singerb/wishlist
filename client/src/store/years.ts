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

// for consumers
export default {
	get state() { return builder.state(); },

	retrieveYears: retrieveYears,
};
