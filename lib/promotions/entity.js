module.exports = function(nga, admin) {

  var promos = admin.getEntity('promociones');
  promos.identifier(nga.field('_id'));

  promos.listView()
    .title('Promociones')
    .fields([
      nga.field('url_imagen', 'template')
        .label('')
        .template('<zoom-in-modal thumbnail="{{ entry.values.url_imagen }}" image="{{ entry.values.url_imagen }}"></zoom-in-modal>'),
      nga.field('codigo').isDetailLink(true),
      nga.field('fecha_inicio', 'date'),
      nga.field('fecha_fin', 'date'),
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
      nga.field('codigo')
        .validation({ required: true })
        .cssClasses('col-sm-8 col-md-6 col-lg-4'),
      nga.field('fecha_inicio', 'date')
        .label('Inicio')
        .validation({ required: true }),
      nga.field('fecha_fin', 'date')
        .label('Fin')
        .validation({ required: true }),
      nga.field('descripcion', 'text'),
      nga.field('url_imagen', 'file')
        .label('Imagen')
        .uploadInformation({
          'url': '/upload/promos',
          'apifilename': 'uploaded_url'
        }),
      nga.field('productos', 'embedded_list')
        .label('Producto en Descuento')
        .targetFields([
          nga.field('producto', 'reference')
            .label('Producto')
            .targetEntity(nga.entity('productos'))
            .targetField(nga.field('nombre'))
            .remoteComplete(true),
          nga.field('descuento', 'number')
            .format('0\%')
        ]),
      nga.field('servicios', 'embedded_list')
        .label('Servicio en Descuento')
        .targetFields([
          nga.field('servicio', 'reference')
            .label('Servicio')
            .targetEntity(nga.entity('subservicios'))
            .targetField(nga.field('nombre'))
            .remoteComplete(true),
          nga.field('descuento', 'number')
            .format('0\%')
        ]),
    ]);

  promos.editionView()
    .title('Editar una Promoción')
    .fields([
      promos.creationView().fields()
    ]);

  return promos;
}
