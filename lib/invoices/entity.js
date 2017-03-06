module.exports = function(nga, admin) {

  var invoice = admin.getEntity('facturas');
  invoice.identifier(nga.field('_id'));

  invoice.listView()
    .title('Facturas')
    .fields([
      nga.field('orden_id', 'reference')
        .label('Orden')
        .targetEntity(admin.getEntity('ordenes'))
        .targetField(nga.field('codigo')),
      nga.field('updatedAt', 'datetime')
        .label('Fecha')
        .format('dd MMM yy hh:mm a'),
    ])
    .listActions([
      '<inv-download size="xs" invoice="entry"></inv-download>',
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

  return invoice;
}
