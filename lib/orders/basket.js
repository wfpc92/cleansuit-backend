function basket() {
  'use strict';

  return {
    restrict: 'E',
    scope: {
      orden: '='
    },
    controller: ['$scope', '$filter', function($scope, $filter) {
      $scope.editable = ['entregada', 'cancelada'].indexOf($scope.orden.estado) == -1;
      $scope.orden['orden.abono'] = parseFloat($scope.orden['orden.abono'] ? $scope.orden['orden.abono'].toFixed(0) : 0);
      $scope.orden['orden.totales.domicilio'] = parseFloat($scope.orden['orden.totales.domicilio'] ? $scope.orden['orden.totales.domicilio'].toFixed(0) : 0);
      $scope.orden['orden.totales.impuestos'] = parseFloat($scope.orden['orden.totales.impuestos'] ? $scope.orden['orden.totales.impuestos'].toFixed(0) : 0);
      $scope.tracking = []
      if ($scope.editable) {
        $scope.$watch('orden', function(orden) {
          orden['orden.totales.subtotal'] = 0
          var i;
          if (['nueva', 'rutaRecoleccion', 'cancelada'].indexOf(orden.estado) != -1) {
            for (i in orden.items) {
              if (orden.items.hasOwnProperty(i)) {
                // filter empty lines
                if (orden.items[i].cantidad === 0) {
                  delete orden.items[i];
                  continue;
                }
                // calcula subtotal
                orden['orden.totales.subtotal'] += parseFloat((orden.items[i].precio * orden.items[i].cantidad).toFixed(0));
              }
            }
          } else {
            if (orden.recoleccion.items.productos) {
              for (i in orden.recoleccion.items.productos) {
                if (orden.recoleccion.items.productos.hasOwnProperty(i)) {
                  // filter empty lines
                  if (orden.recoleccion.items.productos[i].cantidad === 0) {
                    delete orden.recoleccion.items.productos[i];
                    continue;
                  }
                  // calcula subtotal
                  orden['orden.totales.subtotal'] += parseFloat((orden.recoleccion.items.productos[i].precio * orden.recoleccion.items.productos[i].cantidad).toFixed(0));
                }
              }
            }
            if (orden.recoleccion.items.prendas) {
              var html, item;
              for (i in orden.recoleccion.items.prendas) {
                if (orden.recoleccion.items.prendas.hasOwnProperty(i)) {
                  // crea el html de estados
                  html = '<dl>';
                  for (var j in orden.recoleccion.items.prendas[i].novedades) {
                    item = orden.recoleccion.items.prendas[i].novedades[j];
                    html += `<dt>${ $filter('date')(item.fecha, 'dd MMM yy hh:mm a') }</dt>`
                    html += `<dd>${ item.proceso.nombre }</dd>`
                    if (item.observaciones) {
                      html += `<dd><em>${ item.observaciones }</em></dd>`
                    }
                  }
                  html += '</dl>';
                  $scope.tracking.push(html);
                  // calcula subtotal
                  orden['orden.totales.subtotal'] += parseFloat((orden.recoleccion.items.prendas[i].subservicio.precio).toFixed(0));
                }
              }
            }
          }
          // 19% IVA = 16% of total
          orden['orden.totales.impuestos'] = 0.16 * (orden['orden.totales.subtotal'] + orden['orden.totales.domicilio']);
          let total = orden['orden.totales.subtotal'] + orden['orden.totales.domicilio'] - orden['orden.abono'];
          orden['orden.totales.total'] = parseFloat(total.toFixed(0));
        }, true);
      }
    }],
    template: `
<table class="grid table table-condensed table-hover img-thumbnail items">
<thead>
<tr ng-if="['nueva', 'rutaRecoleccion', 'cancelada'].indexOf(orden.estado) == -1 && orden.recoleccion.items.productos" class="active">
    <th colspan="5">PRODUCTOS</th>
</tr>
<tr ng-if="['nueva', 'rutaRecoleccion', 'cancelada'].indexOf(orden.estado) != -1 || orden.recoleccion.items.productos" class="info">
    <th class="col-md-2"></th>
    <th class="col-md-4">Nombre</th>
    <th class="col-md-2 ng-admin-type-amount">Precio</th>
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
      <div ng-if="editable" class="input-group"><span class="input-group-addon ng-binding">$</span><input class="form-control input-sm" type="number" min="0" step="any" ng-model="item.precio"/></div>
      <span ng-if="!editable">{{ item.precio | numeraljs:'$0,0.' }}</span>
    </td>
    <td>
      <input ng-if="editable" class="form-control input-sm" type="number" min="0" ng-model="item.cantidad"/>
      <span ng-if="!editable">{{ item.cantidad }}</span>
    </td>
    <td class="ng-admin-type-amount">{{ item.precio * item.cantidad | numeraljs:'$0,0.' }}</td>
</tr>
<tr ng-if="['nueva', 'rutaRecoleccion', 'cancelada'].indexOf(orden.estado) == -1" ng-repeat="item in orden.recoleccion.items.productos">
    <td class="ng-admin-type-img">
      <img ng-if="item.url_imagen" src="{{ item.url_imagen }}" class="poster_mini_thumbnail" />
    </td>
    <td>{{ item.nombre }}</td>
    <td class="ng-admin-type-amount">
      <div ng-if="editable" class="input-group"><span class="input-group-addon ng-binding">$</span><input class="form-control input-sm" type="number" min="0" step="any" ng-model="item.precio"/></div>
      <span ng-if="!editable">{{ item.precio | numeraljs:'$0,0.' }}</span>
    </td>
    <td>
      <input ng-if="editable" class="form-control input-sm" type="number" min="0" ng-model="item.cantidad"/>
      <span ng-if="!editable">{{ item.cantidad }}</span>
    </td>
    <td class="ng-admin-type-amount">{{ item.precio * item.cantidad | numeraljs:'$0,0.' }}</td>
</tr>
<tr ng-if="['nueva', 'rutaRecoleccion', 'cancelada'].indexOf(orden.estado) == -1 && orden.recoleccion.items.prendas" class="active">
    <th colspan="5">PRENDAS</th>
</tr>
<tr ng-if="['nueva', 'rutaRecoleccion', 'cancelada'].indexOf(orden.estado) == -1 && orden.recoleccion.items.prendas" class="info">
    <th class="col-md-2"></th>
    <th class="col-md-4">Servicio</th>
    <th class="col-md-2">Código</th>
    <th class="col-md-2">Estado</th>
    <th class="col-md-2 ng-admin-type-amount">Precio</th>
</tr>
<tr ng-if="['nueva', 'rutaRecoleccion', 'cancelada'].indexOf(orden.estado) == -1" ng-repeat="item in orden.recoleccion.items.prendas">
    <td class="ng-admin-type-img">
      <span ng-if="item.fotos" ng-repeat="foto in item.fotos">
        <zoom-in-modal thumbnail="http://api.cleansuit.co/updates/{{ foto.nombre }}" image="http://api.cleansuit.co/updates/{{ foto.nombre }}"></zoom-in-modal>
      </span>
    </td>
    <td><small>{{ item.servicio.nombre }}</small><br />{{ item.subservicio.nombre }}</td>
    <td>{{ item.codigo }}</td>
    <td><button ng-if="item.novedades" uib-popover-html="tracking[$index]" class="btn btn-default" type="button">Tracking</button></td>
    <td class="ng-admin-type-amount">
      <div ng-if="editable" class="input-group"><span class="input-group-addon ng-binding">$</span><input class="form-control input-sm" type="number" min="0" step="any" ng-model="item.subservicio.precio"/></div>
      <span ng-if="!editable">{{ item.subservicio.precio | numeraljs:'$0,0.' }}</span>
    </td>
</tr>
<tr class="active">
    <td colspan="3"></td>
    <td><strong>Subtotal</strong></td>
    <td class="ng-admin-type-amount">{{ orden['orden.totales.subtotal'] | numeraljs:'$0,0.' }}</td>
</tr>
<tr>
    <td colspan="3"></td>
    <td>Domicilio</td>
    <td class="ng-admin-type-amount">
      <div ng-if="editable" class="input-group"><span class="input-group-addon ng-binding">$</span><input class="form-control delivery_fees input-sm" type="number" min="0" step="any" ng-model="orden['orden.totales.domicilio']"/></div>
      <span ng-if="!editable">{{ orden['orden.totales.domicilio'] | numeraljs:'$0,0.' }}</span>
    </td>
</tr>
<tr>
    <td colspan="3"></td>
    <td>Impuestos</td>
    <td class="ng-admin-type-number">{{ orden['orden.totales.impuestos'] | numeraljs:'$0,0.' }}</td>
</tr>
<tr>
    <td colspan="3"></td>
    <td class="text-success">Abono</td>
    <td class="ng-admin-type-number text-success">{{ orden['orden.abono'] | numeraljs:'$0,0.' }}</td>
</tr>
<tr>
    <td colspan="3"></td>
    <td><strong>Total</strong></td>
    <td class="ng-admin-type-amount"><strong>{{ orden['orden.totales.total'] | numeraljs:'$0,0.' }}</strong></td>
</tr>
</tbody>
</table>
`
  };
}

export default basket;
