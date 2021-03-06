import { createLogger, format, transports } from 'winston';

export const logger = createLogger( {
	format: format.combine(
		format.colorize(),
		format.timestamp(),
		format.align(),
		format.splat(),
		format.printf( ( info ) => `${ info.timestamp } ${ info.level }: ${ info.message }` ),
	),
	transports: [ new transports.Console() ],
} );
