import { Model, RelationMappings } from 'objection';

import { ToApiObject } from './to-api';
import { User, UserApiObject } from './user';

export interface YearApiObject {
	year?: string;
	info?: string;
	users?: UserApiObject[];
}

export class Year extends Model implements ToApiObject<YearApiObject> {
	public year?: string;
	public info?: string;

	public users?: User[];

	public static tableName = 'years';

	public toApiObject() {
		return {
			year: this.year,
			info: this.info,
			users: this.users ? this.users.map( ( user ) => user.toApiObject() ) : [],
		};
	}

	public static relationMappings: RelationMappings = {
		users: {
			relation: Model.ManyToManyRelation,
			modelClass: User,
			join: {
				from: 'years.year',
				through: {
					from: 'years_to_users.year',
					to: 'years_to_users.user_id',
				},
				to: 'users.id',
			},
		},
	};
}
