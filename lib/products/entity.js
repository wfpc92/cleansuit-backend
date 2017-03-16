module.exports = function(nga, admin) {

  var product = admin.getEntity('productos');
  product.identifier(nga.field('_id'));

  product.listView()
    .title('Productos')
    .fields([
      nga.field('url_imagen', 'template')
      .label('')
      .template('<img src="{{ entry.values.url_imagen }}" width="15" />'),
      nga.field('nombre').isDetailLink(true),
      nga.field('desc_corta')
      .label('Descripción Corta'),
      nga.field('stock', 'number')
        .format('0.'),
      nga.field('precio', 'amount'),
    ])
    .actions([
      'back',
      'create',
      'filter'
    ])
    .filters([
      nga.field('nombre__regex')
        .label('Nombre'),
      nga.field('desc_corta__regex')
        .label('Descripción Corta'),
      nga.field('Descripción__regex')
        .label('Descripción Larga'),
    ])
    .batchActions([]);

  product.creationView()
    .title('Crear un Producto')
    .fields([
      nga.field('nombre'),
      nga.field('precio', 'amount'),
      nga.field('desc_corta', 'text')
        .label('Descripción Corta'),
      nga.field('desc_larga', 'text')
        .label('Descripción Larga'),
      nga.field('url_imagen', 'file')
        .label('Imagen')
        .uploadInformation({
          'url': '/upload/productos',
          'apifilename': 'uploaded_url'
        }),
      nga.field('stock', 'number')
        .format('0.')
        .defaultValue(0)
        .editable(false),
      nga.field('moves', 'referenced_list')
        .label('Movimientos')
        .targetEntity(admin.getEntity('produmoves'))
        .targetReferenceField('producto_id')
        .targetFields([
          nga.field('createdAt', 'datetime')
            .label('Fecha')
            .format('dd MMM /yy - hh:mm a'),
          nga.field('tipo', 'choice')
            .label('Tipo')
            .choices([
              { label: 'Compra', value: 'compra' },
              { label: 'Venta', value: 'venta' },
              { label: 'Ajuste Manual', value: 'ajuste' },
            ]),
          nga.field('ref')
            .label('Referencia'),
          nga.field('cantidad', 'number')
            .label('Cantidad'),
        ])
        .sortField('createdAt')
        .sortDir('DESC')
        .perPage(15)
        .listActions(['edit'])
    ])
    .actions([
      'back',
      'list'
    ]);

  product.editionView()
    .title('Editar un Producto')
    .fields([
      product.creationView().fields()
    ])
    .actions([
      'back',
      'list',
      'delete'
    ]);

  return product;
}
