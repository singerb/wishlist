import * as express from 'express';
import * as bcrypt from 'bcrypt';

import { logger } from '../logger';
import { getUser, checkPasswordAndGetToken } from '../auth';
import config from '../config';

import { User } from '../models/user';
import { objToApiJSON, objsToApiJSON } from '../models/to-api';

export const usersApi = {
	async getAll( _: express.Request, res: express.Response ) {
		const users = await User.query();

		res.send( objsToApiJSON( users ) );
	},

	async getCurrent( req: express.Request, res: express.Response ) {
		try {
			const userId = await getUser( req );

			const user = await User.query().findById( userId );

			if ( ! user ) {
				logger.error( 'no user with id ' + userId + ' found' );
				res.clearCookie( config.cookieName, config.cookieOptions );
				res.sendStatus( 401 );

				return;
			}

			res.send( objToApiJSON( user ) );
		} catch ( err ) {
			logger.error( 'Error getting current user: %o', err );
			res.clearCookie( config.cookieName, config.cookieOptions );
			res.sendStatus( 401 );
		}
	},

	async editName( req: express.Request, res: express.Response ) {
		const userId = await getUser( req );
		const user = await User.query().findById( userId );

		if ( ! user ) {
			logger.error( 'no user with id ' + userId + ' found' );
			res.clearCookie( config.cookieName, config.cookieOptions );
			res.sendStatus( 401 );

			return;
		}

		const newName = req.body.newName;

		if ( ! newName || newName === '' ) {
			res.status( 400 ).send( { ok: false, error: 'New name cannot be empty' } );

			return;
		}

		await User.query().update( { name: newName } ).where( 'id', '=', userId );

		res.send( { ok: true } );
	},

	async changePassword( req: express.Request, res: express.Response ) {
		const userId = await getUser( req );
		const user = await User.query().findById( userId );

		if ( ! user ) {
			logger.error( 'no user with id ' + userId + ' found' );
			res.clearCookie( config.cookieName, config.cookieOptions );
			res.sendStatus( 401 );

			return;
		}

		const oldPassword = req.body.oldPassword;
		const newPasswordOne = req.body.newPasswordOne;
		const newPasswordTwo = req.body.newPasswordTwo;

		if ( ! oldPassword || oldPassword === '' ) {
			res.status( 400 ).send( { ok: false, error: 'Old password cannot be empty' } );

			return;
		}

		if ( ! newPasswordOne || ! newPasswordTwo || newPasswordOne === '' || newPasswordTwo === '' ) {
			res.status( 400 ).send( { ok: false, error: 'New password cannot be empty' } );

			return;
		}

		if ( newPasswordOne !== newPasswordTwo ) {
			res.status( 400 ).send( { ok: false, error: 'New passwords must match' } );

			return;
		}

		try {
			await checkPasswordAndGetToken( userId, oldPassword );
		} catch ( err ) {
			res.status( 400 ).send( JSON.stringify( { ok: false, error: 'Old password incorrect' } ) );

			return;
		}

		await User.query().update( { password: bcrypt.hashSync( newPasswordOne, 10 ) } ).where( 'id', '=', userId );

		res.send( { ok: true } );
	},
};
