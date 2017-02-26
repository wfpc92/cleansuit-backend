module.exports = function(nga, admin) {

  var promos = admin.getEntity('promociones');
  promos.identifier(nga.field('_id'));

  promos.listView()
    .title('Promociones')
    .fields([
      nga.field('url_imagen', 'template')
      .label('')
      .template('<img src="{{ entry.values.url_imagen }}" class="poster_mini_thumbnail" />'),
      nga.field('codigo').isDetailLink(true),
      nga.field('descuento'),
      nga.field('descripcion')
      .map(function truncate(value) {
        if (!value) {
          return '';
        }
        return value.length > 50 ? value.substr(0, 50) + '...' : value;
      }),
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
      nga.field('descuento')
      .cssClasses('col-sm-4 col-md-3 col-lg-1'),
      nga.field('descripcion', 'text'),
      nga.field('url_imagen', 'file')
      .label('Imagen')
      .uploadInformation({
        'url': '/upload/promos',
        'apifilename': 'uploaded_url'
      }),
    ]);

  promos.editionView()
    .title('Editar una Promoción')
    .fields([
      nga.field('codigo'),
      nga.field('descuento'),
      nga.field('descripcion', 'text'),
      nga.field('url_imagen', 'file')
      .label('Imagen')
      .uploadInformation({
        'url': '/upload/promos',
        'apifilename': 'uploaded_url'
      }),
    ]);

  return promos;
}
