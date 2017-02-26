module.exports = function(nga, admin) {

  var product = admin.getEntity('productos');
  product.identifier(nga.field('_id'));

  product.listView()
    .title('Servicios')
    .fields([
      nga.field('profile.foto_url', 'template')
      .label('')
      .template('<img src="{{ entry.values.foto_url }}" width="25" />'),
      nga.field('nombre').isDetailLink(true),
      nga.field('desc_corta')
      .map(function truncate(value) {
        if (!value) {
          return '';
        }
        return value.length > 50 ? value.substr(0, 50) + '...' : value;
      }),
      nga.field('precio', 'amount'),
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
      nga.field('desc_corta', 'text')
      .label('Descripción Corta'),
      nga.field('desc_larga', 'text')
      .label('Descripción Larga'),
      nga.field('foto_url', 'file')
      .label('Imagen')
      .uploadInformation({
        'url': '/upload/productos',
        'apifilename': 'uploaded_url'
      }),
    ]);

  product.editionView()
    .title('Editar un Producto')
    .fields([
      nga.field('nombre'),
      nga.field('precio'),
      nga.field('desc_corta', 'text')
      .label('Descripción Corta'),
      nga.field('desc_larga', 'text')
      .label('Descripción Larga'),
      nga.field('foto_url', 'file')
      .label('Imagen')
      .uploadInformation({
        'url': '/upload/productos',
        'apifilename': 'uploaded_url'
      }),
    ]);

  return product;
}
