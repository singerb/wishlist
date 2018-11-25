import { Model } from 'objection';

// import { User, UserApiObject } from './user';
import { ToApiObject } from './to-api';

export interface LinkApiObject {
	readonly id?: number;
	url?: string;
}

export class Link extends Model implements ToApiObject<LinkApiObject> {
	public readonly id?: number;
	public url?: string;

	public toApiObject() {
		return {
			id: this.id,
			url: this.url,
		};
	}

	public static tableName = 'links';
}
