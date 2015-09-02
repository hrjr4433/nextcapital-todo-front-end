var todoApp = angular.module('todoApp',[
		'ngRoute',
		'ngCookies',
    'ngMessages',
    'match',
    'xeditable'
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
.run(['$rootScope', '$location', '$cookieStore', '$http', 'editableOptions',
  function($rootScope, $location, $cookieStore, $http, editableOptions) {
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

    editableOptions.theme = 'bs3';
  }
]);