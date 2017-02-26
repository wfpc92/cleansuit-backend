
module.exports = function(nga, admin) {

  var order = admin.getEntity('ordenes');
  order.identifier(nga.field('_id'));

  order.listView()
    .title('Ordenes')
    .fields([
      nga.field('codigo').label('Código').isDetailLink(true),
      nga.field('cliente_id', 'reference')
        .label('Cliente')
        .targetEntity(admin.getEntity('usuarios'))
        .targetField(nga.field('nombre')),
      nga.field('orden.entrega.direccion')
        .label('Dirección'),
      nga.field('orden.telefono')
        .label('Teléfono'),
      nga.field('fecha', 'datetime')
    ])
    .filters([
      nga.field('q')
        .label('')
        .pinned(true)
        .template('<div class="input-group"><input type="text" ng-model="value" placeholder="Buscar" class="form-control"></input><span class="input-group-addon"><i class="glyphicon glyphicon-search"></i></span></div>'),
    ]);

  order.editionView()
    .title('Orden #{{ entry.values.codigo }}')
    .fields([
      nga.field('fecha', 'datetime')
        .editable(false),
      nga.field('cliente_id', 'reference')
        .label('Cliente')
        .targetEntity(admin.getEntity('usuarios'))
        .targetField(nga.field('nombre'))
        .editable(false),
      nga.field('entrega', 'template')
        .label('')
        .template('<basket orden="entry.values"></basket>'),
      nga.field('estado', 'choice')
        .choices([
          { label: 'En Cola', value: 'nueva' },
          { label: 'En Recolección', value: 'rutaRecoleccion' },
          { label: 'Recolectada', value: 'recolectada' },
          { label: 'En Proceso', value: 'procesando' },
          { label: 'En Entrega', value: 'rutaEntrega' },
          { label: 'Finalizada', value: 'entregada' },
          { label: 'Cancelada', value: 'cancelada' },
        ])
        .cssClasses('col-sm-4 col-lg-2'),
    ]);

  return order;
}
