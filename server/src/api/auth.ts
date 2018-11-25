import * as express from 'express';

import { logger } from '../logger';
import { checkPasswordAndGetToken } from '../auth';
import config from '../config';

export const authApi = {
	async login( req: express.Request, res: express.Response ) {
		const userId = req.body.id;
		const password = req.body.password;

		if ( ! userId || ! password ) {
			logger.error( 'Missing user id or password for login' );
			res.status( 400 ).send( JSON.stringify( { ok: false, error: 'User id and password must be supplied' } ) );

			return;
		}

		try {
			const token = await checkPasswordAndGetToken( userId, password );

			logger.info( 'User id ' + userId + ' logged in successfully' );

			res.cookie( config.cookieName, token, config.cookieOptions );
			res.send( JSON.stringify( { ok: true } ) );

			return;
		} catch ( err ) {
			logger.error( 'Login for ' + userId + ' failed: %o', err );
			res.status( 400 ).send( JSON.stringify( { ok: false, error: 'Login failed' } ) );

			return;
		}
	},

	async logout( _: express.Request, res: express.Response ) {
		res.clearCookie( config.cookieName, config.cookieOptions );
		res.send( JSON.stringify( { ok: true } ) );
	},
};
