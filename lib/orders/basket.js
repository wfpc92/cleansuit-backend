function basket() {
  'use strict';

  return {
    restrict: 'E',
    scope: {
      orden: '='
    },
    controller: ['$scope', function($scope) {
      // TODO scope.editable not for finished nor cancelled
      $scope.orden['orden.abono'] = parseFloat($scope.orden['orden.abono'] ? $scope.orden['orden.abono'].toFixed(0) : 0);
      $scope.orden['orden.totales.domicilio'] = parseFloat($scope.orden['orden.totales.domicilio'] ? $scope.orden['orden.totales.domicilio'].toFixed(0) : 0);
      $scope.orden['orden.totales.impuestos'] = parseFloat($scope.orden['orden.totales.impuestos'] ? $scope.orden['orden.totales.impuestos'].toFixed(0) : 0);
      $scope.$watch('orden', function(orden) {
        orden['orden.totales.subtotal'] = 0
        var i;
        if (['nueva', 'rutaRecoleccion', 'cancelada'].indexOf(orden.estado) != -1) {
          for (i in orden.items) {
            if (orden.items.hasOwnProperty(i)) {
              // filter empty lines
              if (orden.items[i].cantidad == 0) {
                delete orden.items[i];
                continue;
              }
              // calcula subtotal
              orden['orden.totales.subtotal'] += parseFloat((orden.items[i].precio * orden.items[i].cantidad).toFixed(0));
            }
          }
        } else {
          if (orden.entrega.items.productos) {
            for (i in orden.entrega.items.productos) {
              if (orden.entrega.items.productos.hasOwnProperty(i)) {
                // filter empty lines
                if (orden.entrega.items.productos[i].cantidad == 0) {
                  delete orden.entrega.items.productos[i];
                  continue;
                }
                // calcula subtotal
                orden['orden.totales.subtotal'] += parseFloat((orden.entrega.items.productos[i].precio * orden.entrega.items.productos[i].cantidad).toFixed(0));
              }
            }
          }
          if (orden.entrega.items.prendas) {
            for (i in orden.entrega.items.prendas) {
              if (orden.entrega.items.prendas.hasOwnProperty(i)) {
                // calcula subtotal
                orden['orden.totales.subtotal'] += parseFloat((orden.entrega.items.prendas[i].subservicio.precio).toFixed(0));
              }
            }
          }
        }
        orden['orden.totales.impuestos'] = 0.19 * (orden['orden.totales.subtotal'] + orden['orden.totales.domicilio']);
        let total = orden['orden.totales.subtotal'] + orden['orden.totales.domicilio'] + orden['orden.totales.impuestos'] - orden['orden.abono'];
        orden['orden.totales.total'] = parseFloat(total.toFixed(0));
      }, true);
    }],
    template: `
<table class="grid table table-condensed table-hover img-thumbnail items">
<thead>
<tr ng-if="['nueva', 'rutaRecoleccion', 'cancelada'].indexOf(orden.estado) == -1 && orden.entrega.items.productos" class="active">
    <th colspan="5">PRODUCTOS</th>
</tr>
<tr ng-if="['nueva', 'rutaRecoleccion', 'cancelada'].indexOf(orden.estado) != -1 || orden.entrega.items.productos" class="info">
    <th class="col-md-2"></th>
    <th class="col-md-4">Nombre</th>
    <th class="col-md-2">Precio</th>
    <th class="col-md-2">Cantidad</th>
    <th class="col-md-2 ng-admin-type-amount">Total</th>
</tr>
</thead>
<tbody>
<tr ng-if="['nueva', 'rutaRecoleccion', 'cancelada'].indexOf(orden.estado) != -1" ng-repeat="item in orden.items">
    <td class="ng-admin-type-img">
      <img ng-if="item.url_imagen" src="{{ item.url_imagen }}" class="poster_mini_thumbnail" />
    </td>
    <td>{{ item.nombre }}</td>
    <td class="ng-admin-type-amount">
        <div class="input-group"><span class="input-group-addon ng-binding">$</span><input class="form-control input-sm" type="number" min="0" step="any" ng-model="item.precio"/></div>
    </td>
    <td><input class="form-control input-sm" type="number" min="0" ng-model="item.cantidad"/></td>
    <td class="ng-admin-type-amount">\${{ item.precio * item.cantidad | number: 0 }}</td>
</tr>
<tr ng-if="['nueva', 'rutaRecoleccion', 'cancelada'].indexOf(orden.estado) == -1" ng-repeat="item in orden.entrega.items.productos">
    <td class="ng-admin-type-img">
      <img ng-if="item.url_imagen" src="{{ item.url_imagen }}" class="poster_mini_thumbnail" />
    </td>
    <td>{{ item.nombre }}</td>
    <td class="ng-admin-type-amount">
        <div class="input-group"><span class="input-group-addon ng-binding">$</span><input class="form-control input-sm" type="number" min="0" step="any" ng-model="item.precio"/></div>
    </td>
    <td><input class="form-control input-sm" type="number" min="0" ng-model="item.cantidad"/></td>
    <td class="ng-admin-type-amount">\${{ item.precio * item.cantidad | number: 0 }}</td>
</tr>
<tr ng-if="['nueva', 'rutaRecoleccion', 'cancelada'].indexOf(orden.estado) == -1 && orden.entrega.items.prendas" class="active">
    <th colspan="5">PRENDAS</th>
</tr>
<tr ng-if="['nueva', 'rutaRecoleccion', 'cancelada'].indexOf(orden.estado) == -1 && orden.entrega.items.prendas" class="info">
    <th class="col-md-2"></th>
    <th class="col-md-4">Servicio</th>
    <th class="col-md-2">Código</th>
    <th class="col-md-2">Estado</th>
    <th class="col-md-2 ng-admin-type-amount">Precio</th>
</tr>
<tr ng-if="['nueva', 'rutaRecoleccion', 'cancelada'].indexOf(orden.estado) == -1" ng-repeat="item in orden.entrega.items.prendas">
    <td class="ng-admin-type-img">
      <span ng-if="item.fotos" ng-repeat="foto in item.fotos">
        <zoom-in-modal thumbnail="http://api.cleansuit.co/updates/{{ foto.nombre }}" image="http://api.cleansuit.co/updates/{{ foto.nombre }}"></zoom-in-modal>
      </span>
    </td>
    <td><small>{{ item.servicio.nombre }}</small><br />{{ item.subservicio.nombre }}</td>
    <td>{{ item.codigo }}</td>
    <td><span ng-if="item.estado">{{ item.estado }}</span></td>
    <td class="ng-admin-type-amount">
        <div class="input-group"><span class="input-group-addon ng-binding">$</span><input class="form-control input-sm" type="number" min="0" step="any" ng-model="item.subservicio.precio"/></div>
    </td>
</tr>
<tr class="active">
    <td colspan="3"></td>
    <td><strong>Subtotal</strong></td>
    <td class="ng-admin-type-amount">\${{ orden['orden.totales.subtotal'] | number: 0 }}</td>
</tr>
<tr>
    <td colspan="3"></td>
    <td>Domicilio</td>
    <td class="ng-admin-type-amount"><div class="input-group"><span class="input-group-addon ng-binding">$</span><input class="form-control delivery_fees input-sm" type="number" min="0" step="any" ng-model="orden['orden.totales.domicilio']"/></div></td>
</tr>
<tr>
    <td colspan="3"></td>
    <td>Impuestos</td>
    <td class="ng-admin-type-number">\${{ orden['orden.totales.impuestos'] | number: 0 }}</td>
</tr>
<tr>
    <td colspan="3"></td>
    <td class="text-success">Abono</td>
    <td class="ng-admin-type-number text-success">\${{ orden['orden.abono'] | number: 0 }}</td>
</tr>
<tr>
    <td colspan="3"></td>
    <td><strong>Total</strong></td>
    <td class="ng-admin-type-amount"><strong>\${{ orden['orden.totales.total'] | number: 0 }}</strong></td>
</tr>
</tbody>
</table>
`
// <zoom-in-modal thumbnail="{{ entry.values.thumbnail }}" image="{{ entry.values.image }}"></zoom-in-modal>
  };
}

export default basket;
