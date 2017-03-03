
module.exports = function(nga, admin) {

  var service = admin.getEntity('servicios');
  service.identifier(nga.field('_id'));

  service.listView()
    .title('Servicios')
    .fields([
      nga.field('nombre').isDetailLink(true),
      nga.field('descripcion'),
      // nga.field('subservicios', 'reference_many')
      // .targetEntity(nga.entity('subservicios'))
      // .targetField(nga.field('nombre')),
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

  service.creationView()
    .title('Crear un Servicio')
    .fields([
      nga.field('nombre'),
      nga.field('descripcion', 'text'),
      // nga.field('subservicios', 'reference_many')
      // .targetEntity(nga.entity('subservicios'))
      // .targetField(nga.field('nombre'))
      // .singleApiCall(ids => ({'_id': ids })),
    ]);

  service.editionView()
    .title('Editar un Servicio')
    .fields([
      nga.field('nombre'),
      nga.field('descripcion', 'text'),
      // nga.field('subservicios', 'reference_many')
      // .targetEntity(nga.entity('subservicios'))
      // .targetField(nga.field('nombre'))
      // .singleApiCall(ids => ({'_id': ids })),
    ]);

  return service;
}
