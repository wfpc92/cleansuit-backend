import editionTemplate from './edit.html';

module.exports = function(nga, admin) {

  const estados = [
    { label: 'En Cola', value: 'nueva' },
    { label: 'En Recolección', value: 'rutaRecoleccion' },
    { label: 'Recolectada', value: 'recolectada' },
    { label: 'En Proceso', value: 'procesando' },
    { label: 'En Entrega', value: 'rutaEntrega' },
    { label: 'Finalizada', value: 'entregada' },
    { label: 'Cancelada', value: 'cancelada' },
  ];

  var order = admin.getEntity('ordenes');
  order.identifier(nga.field('_id'));

  order.listView()
    .title('Ordenes')
    .fields([
      nga.field('codigo')
        .label('COD')
        .isDetailLink(true),
      nga.field('fecha', 'datetime')
        .format('dd MMM /yy - hh:mm a'),
      nga.field('cliente_id', 'reference')
        .label('Cliente')
        .targetEntity(admin.getEntity('usuarios'))
        .targetField(nga.field('nombre'))
        .isDetailLink(false),
      nga.field('orden.recoleccion.direccion')
        .label('Dirección Recolección'),
      // nga.field('estado', 'template')
      //   .label('Estado')
      //   .template('{{ entry.estado | estado }}'),
      nga.field('orden.telefono')
        .label('Teléfono'),
      nga.field('orden.totales.total', 'amount')
        .label('Total')
    ])
    .entryCssClasses(function(entry) {
      return entry.noleido ? 'needaction' : '';
    })
    .listActions([
      '<ma-edit-button entry="::entry" entity="::entity" size="xs" label="Detalles"></ma-edit-button>',
      '<order-status size="xs" orden="entry"></order-status>',
    ])
    .actions([
      'back',
      'filter'
    ])
    .filters([
      nga.field('codigo')
        .label('Código'),
      nga.field('codigo__gte')
        .label('Desde Orden #'),
      nga.field('codigo__lte')
        .label('Hasta Orden #'),
      nga.field('fecha__gte', 'datetime')
        .label('Fecha (Desde)'),
      nga.field('fecha__lte', 'datetime')
        .label('Fecha (Hasta)'),
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
    .batchActions([]);

  order.editionView()
    .template(editionTemplate)
    .title('Orden #{{ entry.values.codigo }}')
    .fields([
      nga.field('fecha', 'datetime') // 0
        .format('dd MMM /yy - hh:mm a')
        .editable(false),
      nga.field('cliente_id', 'reference') // 1
        .label('Cliente')
        .targetEntity(admin.getEntity('usuarios'))
        .targetField(nga.field('nombre'))
        .editable(false)
        .isDetailLink(false),
      nga.field('orden.recoleccion.direccion') // 2
        .label('Dirección')
        .validation({ required: true}),
      nga.field('orden.recoleccion.fecha', 'date') // 3
        .label('Fecha')
        .format('dd MMM /yy')
        .validation({ required: true }),
      nga.field('orden.entrega.direccion') // 4
        .label('Dirección')
        .validation({ required: true}),
      nga.field('orden.entrega.fecha', 'date') // 5
        .label('Fecha')
        .format('dd MMM /yy')
        .validation({ required: true }),
      nga.field('orden.telefono') // 6
        .label('Teléfono'),
      nga.field('orden.formaPago', 'choice') // 7
        .label('FormaPago')
        .choices([
          { value: 'En efectivo', label: 'Efectivo' },
          { value: 'Con tarjeta', label: 'Tarjeta' }
        ]),
      nga.field('orden.servicioDirecto', 'boolean') // 8
        .label('Sv.Directo')
        .choices([
          { value: true, label: 'Si' },
          { value: false, label: 'No' }
        ])
        .cssClasses('col-sm-9')
        .defaultValue(false),
      nga.field('orden.cupon') // 9
        .label('Cupon'),

      nga.field('domiciliario_recoleccion_id', 'reference') // 10
        .label('Domiciliario')
        .targetEntity(admin.getEntity('usuarios'))
        .targetField(nga.field('nombre'))
        .permanentFilters({
          rol: 'domiciliario'
        })
        .remoteComplete(true),

      nga.field('domiciliario_entrega_id', 'reference') // 11
        .label('Domiciliario')
        .targetEntity(admin.getEntity('usuarios'))
        .targetField(nga.field('nombre'))
        .permanentFilters({
          rol: 'domiciliario'
        })
        .remoteComplete(true),

      // nga.field('promocion', 'template') // 12
      //   .label('')
      //   .template('', true),
      nga.field('items', 'template') // 12
        .label('')
        .template('', true),
      nga.field('recoleccion', 'template') // 13
        .label('')
        .template('<basket orden="entry.values"></basket>', true),
      nga.field('estado', 'choice') // 14
        .choices(estados)
        .cssClasses('col-sm-4 col-lg-2')
        .editable(false),
      nga.field('orden.totales.domicilio', 'amount')
        .label('Domicilio'),
      nga.field('orden.totales.impuestos', 'amount')
        .label('Impuestos'),
      nga.field('orden.totales.total', 'amount')
        .label('Total'),
    ])
    .actions([
      'back',
      'list'
    ]);

  return order;
}
