// declare a new module called 'myApp', and make it require the `ng-admin` module as a dependency
var dashApp = angular.module('dashCleanSuit', ['ng-admin']);
// declare a function to run when the module bootstraps (during the 'config' phase)
dashApp.config(['NgAdminConfigurationProvider', function (nga) {
    // create an admin application
    var admin = nga.application('Panel | CleanSuit')
                   .baseApiUrl('http://localhost:3000/rest/');

    // create a User entity
    var user = nga.entity('users');
    // User views
    user.listView()
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
    user.creationView().fields([
      nga.field('email').label('Correo'),
      nga.field('password').label('Contraseña'),
      nga.field('profile.name').label('Nombre'),
      nga.field('profile.location').label('Dirección'),
      nga.field('profile.website').label('Sitio Web'),
      nga.field('rol'),
    ])
    user.editionView().fields(user.creationView().fields());
    // add the user entity to the admin application
    admin.addEntity(user);

    // attach the admin application to the DOM and execute it
    nga.configure(admin);
}]);
