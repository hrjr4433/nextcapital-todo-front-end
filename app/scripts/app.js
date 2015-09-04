var todoApp = angular.module('todoApp',[
    'match',
		'ngRoute',
		'ngCookies',
    'datatables',
    'ngMessages',
	])
.config(['$routeProvider', '$locationProvider', 
  function($routeProvider, $locationProvider) {
		$routeProvider
      .when('/', { 
        templateUrl: 'partials/todos', 
        controller: 'todosCtrl',
        controllerAs: 'todos'
      })
      .when('/login',{
        templateUrl: 'partials/login',
        controller: 'userCtrl',
        controllerAs: 'user'
      })
      .otherwise({
        redirectTo: '/login'
      });

    $locationProvider.html5Mode(true);
	}
])
.run(['$rootScope', '$location', '$cookieStore', '$http',
  function($rootScope, $location, $cookieStore, $http) {
    $rootScope.globals = $cookieStore.get('globals') || {};
    if ($rootScope.globals.currentUser) {
      Todo.USER = $rootScope.globals.currentUser
      $http.defaults.headers.common['Authorization'] = 'To Do ' + $rootScope.globals.currentUser.email;
    }

    $rootScope.$on('$locationChangeStart', function (event, next, current) {
      var restrictedPage = $.inArray($location.path(), ['/login', '/register']) === -1;
      var loggedIn = $rootScope.globals.currentUser;
      if (restrictedPage && !loggedIn) {
          $location.path('/login');
      }
    });
  }
])
.value('loadingImage','data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==');