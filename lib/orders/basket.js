function basket(Restangular, $q) {
  'use strict';

  return {
    restrict: 'E',
    scope: {
      orden: '='
    },
    controller: ['$scope', function($scope) {
      $scope.items = {};

      if ($scope.orden.estado == 'nueva') {
        $scope.items = Object.values($scope.orden.items) || {};
      } else {
        $scope.items = Object.values($scope.orden.entrega.items) || {};
      }

      // $scope.$watch('orden', function(orden) {
      //   if (Object.keys($scope.items).length === 0) return;
      //   orden.basket = orden.basket.filter(item => item.quantity > 0);
      //   orden.total_ex_taxes = orden.basket.reduce((total, item) => {
      //     total += $scope.productsById[item.product_id].price * item.quantity
      //     return parseFloat(total.toFixed(2));
      //   }, 0);
      //   orden.taxes = orden.tax_rate * (orden.total_ex_taxes + orden.delivery_fees);
      //   let total = orden.total_ex_taxes + orden.delivery_fees + orden.taxes;
      //   orden.total = parseFloat(total.toFixed(2));
      // }, true);
    }],
    template: `
<table class="grid table table-condensed img-thumbnail items">
<thead>
<tr>
    <th class="col-md-1"></th>
    <th class="col-md-3">Nombre</th>
    <th class="col-md-2 ng-admin-type-amount">Precio</th>
    <th class="col-md-3">Cantidad</th>
    <th class="col-md-3 ng-admin-type-amount">Total</th>
</tr>
</thead>
<tbody>
<tr ng-repeat="item in items">
    <td><img src="{{ item.foto_url }}" class="poster_mini_thumbnail" /></td>
    <td><a ui-sref="edit({entity: 'productos', id: item._id })"> {{ item.nombre }}</a></td>
    <td class="ng-admin-type-amount">\${{ item.precio }}</td>
    <td><input class="form-control input-sm" type="number" min="0" ng-model="item.cantidad"/></td>
    <td class="ng-admin-type-amount">\${{ item.precio * item.cantidad | number: 0 }}</td>
</tr>
<tr>
    <td colspan="3"></td>
    <td>Subtotal</td>
    <td class="ng-admin-type-amount">\${{ orden.totales.subtotal }}</td>
</tr>
<tr>
    <td colspan="3"></td>
    <td>Domicilio</td>
    <td class="ng-admin-type-amount"><div class="input-group"><span class="input-group-addon ng-binding">$</span><input class="form-control delivery_fees input-sm" type="number" min="0" step="any" ng-model="orden.totales.domicilio"/></div></td>
</tr>
<tr>
    <td colspan="3"></td>
    <td>Impuestos</td>
    <td class="ng-admin-type-number">{{ orden.iva * 100}}%</td>
</tr>
<tr>
    <td colspan="3"></td>
    <td><strong>Total</strong></td>
    <td class="ng-admin-type-amount"><strong>\${{ orden.orden.totales.total }}</strong></td>
</tr>
</tbody>
</table>
`
  };
}

basket.$inject = ['Restangular', '$q'];

export default basket;
