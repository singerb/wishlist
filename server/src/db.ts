import * as Knex from 'knex';
import { Model } from 'objection';
import getEnv, { Env } from './env';
import { logger } from './logger';

export async function initializeDb() {
	let knex;
	if ( getEnv() === Env.DEVELOPMENT ) {
		const knexConfig = require( '../../knexfile' );
		knex = Knex( knexConfig.development );
		try {
			await Promise.resolve( knex.migrate.latest() );
		} catch ( err ) {
			logger.error( 'Error running migrations ' + err );
			throw err;
		}
		try {
			await Promise.resolve( knex.seed.run() );
		} catch ( err ) {
			logger.error( 'Error running seeds ' + err );
			throw err;
		}
	} else {
		const knexConfig = require( '../../production/knexfile' );
		knex = Knex( knexConfig.production );
		await Promise.resolve( knex.migrate.latest() );
	}

	Model.knex( knex );
}
