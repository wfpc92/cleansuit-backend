
module.exports = function(nga, admin) {

  var service = admin.getEntity('servicios');
  service.identifier(nga.field('_id'));

  service.listView()
    .title('Servicios')
    .fields([
      nga.field('nombre').isDetailLink(true),
      nga.field('descripcion'),
      // nga.field('subservicios', 'reference_many')
      // .targetEntity(admin.getEntity('subservicios'))
      // .targetField(nga.field('nombre')),
    ])
    .actions([
      'back',
      'create',
      'filter'
    ])
    .filters([
      nga.field('nombre__regex')
        .label('Nombre'),
      nga.field('descripcion__regex')
        .label('Descripción'),
    ])
    .batchActions([]);

  service.creationView()
    .title('Crear un Servicio')
    .fields([
      nga.field('nombre'),
      nga.field('descripcion', 'text'),
      nga.field('subservicios', 'reference_many')
        .targetEntity(admin.getEntity('subservicios'))
        .targetField(nga.field('nombre'))
        .singleApiCall(ids => ({'_id': ids }))
        .remoteComplete(true),
    ])
    .actions([
      'back',
      'list'
    ]);

  service.editionView()
    .title('Editar un Servicio')
    .fields([
      nga.field('nombre'),
      nga.field('descripcion', 'text'),
      nga.field('subservicios', 'reference_many')
        .targetEntity(admin.getEntity('subservicios'))
        .targetField(nga.field('nombre'))
        .singleApiCall(ids => ({'_id': ids }))
        .remoteComplete(true),
    ])
    .actions([
      'back',
      'list',
      'delete'
    ]);

  return service;
}
