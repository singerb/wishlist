// Update with your config settings.

module.exports = {
	development: {
		client: 'sqlite3',
		connection: {
			filename: ':memory:'
		},
		migrations: {
			tableName: 'knex_migrations',
			directory: __dirname + '/migrations'
		},
		seeds: {
			directory: __dirname + '/seeds'
		}
	},
};
