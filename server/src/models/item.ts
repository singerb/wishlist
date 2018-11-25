import { Model, RelationMappings } from 'objection';

import { User, UserApiObject } from './user';
import { Link, LinkApiObject } from './link';
import { Comment, CommentApiObject } from './comment';
import { ToApiObject } from './to-api';

export interface ItemApiObject {
	readonly id?: number;
	text?: string;
	year?: string;
	visible_to_owner?: boolean;
	claimed?: boolean;

	owner?: UserApiObject;
	creator?: UserApiObject;

	links?: LinkApiObject[];
	comments?: CommentApiObject[];
}

export class Item extends Model implements ToApiObject<ItemApiObject> {
	public readonly id?: number;
	public text?: string;
	public year?: string;
	public visible_to_owner?: boolean;
	public claimed?: boolean;
	public readonly owner_id?: number;
	public readonly creator_id?: number;

	public owner?: User;
	public creator?: User;

	public links?: Link[];
	public comments?: Comment[];

	public toApiObject() {
		return {
			id:               this.id,
			text:             this.text,
			year:             this.year,
			visible_to_owner: this.visible_to_owner,
			claimed:          this.claimed,
			owner:            this.owner ? this.owner.toApiObject() : undefined,
			creator:          this.creator ? this.creator.toApiObject() : undefined,
			links:            this.links ? this.links.map( ( link ) => link.toApiObject() ) : [],
			comments:         this.comments ? this.comments.map( ( comment ) => comment.toApiObject() ) : [],
		};
	}

	public static tableName = 'items';

	// Where to look for models classes.
	// public static modelPaths = [ __dirname ];

	// This object defines the relations to other models. The modelClass strings
	// will be joined to `modelPaths` to find the class definition, to avoid
	// require loops. The other solution to avoid require loops is to make
	// relationMappings a thunk. See Movie.ts for an example.
	public static relationMappings: RelationMappings = {
		owner: {
			relation: Model.BelongsToOneRelation,
			// This model defines the `modelPaths` property. Therefore we can simply use
			// the model module names in `modelClass`.
			modelClass: User,
			join: {
				from: 'users.id',
				to: 'items.owner_id',
			},
		},
		creator: {
			relation: Model.BelongsToOneRelation,
			// This model defines the `modelPaths` property. Therefore we can simply use
			// the model module names in `modelClass`.
			modelClass: User,
			join: {
				from: 'users.id',
				to: 'items.creator_id',
			},
		},
		links: {
			relation: Model.HasManyRelation,
			// This model defines the `modelPaths` property. Therefore we can simply use
			// the model module names in `modelClass`.
			modelClass: Link,
			join: {
				from: 'links.item_id',
				to: 'items.id',
			},
		},
		comments: {
			relation: Model.HasManyRelation,
			// This model defines the `modelPaths` property. Therefore we can simply use
			// the model module names in `modelClass`.
			modelClass: Comment,
			join: {
				from: 'comments.item_id',
				to: 'items.id',
			},
		},
	};
}
