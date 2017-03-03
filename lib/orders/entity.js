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
  const horas = [
    { label: '10 am - 11 am', value: '10:00 A.M. a 10:59 A.M.' },
    { label: '11 am - 12 m', value: '11:00 A.M. a 11:59 A.M.' },
    { label: '12 m  - 1 pm', value: '12:00 P.M. a 12:59 P.M.' },
    { label: ' 1 pm - 2 pm', value: '1:00 P.M. a 1:59 P.M.' },
    { label: ' 2 pm - 3 pm', value: '2:00 P.M. a 2:59 P.M.' },
    { label: ' 3 pm - 4 pm', value: '3:00 P.M. a 3:59 P.M.' },
    { label: ' 4 pm - 5 pm', value: '4:00 P.M. a 4:59 P.M.' },
    { label: ' 5 pm - 6 pm', value: '5:00 P.M. a 5:59 P.M.' },
    { label: ' 6 pm - 7 pm', value: '6:00 P.M. a 6:59 P.M.' },
    { label: ' 7 pm - 8 pm', value: '7:00 P.M. a 7:59 P.M.' },
    { label: ' 8 pm - 9 pm', value: '8:00 P.M. a 8:59 P.M.' },
    { label: ' 9 pm - 10 pm', value: '9:00 P.M. a 9:59 P.M.' },
  ];

  var order = admin.getEntity('ordenes');
  order.identifier(nga.field('_id'));

  order.listView()
    .title('Ordenes')
    .fields([
      nga.field('codigo').label('Código').isDetailLink(true),
      nga.field('fecha', 'datetime'),
      nga.field('cliente_id', 'reference')
        .label('Cliente')
        .targetEntity(admin.getEntity('usuarios'))
        .targetField(nga.field('nombre'))
        .isDetailLink(false),
      nga.field('orden.entrega.direccion')
        .label('Dirección Entrega'),
      nga.field('orden.telefono')
        .label('Teléfono'),
    ])
    .listActions([
      '<ma-edit-button entry="::entry" entity="::entity" size="xs" label="Detalles"></ma-edit-button>',
      '<order-status size="xs" orden="entry"></order-status>',
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

  order.editionView()
    .template(editionTemplate)
    .title('Orden #{{ entry.values.codigo }}')
    .fields([
      nga.field('fecha', 'datetime') // 0
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
        .validation({ required: true }),
      nga.field('orden.recoleccion.hora', 'choice') // 4
        .label('Hora')
        .choices(horas)
        .validation({ required: true}),
      nga.field('orden.entrega.direccion') // 5
        .label('Dirección')
        .validation({ required: true}),
      nga.field('orden.entrega.fecha', 'date') // 6
        .label('Fecha')
        .validation({ required: true }),
      nga.field('orden.entrega.hora', 'choice') // 7
        .label('Hora')
        .choices(horas)
        .validation({ required: true}),
      nga.field('orden.telefono') // 8
        .label('Teléfono'),
      nga.field('orden.formaPago', 'choice') // 9
        .label('FormaPago')
        .choices([
          { value: 'En efectivo', label: 'Efectivo' },
          { value: 'Con tarjeta', label: 'Tarjeta' }
        ]),
      nga.field('orden.servicioDirecto', 'boolean') // 10
        .label('Sv.Directo')
        .choices([
          { value: true, label: 'Si' },
          { value: false, label: 'No' }
        ])
        .cssClasses('col-sm-9')
        .defaultValue(false),
      nga.field('orden.cupon') // 11
        .label('Cupon'),

      nga.field('domiciliario_recoleccion_id', 'reference') // 12
        .label('Domiciliario')
        .targetEntity(admin.getEntity('usuarios'))
        .targetField(nga.field('nombre'))
        .permanentFilters({
          rol: 'domiciliario'
        })
        .remoteComplete(true),

      nga.field('domiciliario_entrega_id', 'reference') // 13
        .label('Domiciliario')
        .targetEntity(admin.getEntity('usuarios'))
        .targetField(nga.field('nombre'))
        .permanentFilters({
          rol: 'domiciliario'
        })
        .remoteComplete(true),

      // nga.field('promocion', 'template') // 14
      //   .label('')
      //   .template('', true),
      nga.field('items', 'template') // 14
        .label('')
        .template('', true),
      nga.field('recoleccion', 'template') // 15
        .label('')
        .template('<basket orden="entry.values"></basket>', true),
      nga.field('estado', 'choice') // 16
        .choices(estados)
        .cssClasses('col-sm-4 col-lg-2')
        .editable(false),
    ])
    .actions([
      '<order-status orden="entry"></order-status>',
      'list',
      'delete'
    ]);

  return order;
}
