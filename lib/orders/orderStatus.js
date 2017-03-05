function orderStatus(Restangular, $state, notification, $uibModal) {
  'use strict';

  return {
    restrict: 'E',
    scope: {
      orden: "&",
      size: "@",
    },
    link: function(scope, element, attrs) {
      scope.orden = scope.orden();
      scope.url_factura = `${scope.orden.values.getRequestedUrl()}/${scope.orden.values._id}/invoice`;
      scope.type = attrs.type;
      scope.status = function(status) {
        var updateOrder = function(status) {
          Restangular
            .one('ordenes', scope.orden.values._id).get()
            .then(orden => {
              orden.data.estado = status;
              return orden.data.customPUT(orden.data, scope.orden.values._id);
            })
            .then(() => $state.reload())
            .then(() => notification.log('Orden actualizada!', {
              addnCls: 'humane-flatty-info'
            }))
            .catch(e => notification.log('Ocurrió un problema, por favor intente de nuevo', {
              addnCls: 'humane-flatty-error'
            }) && console.error(e))
        }

        // validate status changes
        var modalInstance;
        switch (status) {

          case 'rutaRecoleccion':
            if (scope.orden.values.domiciliario_recoleccion_id) {
              updateOrder(status)
            } else {
              return notification.log('Asigne un Domiciliario de Recolección para poder Confirmarla.', {
                addnCls: 'humane-flatty-error'
              })
            }
            break;

          case 'rutaEntrega':
            if (scope.orden.values.domiciliario_entrega_id) {
              updateOrder(status)
            } else {
              return notification.log('Asigne un Domiciliario de Entrega para poder Facturarla.', {
                addnCls: 'humane-flatty-error'
              })
            }
            break;

          case 'cancelada':
            modalInstance = $uibModal.open({
              animation: true,
              template: `
                <div class="modal-header">
                  <h3 class="modal-title" id="modal-title">Confirmación</h3>
                </div>
                <div class="modal-body" id="modal-body">
                  {{ msg }}
                </div>
                <div class="modal-footer">
                  <button class="btn btn-danger" type="button" ng-click="ok()">Si</button>
                  <button class="btn btn-default" type="button" ng-click="cancel()">No</button>
                </div>
              `,
              controller: ['$scope', '$uibModalInstance', 'msg', function ($scope, $uibModalInstance, msg) {
                $scope.msg = msg;

                $scope.ok = function () {
                  $uibModalInstance.close('ok');
                };

                $scope.cancel = function () {
                  $uibModalInstance.dismiss('cancel');
                };
              }],
              resolve: {
                msg: function() {
                  return 'Realmente quiere cancelar esta orden?'
                }
              },
            });
            modalInstance.result.then(function() {
              updateOrder(status)
            }, function() {});
            break;

          default:
            updateOrder(status)
        }
      }
    },
    template: `
<a ng-if="orden.values.estado == 'nueva'" class="btn btn-success" ng-class="size ? \'btn-outline btn-\' + size : \'btn-default\'" ng-click="status('rutaRecoleccion')">
    <span class="fa fa-check" aria-hidden="true"></span>&nbsp;Confirmar
</a>
<a ng-if="['nueva', 'rutaRecoleccion'].indexOf(orden.values.estado) != -1" class="btn btn-danger" ng-class="size ? \'btn-outline btn-\' + size : \'btn-default\'" ng-click="status('cancelada')">
    <span class="fa fa-close" aria-hidden="true"></span>&nbsp;Cancelar
</a>
<a ng-if="orden.values.estado == 'recolectada'" class="btn btn-primary" ng-class="size ? \'btn-outline btn-\' + size : \'btn-default\'" ng-click="status('procesando')">
    <span class="fa fa-retweet" aria-hidden="true"></span>&nbsp;Procesar
</a>
<a ng-if="orden.values.estado == 'procesando'" class="btn btn-success" ng-class="size ? \'btn-outline btn-\' + size : \'btn-default\'" ng-click="status('rutaEntrega')">
    <span class="fa fa-calculator" aria-hidden="true"></span>&nbsp;Facturar y Entregar
</a>
<a ng-if="['rutaEntrega', 'entregada'].indexOf(orden.values.estado) != -1" class="btn" ng-class="size ? \'btn-outline btn-\' + size : \'btn-default\'" target="_self" ng-href="{{ url_factura }}">
    <span class="fa fa-file-pdf-o" aria-hidden="true"></span>&nbsp;Factura
</a>
`
  };
}

orderStatus.$inject = ['Restangular', '$state', 'notification', '$uibModal'];

export default orderStatus;
