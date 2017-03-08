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
      nga.field('cliente_id', 'reference')
        .label('Cliente')
        .targetEntity(admin.getEntity('usuarios'))
        .targetField(nga.field('nombre'))
        .isDetailLink(false),
      nga.field('updatedAt', 'datetime')
        .label('Fecha')
        .format('dd MMM yy hh:mm a'),
    ])
    .listActions([
      '<inv-download size="xs" invoice="entry"></inv-download>',
    ])
    .actions([
      'export',
      'filter'
    ])
    .filters([
      nga.field('cliente_id', 'reference')
        .label('Cliente')
        .targetEntity(admin.getEntity('usuarios'))
        .targetField(nga.field('nombre'))
        .permanentFilters({
          rol: 'cliente'
        }),
    ])
    ;

  return invoice;
}
