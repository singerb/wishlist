exports.seed = ( knex, Promise ) => {
	// Deletes ALL existing entries
	return knex( 'comments' ).del()
		.then( () => {
			// Inserts seed entries
			return knex( 'comments' ).insert( [
				{ text: 'Yay, a comment!', item_id: 2, creator_id: 1 },
			] );
		} );
};
