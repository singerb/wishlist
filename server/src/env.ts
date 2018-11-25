import 'process';

export enum Env { DEVELOPMENT, PRODUCTION }

export default function getEnv() {
	if ( process.env.NODE_ENV ) {
		switch ( process.env.NODE_ENV ) {
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
