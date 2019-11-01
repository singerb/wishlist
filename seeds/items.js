exports.seed = ( knex, Promise ) => {
	// Deletes ALL existing entries
	return knex( 'items' ).del()
		.then( () => {
			// Inserts seed entries
			return knex( 'items' ).insert( [
				{ text: 'Test item one', owner_id: 1, creator_id: 1, year: '2018', visible_to_owner: true, claimed: false },
				{ text: 'Test item two', owner_id: 2, creator_id: 2, year: '2018', visible_to_owner: true, claimed: true },
				{ text: 'Test suggestion one', owner_id: 1, creator_id: 2, year: '2018', visible_to_owner: true, claimed: false },
				{ text: 'Test suggestion two', owner_id: 1, creator_id: 2, year: '2018', visible_to_owner: false, claimed: false },
				{ text: 'a 2019 item, fancy', owner_id: 1, creator_id: 1, year: '2019', visible_to_owner: true, claimed: false },
			] );
		} );
};
