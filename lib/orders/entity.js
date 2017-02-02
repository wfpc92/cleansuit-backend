
module.exports = function(nga, admin) {

  var order = admin.getEntity('ordenes');
  order.identifier(nga.field('_id'));

  order.listView()
    .title('Órdenes')
    .fields([
      nga.field('codigo').label('Código').isDetailLink(true),
      nga.field('fecha'),
      nga.field('estado'),
    ])
    .filters([
      nga.field('q')
      .label('')
      .pinned(true)
      .template('<div class="input-group"><input type="text" ng-model="value" placeholder="Buscar" class="form-control"></input><span class="input-group-addon"><i class="glyphicon glyphicon-search"></i></span></div>'),
    ]);

  order.creationView()
    .title('Crear una Orden')
    .fields([
      nga.field('codigo'),
      nga.field('fecha')
    ]);

  order.editionView()
    .title('Editar una Orden')
    .fields([
      nga.field('codigo'),
      nga.field('fecha')
    ]);

  return order;
}
