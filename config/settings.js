module.exports = {
	development: {
		ip: '127.0.0.1',
		port: 8080,
		db: {
			host: 'www.padcombo.com',
			port: 3306,
			protocol: 'mysql',
			user: 'root',
			password: '29142029',
			database: 'ecom',
			connectionLimit: 100
		}
	},
	production: {
		ip: '127.0.0.1',
		port: 8000,
		db: {
			host: 'localhost',
			port: 3306,
			protocol: 'mysql',
			user: 'root',
			password: '29142029',
			database: 'ecom',
			connectionLimit: 100
		}
	}
};
