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
                .getList({filter: '{"fecha_gte":"' + oneMonthAgo.toISOString() +'"}', sort: '["fecha","DESC"]'})
                .then(commands => {
                    $scope.stats.ordenes = commands.data
                        .reduce((stats, command) => {
                            if (command.estado == 'finalizada') stats.revenue += command.total;
                            if (command.estado == 'finalizada') stats.finalized_orders++;
                            if (command.estado == 'nueva') stats.pending_orders++;
                            return stats;
                        }, { revenue: 0, pending_orders: 0, finalized_orders: 0 })
                });
            Restangular
                .all('usuarios')
                .getList({range: '[1,100]', sort: '["createdAt","DESC"]', filter: '{"createdAt_gte":"' +oneMonthAgo.toISOString() + '"}'})
                .then(customers => {
                    $scope.stats.usuarios = customers.data.reduce(nb => ++nb, 0)
                });
        }],
        template: dashboardSummaryTemplate
    };
}

dashboardSummary.$inject = ['Restangular'];

module.exports = dashboardSummary;
