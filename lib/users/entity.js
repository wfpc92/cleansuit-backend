
module.exports = function(nga, admin) {

  var user = admin.getEntity('usuarios');
  user.identifier(nga.field('_id'));

  user.listView()
    .title('Listado de Usuarios')
    .fields([
      nga.field('nombre').isDetailLink(true),
      nga.field('correo'),
      nga.field('rol'),
    ])
    .filters([
      nga.field('q')
      .label('')
      .pinned(true)
      .template('<div class="input-group"><input type="text" ng-model="value" placeholder="Buscar" class="form-control"></input><span class="input-group-addon"><i class="glyphicon glyphicon-search"></i></span></div>'),
    ]);

  user.creationView()
    .title('Crear un Usuario')
    .fields([
      nga.field('nombre'),
      nga.field('correo'),
      nga.field('contrasena').label('Contraseña'),
      nga.field('rol')
    ]);

  user.editionView()
    .title('Editar un Usuario')
    .fields([
      nga.field('nombre'),
      nga.field('correo'),
      nga.field('rol')
    ]);

  return user;
}
