import moment from 'moment';
import dashboardSummaryTemplate from './dashboardSummary.html';

var now = moment();
var firstDay = moment([now.year(), now.month(), 1, 0, 0, 0]).toDate();

function dashboardSummary(Restangular) {
    'use strict';

    return {
        restrict: 'E',
        scope: {},
        controller: ['$scope', function($scope) {
            $scope.stats = {
              date: firstDay
            };
            Restangular
                .all('ordenes')
                .getList({_filters: {'fecha__gte': firstDay.toString()}, _sortField: 'fecha', _sortDir: "ASC"})
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
            Restangular
                .all('usuarios')
                .getList({limit: 100, _sortField: 'createdAt', _sortDir: 'DESC', _filters: {'createdAt__gte':firstDay.toString(), 'rol':'cliente'}})
                .then(customers => {
                    $scope.stats.clientes = customers.data.reduce(nb => ++nb, 0)
                });
        }],
        template: dashboardSummaryTemplate
    };
}

dashboardSummary.$inject = ['Restangular'];

module.exports = dashboardSummary;
