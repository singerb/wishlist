import { Model } from 'objection';

import { ToApiObject } from './to-api';

export interface UserApiObject {
	readonly id?: number;
	name?: string;
	is_admin?: boolean;
	year_viewing?: string;
}

export class User extends Model implements ToApiObject<UserApiObject> {
	public readonly id?: number;
	public name?: string;
	public password?: string;
	public is_admin?: boolean;
	public year_viewing?: string;

	public static tableName = 'users';

	public toApiObject() {
		return {
			id: this.id,
			name: this.name,
			is_admin: this.is_admin,
			year_viewing: this.year_viewing,
		};
	}

}
