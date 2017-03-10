const moment = require('moment');
moment.locale('es');

// PROD
const angular = require('angular')
const dashApp = angular.module('dashCleanSuit', [require('ng-admin')]);
// DEV
// const dashApp = angular.module('dashCleanSuit', ['ng-admin']);

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
        for (var p in params._filters) {
          if (params._filters.hasOwnProperty(p)) {
            params[p] = params._filters[p];
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

// custom stuff
dashApp.factory('userid', ['$http', '$q', function($http, $q) {
  var _identity;

  return {
    // this function returns the current _identity if defined; otherwise, it retrieves it from the HTTP endpoint
    identity: function(setIdentity) {
      if (setIdentity) {
        _identity = setIdentity;
        return;
      }

      var deferred = $q.defer();

      if (angular.isDefined(_identity)) {
        deferred.resolve(_identity);
        return deferred.promise;
      }

      $http.get('/session')
        .success(function(result) {
          _identity = result;
          deferred.resolve(_identity);
        })
        .error(function() {
          _identity = undefined;
          deferred.reject();
        });

      return deferred.promise;
    }
  };
}]);

dashApp.controller('username', ['$scope', 'userid', function($scope, userid) {
  userid.identity().then(function(identity) {
    $scope.user = identity;
  })
}]);

dashApp.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, msg) {
  $scope.msg = msg;

  $scope.ok = function () {
    $uibModalInstance.close('ok');
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});

dashApp.directive('dashboardSummary', require('./dashboard/dashboardSummary'));
dashApp.directive('basket', require('./orders/basket'));
dashApp.directive('orderStatus', require('./orders/orderStatus'));
dashApp.directive('zoomInModal', require('./orders/zoomInModal'));
dashApp.directive('invDownload', require('./invoices/invDownload'));

dashApp.filter('estado', function() {
  return function(input) {
    switch (input) {
      case 'nueva':
        return 'En Cola'
      case 'rutaRecoleccion':
        return 'En Recolección'
      case 'recolectada':
        return 'Recolectada'
      case 'procesando':
        return 'En Proceso'
      case 'rutaEntrega':
        return 'En Entrega'
      case 'entregada':
        return 'Finalizada'
      case 'cancelada':
        return 'Cancelada'
      default:
        return input;
    }
  }
});

// declare a function to run when the module bootstraps (during the 'config' phase)
dashApp.config(['NgAdminConfigurationProvider', function(nga) {
  // create an admin application
  var admin = nga.application('Panel | CleanSuit')
    .baseApiUrl('http://panel.cleansuit.co/rest/');
    // .baseApiUrl('http://localhost:31227/rest/');

  // add entities
  admin.addEntity(nga.entity('ordenes'));
  admin.addEntity(nga.entity('facturas'));
  admin.addEntity(nga.entity('promociones'));
  admin.addEntity(nga.entity('servicios'));
  admin.addEntity(nga.entity('subservicios'));
  admin.addEntity(nga.entity('productos'));
  admin.addEntity(nga.entity('produmoves'));
  admin.addEntity(nga.entity('usuarios'));
  admin.addEntity(nga.entity('settings'));

  // configure entities
  require('./orders/entity')(nga, admin);
  require('./invoices/entity')(nga, admin);
  require('./promotions/entity')(nga, admin);
  require('./services/entity')(nga, admin);
  require('./services/subentity')(nga, admin);
  require('./products/entity')(nga, admin);
  require('./products/moves')(nga, admin);
  require('./users/entity')(nga, admin);
  require('./settings/entity')(nga, admin);

  admin.dashboard(require('./dashboard/config')(nga, admin));
  admin.header(require('./header.html'));
  admin.menu(require('./menu')(nga, admin));

  // attach the admin application to the DOM and execute it
  nga.configure(admin);
}]);
