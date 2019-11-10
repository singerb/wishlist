exports.up = function( knex, Promise ) {
	return Promise.all( [
		knex.schema.createTable( 'years', ( table ) => {
			table.string( 'year' ).primary();
			table.text( 'info' );
		} ),
		knex.schema.createTable( 'years_to_users', ( table ) => {
			table.increments( 'id' );
			table.integer( 'user_id' ).unsigned().notNullable().references( 'users.id' ).onDelete( 'CASCADE' );
			table.string( 'year' ).notNullable().references( 'years.year' ).onDelete( 'CASCADE' );
		} ),
		knex.schema.alterTable( 'users', ( table ) => {
			table.dropColumn( 'year_viewing' );
		} ),
		knex.schema.alterTable( 'items', ( table ) => {
			if ( process.env.NODE_ENV && process.env.NODE_ENV === 'production' ) {
				// can't do this in sqlite
				table.string( 'year' ).notNullable().references( 'years.year' ).onDelete( 'CASCADE' ).alter();
			}
		})
	] );
};

exports.down = function( knex, Promise ) {
	return Promise.all( [
		knex.schema.alterTable( 'users', ( table ) => {
			table.string( 'year_viewing' );
		} ),
		knex.schema.alterTable( 'items', ( table ) => {
			table.string( 'year' ).alter();
		} ),
		knex.schema.dropTable( 'years' ),
		knex.schema.dropTable( 'years_to_users' ),
	] );
};
