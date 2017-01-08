const autoIncrement = require('mongoose-auto-increment');
const chalk = require('chalk');

module.exports = (mongoose, next) => {
    mongoose.Promise = global.Promise;

    let dbs = [
        process.env.MONGOLOCAL_URI,
        process.env.MONGOSERVER_URI,
    ];

    var dbURI = dbs.pop();

    mongoose.connection.on('open', () => {
        process.env.MONGODB_URI = dbURI;
        console.log(`%s Conectado a: %s`, chalk.green('✓'), chalk.green(dbURI));
        return next();
    });

    mongoose.connection.on('error', (err) => {
        console.log(`%s No se pudo conectar a: %s`, chalk.red('✗'), chalk.red(dbURI));
        dbURI = dbs.pop();
    	if (!dbURI) {
    		throw err;
    	}
    	conectar(dbURI);
    });

    function conectar(dbURI) {
    	try {
    		mongoose.connect(dbURI);
    		autoIncrement.initialize(mongoose.connection);
    		console.log(`  Intentando conexión a MongoDB, esperando respuesta...`);
    	} catch(err) {
    		console.log(`  Falló al conectar a: ${dbURI}`, err.message);
    	}
    }

    conectar(dbURI);
};
