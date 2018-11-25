import * as express from 'express';
import * as bcrypt from 'bcrypt';
import { generate } from 'randomstring';

// import { logger } from '../logger';
// import config from '../config';
import { getUser } from '../auth';

import { User } from '../models/user';
import { logger } from '../logger';

export const adminApi = {
	async editName( req: express.Request, res: express.Response ) {
		const newName = req.body.newName;
		const userId = req.body.userId;

		if ( ! newName || newName === '' ) {
			res.status( 400 ).send( { ok: false, error: 'New name cannot be empty' } );

			return;
		}

		await User.query().update( { name: newName } ).where( 'id', '=', userId );

		res.send( { ok: true } );
	},

	async resetPassword( req: express.Request, res: express.Response ) {
		const userId = req.body.userId;
		const newPassword = generate( { length: 16, readable: true } );

		await User.query().update( { password: bcrypt.hashSync( newPassword, 10 ) } ).where( 'id', '=', userId );

		res.send( { ok: true, result: newPassword } );
	},

	async addUser( req: express.Request, res: express.Response ) {
		const newUserName = req.body.newUserName;
		const newPassword = generate( { length: 16, readable: true } );
		const is_admin = req.body.is_admin;
		const year_viewing = '2018'; // TODO: make this not hard-coded

		if ( ! newUserName || newUserName === '' ) {
			res.status( 400 ).send( { ok: false, error: 'New name cannot be empty' } );

			return;
		}

		const newUser = { name: newUserName, is_admin, year_viewing, password: bcrypt.hashSync( newPassword, 10 ) };
		logger.info( 'inserting user %o', newUser );
		await User.query().insert( newUser );
		logger.info( 'users now %o', await User.query() );

		res.send( { ok: true, result: newPassword } );
	},

	async removeUser( req: express.Request, res: express.Response ) {
		const userId = req.body.userId;
		const callingUserId = await getUser( req );

		if ( userId === callingUserId ) {
			res.status( 400 ).send( { ok: false, error: 'Cannot remove your own user' } );

			return;
		}

		// TODO: should cascade but needs testing
		await User.query().delete().where( 'id', '=', userId );

		res.send( { ok: true } );
	},

};
