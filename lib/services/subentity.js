
module.exports = function(nga, admin) {

  var subservice = admin.getEntity('subservicios');
  subservice.identifier(nga.field('_id'));

  subservice.listView()
    .title('Subservicios')
    .fields([
      nga.field('nombre').isDetailLink(true),
      nga.field('descripcion'),
      nga.field('precio', 'amount'),
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
    .batchActions([]);

  subservice.creationView()
    .title('Crear un Subservicio')
    .fields([
      nga.field('nombre'),
      nga.field('precio', 'amount'),
      nga.field('descripcion', 'text'),
      nga.field('detalles', 'text'),
    ]);

  subservice.editionView()
    .title('Editar un Subservicio')
    .fields([
      subservice.creationView().fields()
    ]);

  return subservice;
}
