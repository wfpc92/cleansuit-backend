import moment from 'moment';
import dashboardSummaryTemplate from './dashboardSummary.html';

var now = moment();
var firstDay = moment([now.year(), now.month(), 1, 0, 0, 0]).toDate();

function dashboardSummary(Restangular, $http) {
    'use strict';

    return {
        restrict: 'E',
        scope: {},
        controller: ['$scope', function($scope) {
            $scope.stats = {
              date: firstDay,
              pending: 0,
              customers: {
                total: 0,
                recent: 0
              },
              ordenes: {}
            };
            Restangular
                .all('ordenes')
                .getList({_filters: {'fecha__gte': firstDay.toISOString()}, _sortField: 'fecha', _sortDir: "ASC"})
                .then(commands => {
                    $scope.stats.ordenes = commands.data
                        .reduce((stats, command) => {
                            if (command.estado == 'entregada') {
                              if (command.orden.totales) {
                                stats.revenue += parseInt(command.orden.totales.total, 0);
                              }
                              stats.finalized_orders++;
                            }
                            if (command.estado == 'nueva') stats.pending_orders++;
                            return stats;
                        }, { revenue: 0, pending_orders: 0, finalized_orders: 0 })
                });

            $http({
              url: Restangular.configuration.baseUrl + '/ordenes/count',
              method: 'GET',
              params: {
                estado: 'nueva'
              }
            }).then(
              response => {
                $scope.stats.pending = response.data.count
              },
              () => {}
            );

            $http({
              url: Restangular.configuration.baseUrl + '/usuarios/count',
              method: 'GET',
              params: {
                rol: 'cliente'
              }
            }).then(
              response => {
                $scope.stats.customers.total = response.data.count
              },
              () => {}
            );

            $http({
              url: Restangular.configuration.baseUrl + '/usuarios/count',
              method: 'GET',
              params: {
                rol: 'cliente',
                createdAt__gte: firstDay.toISOString()
              }
            }).then(
              response => {
                $scope.stats.customers.recent = response.data.count
              },
              () => {}
            );
        }],
        template: dashboardSummaryTemplate
    };
}

dashboardSummary.$inject = ['Restangular', '$http'];

module.exports = dashboardSummary;
