export interface ToApiObject<T> {
	toApiObject(): T;
}

export function objToApiJSON<T>( obj: ToApiObject<T> ) {
	return JSON.stringify( obj.toApiObject() );
}

export function objsToApiJSON<T>( objs: Array<ToApiObject<T>> ) {
	return JSON.stringify( objs.map( ( obj ) => obj.toApiObject() ) );
}
