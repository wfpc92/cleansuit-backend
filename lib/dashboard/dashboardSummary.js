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
                .getList({filter: '{"fecha__gte":"' + oneMonthAgo.toISOString() +'"}', sort: '["fecha","DESC"]'})
                .then(commands => {
                    $scope.stats.ordenes = commands.data
                        .reduce((stats, command) => {
                            if (command.estado == 'entregada') {
                              stats.revenue += parseInt(command.total, 0);
                              stats.finalized_orders++;
                            }
                            if (command.estado == 'nueva') stats.pending_orders++;
                            return stats;
                        }, { revenue: 0, pending_orders: 0, finalized_orders: 0 })
                });
            Restangular
                .all('usuarios')
                .getList({range: '[1,100]', sort: '["createdAt","DESC"]', filter: '{"createdAt__gte":"' +oneMonthAgo.toISOString() + '", "rol":"cliente"}'})
                .then(customers => {
                    $scope.stats.clientes = customers.data.reduce(nb => ++nb, 0)
                });
        }],
        template: dashboardSummaryTemplate
    };
}

dashboardSummary.$inject = ['Restangular'];

module.exports = dashboardSummary;
