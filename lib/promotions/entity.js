module.exports = function(nga, admin) {

  var promos = admin.getEntity('promociones');
  promos.identifier(nga.field('_id'));

  promos.listView()
    .title('Promociones')
    .fields([
      nga.field('url_imagen', 'template')
        .label('')
        .template('<zoom-in-modal thumbnail="{{ entry.values.url_imagen }}" image="{{ entry.values.url_imagen }}"></zoom-in-modal>'),
      nga.field('codigo')
        .label('Código')
        .isDetailLink(true),
      nga.field('fecha_inicio', 'datetime')
        .format('dd MMM /yy'),
      nga.field('fecha_fin', 'datetime')
        .format('dd MMM /yy'),
    ])
    .actions([
      'back',
      'create',
      'filter'
    ])
    .filters([
      nga.field('codigo')
        .label('Código'),
      nga.field('descripcion__regex')
        .label('Descripción'),
    ])
    .batchActions([]);

  promos.creationView()
    .title('Crear una Promoción')
    .fields([
      nga.field('codigo')
        .validation({ required: true })
        .cssClasses('col-sm-8 col-md-6 col-lg-4'),
      nga.field('fecha_inicio', 'date')
        .label('Inicio')
        // .validation({ required: true })
        .format('dd MMM /yy'),
      nga.field('fecha_fin', 'date')
        .label('Fin')
        // .validation({ required: true })d
        .format('dd MMM /yy'),
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
            .targetEntity(admin.getEntity('productos'))
            .targetField(nga.field('nombre'))
            .singleApiCall(ids => ({'_id': ids }))
            .remoteComplete(true),
          nga.field('descuento', 'number')
            .format('0\%')
        ]),
      nga.field('servicios', 'embedded_list')
        .label('Servicio en Descuento')
        .targetFields([
          nga.field('servicio', 'reference')
            .label('Servicio')
            .targetEntity(admin.getEntity('subservicios'))
            .targetField(nga.field('nombre'))
            .singleApiCall(ids => ({'_id': ids }))
            .remoteComplete(true),
          nga.field('descuento', 'number')
            .format('0\%')
        ]),
    ])
    .actions([
      'back',
      'list'
    ]);

  promos.editionView()
    .title('Editar una Promoción')
    .fields([
      promos.creationView().fields()
    ])
    .actions([
      'back',
      'list',
      'delete'
    ]);

  return promos;
}
