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
        .format('0'),
      nga.field('precio', 'amount'),
    ])
    .actions([
      // 'filter'
    ])
    // .filters([
    //   nga.field('q')
    //     .label('')
    //     .pinned(true)
    //     .template('<div class="input-group"><input type="text" ng-model="value" placeholder="Buscar" class="form-control"></input><span class="input-group-addon"><i class="glyphicon glyphicon-search"></i></span></div>'),
    // ])
    ;

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
        .format('0')
        .editable(false),
      nga.field('moves', 'referenced_list')
        .label('Movimientos')
        .targetEntity(admin.getEntity('produmoves'))
        .targetReferenceField('product_id')
        .targetFields([
          nga.field('createdAt', 'datetime')
            .label('Fecha')
            .format('dd MMM yy hh:mm a'),
          nga.field('tipo', 'choice')
            .label('Tipo')
            .choices([
              { label: 'Compra', value: 'compra' },
              { label: 'Ajuste Manual', value: 'ajuste' },
              { label: 'Venta', value: 'venta' },
            ]),
          nga.field('cantidad', 'number')
            .label('Cantidad'),
          nga.field('ref')
            .label('Referencia'),
        ])
        .sortField('createdAt')
        .sortDir('DESC')
        .listActions(['edit'])
    ]);

  product.editionView()
    .title('Editar un Producto')
    .fields([
      product.creationView().fields()
    ]);

  return product;
}
