// declare a new module called 'myApp', and make it require the `ng-admin` module as a dependency
var dashApp = angular.module('dashCleanSuit', ['ng-admin']);

// dashboard translation
dashApp.config(['$translateProvider', function ($translateProvider) {
  $translateProvider.translations('es', {
    'BACK': 'Volver',
    'DELETE': 'Borrar',
    'CREATE': 'Crear',
    'EDIT': 'Editar',
    'EXPORT': 'Exportar',
    'ADD_FILTER': 'Añadr filtro',
    'SEE_RELATED': 'Ver los {{ entityName }} relacionados',
    'LIST': 'Listado',
    'SHOW': 'Ver',
    'SAVE': 'Guardar',
    'N_SELECTED': '{{ length }} Seleccionados',
    'ARE_YOU_SURE': 'Confirma la acción?',
    'YES': 'Si',
    'NO': 'No',
    'FILTER_VALUES': 'Filtrar valores',
    'CLOSE': 'Cerrar',
    'CLEAR': 'Limpiar',
    'CURRENT': 'Actual',
    'REMOVE': 'Eliminar',
    'ADD_NEW': 'Crear {{ name }}',
    'BROWSE': 'Explorar',
    'N_COMPLETE': '{{ progress }}% Completado',
    'CREATE_NEW': 'Crear',
    'SUBMIT': 'Enviar',
    'SAVE_CHANGES': 'Guardar cambios',
    'BATCH_DELETE_SUCCESS': 'Registros eliminados exitosamente',
    'DELETE_SUCCESS': 'Registro eliminado exitosamente',
    'ERROR_MESSAGE': 'Ups, ocurrió un error (código: {{ status }})',
    'INVALID_FORM': 'Formulario no válido',
    'CREATION_SUCCESS': 'Registro creado exitosamente',
    'EDITION_SUCCESS': 'Cambios guardados exitosamente',
    'ACTIONS': 'Acciones',
    'PAGINATION': '<strong>{{ begin }}</strong> - <strong>{{ end }}</strong> de <strong>{{ total }}</strong>',
    'NO_PAGINATION': 'No se encontraron registros',
    'PREVIOUS': '« Prev',
    'NEXT': 'Sig »',
    'DETAIL': 'Detalles',
    'STATE_CHANGE_ERROR': 'Error de cambio de estado: {{ message }}',
    'NOT_FOUND': 'No Encontrado',
    'NOT_FOUND_DETAILS': 'La página que está buscando no se pudo encontrar. Compruebe que todo esté bien.',
  });
  $translateProvider.preferredLanguage('es');
}]);

// declare a function to run when the module bootstraps (during the 'config' phase)
dashApp.config(['NgAdminConfigurationProvider', function (nga) {
    // create an admin application
    var admin = nga.application('Panel | CleanSuit')
                   .baseApiUrl('http://localhost:3000/rest/');

    // create a User entity
    var user = nga.entity('users');
    // User views
    user.listView()
    .title('Listado de Usuarios')
    .fields([
      nga.field('profile.name').label('Nombre').isDetailLink(true),
      nga.field('email').label('Correo'),
      nga.field('rol'),
    ]).filters([
      nga.field('q')
        .label('')
        .pinned(true)
        .template('<div class="input-group"><input type="text" ng-model="value" placeholder="Buscar" class="form-control"></input><span class="input-group-addon"><i class="glyphicon glyphicon-search"></i></span></div>'),
    ]);

    user.creationView()
    .title('Crear un Usuario')
    .fields([
      nga.field('email').label('Correo'),
      nga.field('password').label('Contraseña'),
      nga.field('profile.name').label('Nombre'),
      nga.field('profile.location').label('Dirección'),
      nga.field('profile.website').label('Sitio Web'),
      nga.field('rol'),
    ])

    user.editionView()
    .title('Editar un Usuario')
    .fields(user.creationView().fields());
    // add the user entity to the admin application
    admin.addEntity(user);

    // attach the admin application to the DOM and execute it
    nga.configure(admin);
}]);
