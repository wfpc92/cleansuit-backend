const autoIncrement = require('mongoose-auto-increment');
const chalk = require('chalk');

module.exports = (mongoose, next) => {
    mongoose.Promise = global.Promise;

    let dbs = [
        process.env.MONGOLOCAL_URI,
        process.env.MONGOSERVER_URI,
    ];

    var dbURI = dbs.pop();

    function conectar(dbURI) {
      try {
        console.log(`  Intentando conexión a MongoDB, esperando respuesta...`);
        mongoose.connect(dbURI)
          .then(() => {
            autoIncrement.initialize(mongoose.connection);
            process.env.MONGODB_URI = dbURI;
            console.log(`%s Conectado a: %s`, chalk.green('✓'), chalk.green(dbURI));
            return next();
          })
          .catch((err) => {
            console.log(`%s No se pudo conectar a: %s`, chalk.red('✗'), chalk.red(dbURI));
            dbURI = dbs.pop();
            if (!dbURI) {
              throw err;
            }
            conectar(dbURI);
          });
      } catch(err) {
        console.log(`  Falló al conectar a: ${dbURI}`, err.message);
      }
    }

    conectar(dbURI);
};
