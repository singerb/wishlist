import * as express from 'express';
import { join } from 'path';
import * as morgan from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as history from 'connect-history-api-fallback';

import config from './config';
import { logger } from './logger';
import { initializeDb } from './db';
import { authCheck, authAndAdminCheck } from './auth';

import { api } from './api/api';

function wrapApi( fn: ( req: express.Request, res: express.Response ) => Promise<void> ) {
	return ( req: express.Request, res: express.Response, next: express.NextFunction ) => {
		fn( req, res ).catch( next );
	};
}

async function main() {
	await initializeDb();

	const router = express();

	const staticPath = join( __dirname, '../../client/dist' );

	router.use( morgan( 'dev' ) );
	router.use( history( { verbose: false } ) );
	router.use( express.static( staticPath ) );
	router.use( cookieParser( config.cookieSecret ) );

	router.post( '/api/*', express.json() );

	// unauthenticated endpoints
	router.get( '/api/users', wrapApi( api.users.getAll ) );
	router.get( '/api/usersFor/:year', wrapApi( api.users.getYear ) );
	router.get( '/api/years', wrapApi( api.years.getAll ) );
	router.post( '/api/login', wrapApi( api.auth.login ) );
	router.post( '/api/logout', wrapApi( api.auth.logout ) );

	// authenticated endpoints
	router.use( '/api/user/*', authCheck );
	router.get( '/api/user/me', wrapApi( api.users.getCurrent ) );
	router.post( '/api/user/name', wrapApi( api.users.editName ) );
	router.post( '/api/user/password', wrapApi( api.users.changePassword ) );

	router.use( '/api/items/*', authCheck );
	router.get( '/api/items/', wrapApi( api.items.getAll ) );
	router.get( '/api/items/:year', wrapApi( api.items.getAllByYear ) );
	router.post( '/api/items', wrapApi( api.items.addItem ) );

	router.use( '/api/comments/*', authCheck );
	router.post( '/api/comments', wrapApi( api.comments.addComment ) );

	// admin endpoints
	router.use( '/api/admin/*', authAndAdminCheck );
	router.post( '/api/admin/user/add', wrapApi( api.admin.addUser ) );
	router.post( '/api/admin/user/remove', wrapApi( api.admin.removeUser ) );
	router.post( '/api/admin/user/reset', wrapApi( api.admin.resetPassword ) );
	router.post( '/api/admin/user/edit', wrapApi( api.admin.editName ) );
	router.post( '/api/admin/user/years', wrapApi( api.admin.updateYears ) );

	router.listen( 3000, () => { logger.info( 'API ready on port 3000' ); } );
}

main().then( ( _ ) => { logger.info( 'Startup finished' ); } ).catch( ( err ) => { logger.error( err ); } );
