const dashApp = angular.module('dashCleanSuit', ['ng-admin']);

// dashboard translation
dashApp.config(['$translateProvider', function($translateProvider) {
  $translateProvider.translations('es', require('./translation'));
  $translateProvider.preferredLanguage('es');
}]);

dashApp.config(['RestangularProvider', function(RestangularProvider) {
  RestangularProvider.addFullRequestInterceptor(function(element, operation, what, url, headers, params, httpConfig) {
    if (operation == 'getList') {
      if (params._sortField != 'id') {
        params.sort = params._sortField;
        if (params._sortDir == 'DESC') {
          params.sort = '-' + params.sort;
        }
      }
      delete params._sortField;
      delete params._sortDir;
      params.skip = (params._page - 1) * params._perPage;
      params.limit = params._perPage;
      delete params._page;
      delete params._perPage;
      if (params._filters) {
        for (var param in params._filters) {
          if (params._filters.hasOwnProperty(param)) {
            params[param] = params._filters[param];
          }
        }
        delete params._filters;
      }
    }
    return {
      params: params
    };
  });
}]);

// custom 'amount' type
dashApp.config(['NgAdminConfigurationProvider', 'FieldViewConfigurationProvider', function(nga, fvp) {
  nga.registerFieldType('amount', require('./types/AmountField'));
  fvp.registerFieldView('amount', require('./types/AmountFieldView'));
}]);

// custom directives
dashApp.directive('dashboardSummary', require('./dashboard/dashboardSummary'));
dashApp.directive('basket', require('./orders/basket'));

// declare a function to run when the module bootstraps (during the 'config' phase)
dashApp.config(['NgAdminConfigurationProvider', function(nga) {
  // create an admin application
  var admin = nga.application('Panel | CleanSuit')
    .baseApiUrl('http://panel.cleansuit.co/rest/');

  // add entities
  admin.addEntity(nga.entity('ordenes'));
  admin.addEntity(nga.entity('promociones'));
  admin.addEntity(nga.entity('servicios'));
  admin.addEntity(nga.entity('subservicios'));
  admin.addEntity(nga.entity('productos'));
  admin.addEntity(nga.entity('usuarios'));

  // configure entities
  require('./orders/entity')(nga, admin);
  require('./promotions/entity')(nga, admin);
  require('./services/entity')(nga, admin);
  require('./services/subentity')(nga, admin);
  require('./products/entity')(nga, admin);
  require('./users/entity')(nga, admin);

  admin.dashboard(require('./dashboard/config')(nga, admin));
  admin.header(require('./header.html'));
  admin.menu(require('./menu')(nga, admin));

  // attach the admin application to the DOM and execute it
  nga.configure(admin);
}]);
