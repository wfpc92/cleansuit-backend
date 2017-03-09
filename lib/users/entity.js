
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
    .actions([
      'filter'
    ])
    .filters([
      nga.field('nombre'),
      nga.field('rol', 'choice')
        .choices([
          { label: 'Cliente', value: 'cliente' },
          { label: 'Domiciliario', value: 'domiciliario' },
          { label: 'Recepcionista', value: 'recepcionista' },
          { label: 'Trabajador', value: 'trabajador' },
          { label: 'Admin Sede', value: 'admin_sede' },
          { label: 'SuperAdmin', value: 'superadmin' },
        ]),
    ])
    ;

  user.creationView()
    .title('Crear un Usuario')
    .fields([
      nga.field('nombre'),
      nga.field('correo', 'email'),
      nga.field('contrasena').label('Contraseña'),
      nga.field('rol', 'choice')
        .choices([
          { label: 'Cliente', value: 'cliente' },
          { label: 'Domiciliario', value: 'domiciliario' },
          { label: 'Recepcionista', value: 'recepcionista' },
          { label: 'Trabajador', value: 'trabajador' },
          { label: 'Admin Sede', value: 'admin_sede' },
          { label: 'SuperAdmin', value: 'superadmin' },
        ]),
    ]);

  user.editionView()
    .title('Editar un Usuario')
    .fields([
      nga.field('nombre'),
      nga.field('correo', 'email'),
      nga.field('rol', 'choice')
        .choices([
          { label: 'Cliente', value: 'cliente' },
          { label: 'Domiciliario', value: 'domiciliario' },
          { label: 'Recepcionista', value: 'recepcionista' },
          { label: 'Trabajador', value: 'trabajador' },
          { label: 'Admin Sede', value: 'admin_sede' },
          { label: 'SuperAdmin', value: 'superadmin' },
        ]),
    ]);

  return user;
}
