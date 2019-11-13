exports.up = function(knex, Promise) {
	return Promise.all( [
		knex.schema.hasTable( 'links' ).then( ( exists ) => {
			if ( ! exists ) {
				knex.schema.createTable( 'links', ( table ) => {
					table.increments( 'id' );
					table.text( 'url' );
					table.integer( 'item_id' ).unsigned().notNullable().references( 'items.id' ).onDelete( 'CASCADE' );
				} );
			}
		} ),
		knex.schema.hasTable( 'links' ).then( ( exists ) => {
			if ( ! exists ) {
				knex.schema.createTable( 'comments', ( table ) => {
					table.increments( 'id' );
					table.text( 'text' );
					table.integer( 'item_id' ).unsigned().notNullable().references( 'items.id' ).onDelete( 'CASCADE' );
					table.integer( 'creator_id' ).unsigned().notNullable().references( 'users.id' ).onDelete( 'CASCADE' );
					table.timestamp( 'created_at' ).defaultTo( knex.fn.now() );
				} );
			}
		} ),
	] );
};

exports.down = function(knex, Promise) {
  
};

