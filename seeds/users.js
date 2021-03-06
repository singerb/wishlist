const bcrypt = require( 'bcrypt' );

exports.seed = ( knex, Promise ) => {
	// Deletes ALL existing entries
	return knex( 'users' ).del()
		.then( () => {
			// Inserts seed entries
			return knex( 'users' ).insert( [
				{ name: 'Benedict Singer', is_admin: true, password: bcrypt.hashSync( 'abc123', 10 ) },
				{ name: 'Anne Heminger', is_admin: false, password: bcrypt.hashSync( '123abc', 10 ) },
				{ name: 'Wren Singer', is_admin: false, password: bcrypt.hashSync( 'whee', 10 ) },
			] );
		} );
};
