
module.exports = function(nga, admin) {

  var subservice = admin.getEntity('subservicios');
  subservice.identifier(nga.field('_id'));

  subservice.listView()
    .title('Subservicios')
    .fields([
      nga.field('nombre').isDetailLink(true),
      nga.field('descripcion')
        .label('Descripción'),
      nga.field('precio', 'amount'),
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

  subservice.creationView()
    .title('Crear un Subservicio')
    .fields([
      nga.field('nombre'),
      nga.field('precio', 'amount'),
      nga.field('descripcion', 'text'),
      nga.field('detalles', 'text'),
    ])
    .actions([
      'back',
      'list'
    ]);

  subservice.editionView()
    .title('Editar un Subservicio')
    .fields([
      subservice.creationView().fields()
    ])
    .actions([
      'back',
      'list',
      'delete'
    ]);

  return subservice;
}
