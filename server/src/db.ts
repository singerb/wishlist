import * as Knex from 'knex';
import { Model } from 'objection';
import getEnv, { Env } from './env';

export async function initializeDb() {
	let knex;
	if ( getEnv() === Env.DEVELOPMENT ) {
		const knexConfig = require( '../../knexfile' );
		knex = Knex( knexConfig.development );
		await Promise.resolve( knex.migrate.latest() );
		await Promise.resolve( knex.seed.run() );
	} else {
		const knexConfig = require( '../../production/knexfile' );
		knex = Knex( knexConfig.production );
		await Promise.resolve( knex.migrate.latest() );
	}

	Model.knex( knex );
}
