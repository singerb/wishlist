import Vue from 'vue';
import Vuex from 'vuex';

import { getStoreBuilder } from 'vuex-typex';

// import for side-effects so that code doesn't get dropped
import './app';
import './users';
import './items';

import { AppState } from './app';
import { UsersState } from './users';
import { ItemsState } from './items';

export interface RootState {
	app: AppState;
	users: UsersState;
	items: ItemsState;
}

Vue.use( Vuex );

const builder = getStoreBuilder<RootState>();
export default builder.vuexStore();
