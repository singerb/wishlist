import Vue from 'vue';
import Vuex from 'vuex';

import { getStoreBuilder } from 'vuex-typex';

// import for side-effects so that code doesn't get dropped
import './app';
import './users';
import './items';
import './years';

import { AppState } from './app';
import { UsersState } from './users';
import { ItemsState } from './items';
import { YearsState } from './years';

export interface RootState {
	app: AppState;
	users: UsersState;
	items: ItemsState;
	years: YearsState;
}

Vue.use( Vuex );

const builder = getStoreBuilder<RootState>();
export default builder.vuexStore();
