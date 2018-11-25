import { env } from 'process';

export enum Env { DEVELOPMENT, PRODUCTION }

export default function getEnv() {
	if ( env.NODE_ENV ) {
		switch ( env.NODE_ENV ) {
			case 'production':
				return Env.PRODUCTION;
				break;

			case 'development':
			default:
				return Env.DEVELOPMENT;
				break;
		}
	} else {
		return Env.DEVELOPMENT;
	}
}
