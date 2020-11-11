import * as express from 'express';

import { logger } from '../logger';
import { getUser } from '../auth';
import config from '../config';

import { Item } from '../models/item';
import { User } from '../models/user';
import { objsToApiJSON } from '../models/to-api';

async function handleGetAll( req: express.Request, res: express.Response, year: string ) {
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
		.andWhere( 'year', '=', year )
		.eager( '[owner, creator, links]' );
	const otherItems = await Item.query()
		.where( 'owner_id', '!=', userId )
		.andWhere( 'year', '=', year )
		.eager( '[owner, creator, links, comments.[creator]]' );

	const items = myItems.concat( otherItems );

	res.send( objsToApiJSON( items ) );
}

export const itemsApi = {
	async getAll( req: express.Request, res: express.Response ) {
		const year = new Date().getFullYear() + '';

		await handleGetAll( req, res, year );
	},

	async getAllByYear( req: express.Request, res: express.Response ) {
		const year = req.params.year ? req.params.year : ( new Date().getFullYear() + '' );

		await handleGetAll( req, res, year );
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
		const year = req.body.year || ( new Date().getFullYear() + '' );

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
				year: year,
			},
		);

		res.send( { ok: true } );
	},

	async duplicateItem( req: express.Request, res: express.Response ) {
		const userId = await getUser( req );
		const user = await User.query().findById( userId );

		if ( ! user ) {
			logger.error( 'no user with id ' + userId + ' found' );
			res.clearCookie( config.cookieName, config.cookieOptions );
			res.sendStatus( 401 );

			return;
		}

		// logger.info( 'add item with %o', req.body );
		const itemId = req.body.itemId;

		if ( ! itemId ) {
			res.status( 400 ).send( { ok: false, error: 'Item ID cannot be empty' } );

			return;
		}

		const item = await Item.query().findById( itemId ).eager( '[owner,creator,links]' );

		if ( ! item ) {
			res.status( 400 ).send( { ok: false, error: 'Item not found' } );

			return;
		}

		if ( item.creator_id !== userId ) {
			res.status( 400 ).send( { ok: false, error: 'Can only duplicate items you created' } );

			return;
		}

		const year = req.body.year || ( new Date().getFullYear() + '' );

		await Item.query().insertGraph(
			{
				text: item.text,
				creator_id: item.creator_id,
				owner_id: item.owner_id,
				visible_to_owner: item.visible_to_owner,
				links: ( item.links || [] ).map( ( link ) => ( { url: link.url } ) ) as any,
				year,
			},
		);

		res.send( { ok: true } );
	},

	async removeItem( req: express.Request, res: express.Response ) {
		const userId = await getUser( req );
		const user = await User.query().findById( userId );

		if ( ! user ) {
			logger.error( 'no user with id ' + userId + ' found' );
			res.clearCookie( config.cookieName, config.cookieOptions );
			res.sendStatus( 401 );

			return;
		}

		// logger.info( 'add item with %o', req.body );
		const itemId = req.body.itemId;

		if ( ! itemId ) {
			res.status( 400 ).send( { ok: false, error: 'Item ID cannot be empty' } );

			return;
		}

		const item = await Item.query().findById( itemId ).eager( '[owner,creator,links]' );

		if ( ! item ) {
			res.status( 400 ).send( { ok: false, error: 'Item not found' } );

			return;
		}

		if ( item.owner_id !== userId ) {
			res.status( 400 ).send( { ok: false, error: 'Can only remove items you own' } );

			return;
		}

		// TODO: should cascade but needs testing
		await Item.query().delete().where( 'id', '=', itemId );

		res.send( { ok: true } );
	},
};
