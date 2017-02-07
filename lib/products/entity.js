
module.exports = function(nga, admin) {

  var product = admin.getEntity('productos');
  product.identifier(nga.field('_id'));

  product.listView()
    .title('Servicios')
    .fields([
      nga.field('nombre').isDetailLink(true),
      nga.field('precio'),
    ])
    .filters([
      nga.field('q')
      .label('')
      .pinned(true)
      .template('<div class="input-group"><input type="text" ng-model="value" placeholder="Buscar" class="form-control"></input><span class="input-group-addon"><i class="glyphicon glyphicon-search"></i></span></div>'),
    ]);

  product.creationView()
    .title('Crear un Producto')
    .fields([
      nga.field('nombre'),
      nga.field('precio'),
      nga.field('desc_corta'),
      nga.field('desc_larga'),
    ]);

  product.editionView()
    .title('Editar un Producto')
    .fields([
      nga.field('nombre'),
      nga.field('precio'),
      nga.field('desc_corta'),
      nga.field('desc_larga'),
    ]);

  return product;
}
