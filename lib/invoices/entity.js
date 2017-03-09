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
      nga.field('total', 'amount')
        .label('Total')
    ])
    .listActions([
      '<inv-download size="xs" invoice="entry"></inv-download>',
    ])
    .actions([
      'export',
      'filter'
    ])
    .filters([
      nga.field('orden_id', 'reference')
        .label('Orden')
        .targetEntity(admin.getEntity('ordenes'))
        .targetField(nga.field('codigo')),
      nga.field('cliente_id', 'reference')
        .label('Cliente')
        .targetEntity(admin.getEntity('usuarios'))
        .targetField(nga.field('nombre'))
        .permanentFilters({
          rol: 'cliente'
        }),
      nga.field('domiciliario_recoleccion_id', 'reference')
        .label('D. Recolección')
        .targetEntity(admin.getEntity('usuarios'))
        .targetField(nga.field('nombre'))
        .permanentFilters({
          rol: 'domiciliario'
        }),
      nga.field('domiciliario_entrega_id', 'reference')
        .label('D. Entrega')
        .targetEntity(admin.getEntity('usuarios'))
        .targetField(nga.field('nombre'))
        .permanentFilters({
          rol: 'domiciliario'
        }),
    ])
    ;

  return invoice;
}
