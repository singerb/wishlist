import { RootState } from './store';
import { getStoreBuilder } from 'vuex-typex';

import axios from 'axios';

// state
interface Item {
	id: number;
	text: string;
}

export interface ItemsState {
	items: Item[];
}

// builder
const builder = getStoreBuilder<RootState>() .module<ItemsState>( 'items', { items: [] } );

// mutations plus wrappers
function setItems( state: ItemsState, newItems: Item[] ) {
	state.items = newItems;
}

const setItemsWrapper = builder.commit( setItems );

// actions
async function getItems( _: any, payload: { year: string } ) {
	console.log( 'in store get items' );
	try {
		const year = payload.year;
		const items = await axios.get( '/api/items/' + year );

		setItemsWrapper( items.data );
	} catch ( err ) {
		console.error( err );
		setItemsWrapper( [] );
	}
}

const retrieveItems = builder.dispatch( getItems );

async function addComment( _: any, payload: { text: string, itemId: number, claimed: boolean, year: string } ) {
	console.log( 'in store add comment' );
	try {
		await axios.post( '/api/comments', payload );

		await retrieveItems( { year: payload.year } );
	} catch ( err ) {
		console.error( err );
	}
}

async function addItem(
	_: any,
	payload: {
		text: string, ownerId: number, visible_to_owner: boolean, links: Array<{ url: string }>, year: string,
	} ) {
	console.log( 'in store add item' );
	try {
		await axios.post( '/api/items', payload );

		await retrieveItems( { year: payload.year } );
	} catch ( err ) {
		console.error( err );
	}
}

async function duplicateItem(
	_: any,
	payload: { itemId: number, year: string } ) {
	console.log( 'in store duplicate item' );
	try {
		await axios.post( '/api/items/duplicate', payload );

		await retrieveItems( { year: payload.year } );
	} catch ( err ) {
		console.error( err );
	}
}

async function removeItem(
	_: any,
	payload: { itemId: number, year: string } ) {
	console.log( 'in store remove item' );
	try {
		await axios.post( '/api/items/remove', payload );

		await retrieveItems( { year: payload.year } );
	} catch ( err ) {
		console.error( err );
	}
}

// for consumers
export default {
	get state() { return builder.state(); },

	retrieveItems: retrieveItems,
	addComment: builder.dispatch( addComment ),
	addItem: builder.dispatch( addItem ),
	duplicateItem: builder.dispatch( duplicateItem ),
	removeItem: builder.dispatch( removeItem ),
};
