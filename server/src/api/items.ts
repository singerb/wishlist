import * as express from 'express';

import { logger } from '../logger';
import { getUser } from '../auth';
import config from '../config';

import { Item } from '../models/item';
import { User } from '../models/user';
import { objsToApiJSON } from '../models/to-api';

export const itemsApi = {
	async getAll( req: express.Request, res: express.Response ) {
		const userId = await getUser( req );
		const user = await User.query().findById( userId );

		if ( ! user ) {
			logger.error( 'no user with id ' + userId + ' found' );
			res.clearCookie( config.cookieName, config.cookieOptions );
			res.sendStatus( 401 );

			return;
		}

		// show all my items that are visible to me, plus everyone else's items
		// eagerly get comments on items where I'm not the owner
		const myItems = await Item.query()
			.where( 'owner_id', '=', userId )
			.andWhere( 'visible_to_owner', '=', true )
			.andWhere( 'year', '=', user.year_viewing )
			.eager( '[owner, creator, links]' );
		const otherItems = await Item.query()
			.where( 'owner_id', '!=', userId )
			.andWhere( 'year', '=', user.year_viewing )
			.eager( '[owner, creator, links, comments.[creator]]' );

		const items = myItems.concat( otherItems );

		res.send( objsToApiJSON( items ) );
	},

	async addItem( req: express.Request, res: express.Response ) {
		const userId = await getUser( req );
		const user = await User.query().findById( userId );

		if ( ! user ) {
			logger.error( 'no user with id ' + userId + ' found' );
			res.clearCookie( config.cookieName, config.cookieOptions );
			res.sendStatus( 401 );

			return;
		}

		// logger.info( 'add item with %o', req.body );
		const itemText = req.body.text;
		const ownerId = req.body.ownerId;
		const visible_to_owner = ownerId === userId ? true : req.body.visible_to_owner;
		const links = req.body.links;

		if ( ! itemText || itemText === '' ) {
			res.status( 400 ).send( { ok: false, error: 'Item text cannot be empty' } );

			return;
		}

		await Item.query().insertGraph(
			{
				text: itemText,
				creator_id: userId,
				owner_id: ownerId,
				visible_to_owner: visible_to_owner,
				links: links,
				year: user.year_viewing,
			},
		);

		res.send( { ok: true } );
	},
};
