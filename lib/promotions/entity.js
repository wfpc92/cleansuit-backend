
module.exports = function(nga, admin) {

  var promos = admin.getEntity('promociones');
  promos.identifier(nga.field('_id'));

  promos.listView()
    .title('Promociones')
    .fields([
      nga.field('codigo').isDetailLink(true),
      nga.field('descuento'),
    ])
    .filters([
      nga.field('q')
      .label('')
      .pinned(true)
      .template('<div class="input-group"><input type="text" ng-model="value" placeholder="Buscar" class="form-control"></input><span class="input-group-addon"><i class="glyphicon glyphicon-search"></i></span></div>'),
    ]);

  promos.creationView()
    .title('Crear una Promoción')
    .fields([
      nga.field('codigo'),
      nga.field('descuento'),
      nga.field('descripcion'),
      nga.field('url_imagen'),
    ]);

  promos.editionView()
    .title('Editar una Promoción')
    .fields([
      nga.field('codigo'),
      nga.field('descuento'),
      nga.field('descripcion'),
      nga.field('url_imagen'),
    ]);

  return promos;
}
