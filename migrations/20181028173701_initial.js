exports.up = ( knex, Promise ) => {
	return Promise.all( [
		knex.schema.createTable( 'users', ( table ) => {
			table.increments( 'id' );
			table.string( 'name' );
			table.string( 'password' );
			table.boolean( 'is_admin' );
			table.string( 'year_viewing' );
		} ),
		knex.schema.createTable( 'items', ( table ) => {
			table.increments( 'id' );
			table.text( 'text' );
			table.integer( 'owner_id' ).references( 'users.id' ).onDelete( 'CASCADE' );
			table.integer( 'creator_id' ).references( 'users.id' ).onDelete( 'CASCADE' );
			table.string( 'year' );
			table.boolean( 'visible_to_owner' );
			table.boolean( 'claimed' ).defaultTo( false );
		} ),
		knex.schema.createTable( 'links', ( table ) => {
			table.increments( 'id' );
			table.text( 'url' );
			table.integer( 'item_id' ).references( 'items.id' ).onDelete( 'CASCADE' );
		} ),
		knex.schema.createTable( 'comments', ( table ) => {
			table.increments( 'id' );
			table.text( 'text' );
			table.integer( 'item_id' ).references( 'items.id' ).onDelete( 'CASCADE' );
			table.integer( 'creator_id' ).references( 'users.id' ).onDelete( 'CASCADE' );
			table.timestamp( 'created_at' ).defaultTo( knex.fn.now() );
		} ),
	] );
};

exports.down = ( knex, Promise ) => {
	return Promise.all( [
		knex.schema.dropTable( 'users' ),
		knex.schema.dropTable( 'items' ),
		knex.schema.dropTable( 'links' ),
		knex.schema.dropTable( 'comments' ),
	] );
};
