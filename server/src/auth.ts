import * as jsonwebtoken from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import * as express from 'express';

import config from './config';
import { User } from './models/user';

function signToken( payload: object ) {
	return new Promise( ( resolve, reject ) => {
		jsonwebtoken.sign( payload, config.tokenSecret, { expiresIn: '2 days' }, ( err, token ) => {
			if ( err ) {
				return reject( err );
			}

			return resolve( token );
		} );
	} );
}

function verifyTokenAndGetPayload( token: string ): Promise<any> {
	return new Promise( ( resolve, reject ) => {
		jsonwebtoken.verify( token, config.tokenSecret, ( err, payload ) => {
			if ( err ) {
				return reject( err );
			}

			return resolve( payload );
		} );
	} );
}

export async function authCheck( req: express.Request, res: express.Response, next: express.NextFunction ) {
	const cookie: string | undefined = req.signedCookies[ config.cookieName ];

	if ( ! cookie ) {
		res.sendStatus( 401 );

		return;
	}

	try {
		await verifyTokenAndGetPayload( cookie );
	} catch ( err ) {
		res.clearCookie( config.cookieName, config.cookieOptions );
		res.sendStatus( 401 );

		return;
	}

	next();
}

export async function authAndAdminCheck( req: express.Request, res: express.Response, next: express.NextFunction ) {
	const cookie: string | undefined = req.signedCookies[ config.cookieName ];

	if ( ! cookie ) {
		res.sendStatus( 401 );

		return;
	}

	try {
		const payload = await verifyTokenAndGetPayload( cookie );

		const user = await User.query().findById( payload.id );

		if ( ! user || ! user.is_admin ) {
			res.clearCookie( config.cookieName, config.cookieOptions );
			res.sendStatus( 401 );

			return;
		}
	} catch ( err ) {
		res.clearCookie( config.cookieName, config.cookieOptions );
		res.sendStatus( 401 );

		return;
	}

	next();
}

export async function checkPasswordAndGetToken( userId: number, password: string ) {
	const user = await User.query().findById( userId );
	if ( ! user ) {
		throw new Error( 'no such user' );
	}

	if ( ! user.password ) {
		throw new Error( 'somehow no password set' );
	}

	const check = await bcrypt.compare( password, user.password );

	if ( ! check ) {
		throw new Error( 'bad password' );
	}

	const token = await signToken( { id: user.id! } );

	return token;
}

export async function getUser( req: express.Request ) {
	const cookie: string | undefined = req.signedCookies[ config.cookieName ];

	if ( ! cookie ) {
		throw new Error( 'not logged in, got past auth check?' );
	}

	const payload = await verifyTokenAndGetPayload( cookie );

	return payload.id;
}
