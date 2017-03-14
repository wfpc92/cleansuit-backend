
module.exports = function(nga, admin) {

  var user = admin.getEntity('usuarios');
  user.identifier(nga.field('_id'));

  user.listView()
    .title('Listado de Usuarios')
    .fields([
      nga.field('profile.url_foto', 'template')
        .label('')
        .template(entry => `<img ng-if="entry.values['profile.url_foto']" src="${ entry.values['profile.url_foto'] }" width="25" style="margin-top:-4px" />`),
      nga.field('nombre').isDetailLink(true),
      nga.field('correo'),
      nga.field('rol').sortable(false),
      nga.field('createdAt', 'datetime'),
    ])
    .actions([
      'back',
      'create',
      'filter'
    ])
    .filters([
      nga.field('rol', 'choice')
        .choices([
          { label: 'Cliente', value: 'cliente' },
          { label: 'Domiciliario', value: 'domiciliario' },
          { label: 'Trabajador', value: 'trabajador' },
          { label: 'Recepcionista', value: 'recepcionista' },
          // { label: 'Admin Sede', value: 'admin_sede' },
          { label: 'SuperAdmin', value: 'superadmin' },
        ]),
      nga.field('nombre__regex')
        .label('Nombre'),
      nga.field('correo__regex')
        .label('Correo'),
    ])
    .batchActions([]);

  user.creationView()
    .title('Crear un Usuario')
    .fields([
      nga.field('nombre'),
      nga.field('correo', 'email')
        .validation({ required: true }),
      nga.field('contrasena', 'password')
        .label('Contraseña')
        .validation({ required: true }),
      nga.field('rol', 'choice')
        .choices([
          { label: 'Cliente', value: 'cliente' },
          { label: 'Domiciliario', value: 'domiciliario' },
          { label: 'Trabajador', value: 'trabajador' },
          { label: 'Recepcionista', value: 'recepcionista' },
          // { label: 'Admin Sede', value: 'admin_sede' },
          { label: 'SuperAdmin', value: 'superadmin' },
        ])
        .validation({ required: true }),
      nga.field('profile.direccion')
        .label('Dirección'),
      nga.field('profile.telefono')
        .label('Teléfono'),
      nga.field('profile.url_foto', 'file')
        .label('Foto')
        .uploadInformation({
          'url': '/upload/usuarios',
          'apifilename': 'uploaded_url'
        }),
    ])
    .actions([
      'back',
      'list'
    ]);

  user.editionView()
    .title('Editar un Usuario')
    .fields([
      user.creationView().fields()
    ]);

  return user;
}
