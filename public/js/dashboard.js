// declare a new module called 'myApp', and make it require the `ng-admin` module as a dependency
var dashApp = angular.module('dashCleanSuit', ['ng-admin']);
// declare a function to run when the module bootstraps (during the 'config' phase)
dashApp.config(['NgAdminConfigurationProvider', function (nga) {
    // create an admin application
    var admin = nga.application('Panel | CleanSuit')
                   .baseApiUrl('http://localhost:3000/rest/');

    // create a User entity
    var user = nga.entity('users');
    // set the fields of the user entity list view
    user.listView().fields([
        nga.field('profile.name'),
        nga.field('email'),
        nga.field('rol'),
    ]);
    // add the user entity to the admin application
    admin.addEntity(user);

    // attach the admin application to the DOM and execute it
    nga.configure(admin);
}]);
