import { Model, RelationMappings } from 'objection';

import { ToApiObject } from './to-api';

export interface UserApiObject {
	readonly id?: number;
	name?: string;
	is_admin?: boolean;
	years?: any[]; // TODO: same type issue
}

export class User extends Model implements ToApiObject<UserApiObject> {
	public readonly id?: number;
	public name?: string;
	public password?: string;
	public is_admin?: boolean;

	public years?: any[]; // TODO: do this better; gotta avoid the require loop though

	public static tableName = 'users';

	public toApiObject() {
		return {
			id: this.id,
			name: this.name,
			is_admin: this.is_admin,
			years: this.years ? this.years.map( ( year ) => year.toApiObject() ) : [],
		};
	}

	public static relationMappings = (): RelationMappings => {
		const { Year } = require( './year' );

		return {
			years: {
				relation: Model.ManyToManyRelation,
				modelClass: Year,
				join: {
					from: 'users.id',
					through: {
						// persons_movies is the join table.
						from: 'years_to_users.user_id',
						to: 'years_to_users.year',
					},
					to: 'years.year',
				},
			},
		};
	}
}
