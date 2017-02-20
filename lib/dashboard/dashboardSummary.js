import moment from 'moment';
import dashboardSummaryTemplate from './dashboardSummary.html';

var oneMonthAgo = moment().subtract(1, 'months').toDate();

function dashboardSummary(Restangular) {
    'use strict';

    return {
        restrict: 'E',
        scope: {},
        controller: ['$scope', function($scope) {
            $scope.stats = {};
            Restangular
                .all('ordenes')
                .getList({_filters: {'fecha__gte': oneMonthAgo.toISOString()}, _sortField: 'fecha', _sortDir: "ASC"})
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
                .getList({limit: 100, _sortField: 'createdAt', _sortDir: 'DESC', _filters: {'createdAt__gte':oneMonthAgo.toISOString(), 'rol':'cliente'}})
                .then(customers => {
                    $scope.stats.clientes = customers.data.reduce(nb => ++nb, 0)
                });
        }],
        template: dashboardSummaryTemplate
    };
}

dashboardSummary.$inject = ['Restangular'];

module.exports = dashboardSummary;
