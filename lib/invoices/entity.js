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
    .exportFields([
      nga.field('updatedAt', 'datetime')
        .label('Fecha')
        .format('dd-MM-yy HH:mm'),
      nga.field('orden_id', 'reference')
        .label('Orden')
        .targetEntity(admin.getEntity('ordenes'))
        .targetField(nga.field('codigo')),
      nga.field('cliente_id', 'reference')
        .label('Cliente')
        .targetEntity(admin.getEntity('usuarios'))
        .targetField(nga.field('nombre')),
      nga.field('domiciliario_recoleccion_id', 'reference')
        .label('Dom. Recolección')
        .targetEntity(admin.getEntity('usuarios'))
        .targetField(nga.field('nombre')),
      nga.field('domiciliario_entrega_id', 'reference')
        .label('Dom. Entrega')
        .targetEntity(admin.getEntity('usuarios'))
        .targetField(nga.field('nombre')),
      nga.field('formaPago', 'choice')
        .label('Forma de Pago')
        .choices([
          { value: 'En efectivo', label: 'Efectivo' },
          { value: 'Con tarjeta', label: 'Tarjeta' }
        ]),
      nga.fields('servicioDirecto', 'boolean')
        .filterChoices([
            { value: true, label: 'Si' },
            { value: false, label: 'No' }
        ]),
      nga.field('descuento', 'amount')
        .label('Descuento'),
      nga.field('domicilio', 'amount')
        .label('Domicilio'),
      nga.field('iva', 'amount')
        .label('IVA'),
      nga.field('total', 'amount')
        .label('Total')
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
