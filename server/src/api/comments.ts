import * as express from 'express';

import { logger } from '../logger';
import { getUser } from '../auth';
import config from '../config';

import { Comment } from '../models/comment';
import { User } from '../models/user';
import { Item } from '../models/item';

export const commentsApi = {
	async addComment( req: express.Request, res: express.Response ) {
		const userId = await getUser( req );
		const user = await User.query().findById( userId );

		if ( ! user ) {
			logger.error( 'no user with id ' + userId + ' found' );
			res.clearCookie( config.cookieName, config.cookieOptions );
			res.sendStatus( 401 );

			return;
		}

		const commentText = req.body.text;
		const itemId = req.body.itemId;
		const claimed = req.body.claimed;

		await Comment.query().insert( { text: commentText, item_id: itemId, creator_id: userId, created_at: new Date() } );
		if ( claimed ) {
			await Item.query().patch( { claimed: true } ).where( 'id', '=', itemId );
		}

		res.send( { ok: true } );
	},
};
