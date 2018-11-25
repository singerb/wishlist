exports.seed = ( knex, Promise ) => {
	// Deletes ALL existing entries
	return knex( 'links' ).del()
		.then( () => {
			// Inserts seed entries
			return knex( 'links' ).insert( [
				{ url: 'https://google.com', item_id: 1 },
				{ url: 'https://facebook.com', item_id: 1 },
				{ url: 'https://apple.com', item_id: 2 },
			] );
		} );
};
