import moment from 'moment';

export function niceDate( dateStr: string ) {
	return moment( dateStr ).fromNow();
}

export function errorText( res: any ) {
	if ( res && res.response && res.response.data && res.response.data.error ) {
		return res.response.data.error;
	}

	return 'Unknown error';
}
