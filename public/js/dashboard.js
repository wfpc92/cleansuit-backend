// declare a new module called 'myApp', and make it require the `ng-admin` module as a dependency
var dashApp = angular.module('dashCleanSuit', ['ng-admin']);
// declare a function to run when the module bootstraps (during the 'config' phase)
dashApp.config(['NgAdminConfigurationProvider', function (nga) {
    // create an admin application
    var admin = nga.application('Panel | CleanSuit');
    // more configuration here later
    // ...
    // attach the admin application to the DOM and execute it
    nga.configure(admin);
}]);
