
module.exports = function(nga, admin) {

  const tipos = [
    { label: 'Compra', value: 'compra' },
    { label: 'Venta', value: 'venta' },
    { label: 'Ajuste Manual', value: 'ajuste' },
  ];

  var produmove = admin.getEntity('produmoves');
  produmove.identifier(nga.field('_id'));

  produmove.listView()
    .title('Movimientos de Inventario')
    .description('Detalles de cantidades entrando/saliendo para cada producto.')
    .fields([
      nga.field('createdAt', 'datetime').isDetailLink(true)
        .label('Fecha')
        .format('dd MMM /yy - hh:mm a'),
      nga.field('producto_id', 'reference')
        .label('Producto')
        .targetEntity(admin.getEntity('productos'))
        .targetField(nga.field('nombre')),
      nga.field('tipo', 'choice')
        .label('Tipo')
        .choices(tipos),
      nga.field('ref')
        .label('Referencia'),
      nga.field('cantidad', 'number')
        .label('Cantidad'),
    ])
    .actions([
      'back',
      'create',
      'filter'
    ])
    .filters([
      nga.field('producto_id', 'reference')
        .label('del Producto')
        .targetEntity(admin.getEntity('productos'))
        .targetField(nga.field('nombre'))
        .pinned(true),
      nga.field('tipo', 'choice')
        .label('Tipo')
        .choices(tipos)
        .pinned(true),
    //   nga.field('q')
    //     .label('')
    //     .pinned(true)
    //     .template('<div class="input-group"><input type="text" ng-model="value" placeholder="Buscar" class="form-control"></input><span class="input-group-addon"><i class="glyphicon glyphicon-search"></i></span></div>'),
    ])
    .batchActions([]);

  produmove.creationView()
    .title('Registrar un Movimiento')
    .fields([
      nga.field('producto_id', 'reference')
        .label('Producto')
        .targetEntity(admin.getEntity('productos'))
        .targetField(nga.field('nombre'))
        .remoteComplete(true)
        .validation({ required: true }),
      nga.field('tipo', 'choice')
        .label('Tipo')
        .choices(tipos)
        .cssClasses('col-sm-6 col-lg-5')
        .validation({ required: true }),
      nga.field('cantidad', 'number')
        .label('Cantidad')
        .cssClasses('col-sm-4 col-lg-2')
        .validation({ required: true }),
      nga.field('ref')
        .label('Referencia'),
    ])
    .actions([
      'back',
      'list'
    ]);

  produmove.editionView()
    .title('Editar un Movimiento')
    .fields([
      nga.field('producto_id', 'reference')
        .label('Producto')
        .targetEntity(admin.getEntity('productos'))
        .targetField(nga.field('nombre'))
        .remoteComplete(true)
        .validation({ required: true })
        .editable(false),
      nga.field('tipo', 'choice')
        .label('Tipo')
        .choices(tipos)
        .cssClasses('col-sm-6 col-lg-5')
        .validation({ required: true })
        .editable(false),
      nga.field('cantidad', 'number')
        .label('Cantidad')
        .cssClasses('col-sm-4 col-lg-2')
        .validation({ required: true })
        .editable(false),
      nga.field('ref')
        .label('Referencia'),
    ])
    .actions([
      'back',
      'list',
      'delete'
    ]);

  return produmove;
}
