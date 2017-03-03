
module.exports = function(nga, admin) {

  const tipos = [
    { label: 'Compra', value: 'compra' },
    { label: 'Ajuste Manual', value: 'ajuste' },
    { label: 'Venta', value: 'venta' },
  ];

  var produmove = admin.getEntity('produmoves');
  produmove.identifier(nga.field('_id'));

  produmove.listView()
    .title('Movimientos de Inventario')
    .fields([
      nga.field('createdAt', 'datetime').isDetailLink(true)
        .label('Fecha')
        .format('dd MMM yy hh:mm a'),
      nga.field('producto_id', 'reference')
        .label('Producto')
        .targetEntity(nga.entity('productos'))
        .targetField(nga.field('nombre'))
        .isDetailLink(false),
      nga.field('tipo', 'choice')
        .label('Tipo')
        .choices(tipos),
      nga.field('cantidad', 'number')
        .label('Cantidad'),
      nga.field('ref')
        .label('Referencia'),
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

  produmove.creationView()
    .title('Registrar un Movimiento')
    .fields([
      nga.field('producto_id', 'reference')
        .label('Producto')
        .targetEntity(nga.entity('productos'))
        .targetField(nga.field('nombre'))
        .remoteComplete(true),
      nga.field('tipo', 'choice')
        .label('Tipo')
        .choices(tipos)
        .cssClasses('col-sm-6 col-lg-5')
        .editable(false),
      nga.field('cantidad', 'number')
        .label('Cantidad'),
      nga.field('ref')
        .label('Referencia'),
    ]);

  produmove.editionView()
    .title('Editar un Movimiento')
    .fields([
      produmove.creationView().fields()
    ]);

  return produmove;
}
