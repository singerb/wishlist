exports.seed = ( knex, Promise ) => {
	// Deletes ALL existing entries
	return knex( 'years' ).del()
		.then( () => {
			// Inserts seed entries
			return knex( 'years' ).insert( [
				{ year: '2018', info: 'The first year of the new app' },
				{ year: '2019', info: 'Multi-year support arrives' },
			] ).then( () => {
				return knex( 'years_to_users' ).del()
					.then( () => {
						return knex( 'years_to_users' ).insert( [
							{ year: '2018', user_id: 1 },
							{ year: '2019', user_id: 1 },
							{ year: '2018', user_id: 2 },
							{ year: '2019', user_id: 2 },
							{ year: '2019', user_id: 3 },
						] );
					})
			});
		} );
};
