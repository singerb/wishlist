import { Model, RelationMappings } from 'objection';

import { User, UserApiObject } from './user';
import { ToApiObject } from './to-api';

export interface CommentApiObject {
	readonly id?: number;
	text?: string;
	created_at?: number;
	creator?: UserApiObject;
}

export class Comment extends Model implements ToApiObject<CommentApiObject> {
	public readonly id?: number;
	public text?: string;
	public created_at?: Date;
	public readonly item_id?: number;
	public readonly creator_id?: number;

	public creator?: User;

	public toApiObject() {
		return {
			id:         this.id,
			text:       this.text,
			created_at: this.created_at!.getTime(),
			creator:    this.creator!.toApiObject(),
		};
	}

	public static tableName = 'comments';

	public static relationMappings: RelationMappings = {
		creator: {
			relation: Model.BelongsToOneRelation,
			// This model defines the `modelPaths` property. Therefore we can simply use
			// the model module names in `modelClass`.
			modelClass: User,
			join: {
				from: 'users.id',
				to: 'comments.creator_id',
			},
		},
	};

	public $parseDatabaseJson( json: object ) {
		json = super.$parseDatabaseJson( json );
		toDate( json, 'created_at' );

		return json;
	}

	public $formatDatabaseJson( json: object ) {
		json = super.$formatDatabaseJson( json );
		toTime( json, 'created_at' );

		return json;
	}
}

function toDate( obj: any, fieldName: string ): any {
	if ( obj != null && ( typeof obj[ fieldName ] === 'number' || typeof obj[ fieldName ] === 'string' ) ) {
		obj[ fieldName ] = new Date( obj[ fieldName ] );
	}

	return obj;
}

function toTime( obj: any, fieldName: string ): any {
	if ( obj != null && obj[ fieldName ] != null && obj[ fieldName ].getTime ) {
		obj[ fieldName ] = obj[ fieldName ].getTime();
	}

	return obj;
}
