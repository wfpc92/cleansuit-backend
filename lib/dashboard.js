const angular = require('angular');

const dashApp = angular.module('dashCleanSuit', [
  require('ng-admin'),
]);

// dashboard translation
dashApp.config(['$translateProvider', function($translateProvider) {
  $translateProvider.translations('es', require('./translation'));
  $translateProvider.preferredLanguage('es');
}]);

// declare a function to run when the module bootstraps (during the 'config' phase)
dashApp.config(['NgAdminConfigurationProvider', function(nga) {
  // create an admin application
  var admin = nga.application('Panel | CleanSuit')
    .baseApiUrl('http://localhost:3000/rest/');

  // add entities
  admin.addEntity(nga.entity('ordenes'));
  admin.addEntity(nga.entity('servicios'));
  admin.addEntity(nga.entity('productos'));
  admin.addEntity(nga.entity('usuarios'));

  // configure entities
  require('./orders/entity')(nga, admin);
  require('./services/entity')(nga, admin);
  require('./products/entity')(nga, admin);
  require('./users/entity')(nga, admin);

  admin.menu(require('./menu')(nga, admin));

  // attach the admin application to the DOM and execute it
  nga.configure(admin);
}]);
