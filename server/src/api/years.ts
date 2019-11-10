import * as express from 'express';

import { Year } from '../models/year';
import { objsToApiJSON } from '../models/to-api';

export const yearsApi = {
	async getAll( _: express.Request, res: express.Response ) {
		const years = await Year.query().eager( 'users' );

		res.send( objsToApiJSON( years ) );
	},
};
