import getEnv, { Env } from './env';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

interface Config {
	tokenSecret: string;
	cookieName: string;
	cookieOptions: {
		domain: string;
		expires: boolean | Date | undefined;
		httpOnly: boolean;
		secure: boolean;
		signed: boolean;
	};
	cookieSecret: string;
	sendRawDates: boolean;
}

let configFile = join( __dirname, '../../config.json' );
const productionConfigFile = join( __dirname, '../../production/config.json' );

if ( getEnv() === Env.PRODUCTION && existsSync( productionConfigFile ) ) {
	configFile = productionConfigFile;
}

console.log( 'Loading config from ' + configFile );

const config: Config = JSON.parse( readFileSync( configFile, 'utf8' ) );

export default config;
