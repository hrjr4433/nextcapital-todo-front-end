todoApp.controller('homeCtrl', ['$scope', function($scope) {}]);

todoApp.controller('userCtrl', ['$scope', '$location', '$rootScope', '$cookieStore', '$http',
  function($scope, $location, $rootScope, $cookieStore, $http) {
    var user = this;

    user.login = login;
    user.register = register;

    // clear the cookies
    (function() {
      $rootScope.globals = {};
      $cookieStore.remove('globals');
      $http.defaults.headers.common.Authorization = 'To Do ';
    })();

    // login using API
    function login() {
      user.dataLoading = true;
      Todo.startSession({
        email: user.email, 
        password: user.password, 
        success: function(resp) {
          $rootScope.globals = { currentUser: resp };

          $http.defaults.headers.common['Authorization'] = 'Basic ' + user.email;
          $cookieStore.put('globals', $rootScope.globals);
          $location.path('/');
          $scope.$apply();
        },
        error: function(xhr) {
          user.error = xhr.responseJSON["error"];
          user.dataLoading = false;
          $scope.$apply();
        }
      });
    }

    // register using API
    function register() {
      user.dataLoading = true;
      Todo.createUser({
        email:    user.reg_email,
        password: user.reg_password,
        success:  function(resp) {
          $location.path('/');
          $scope.$apply();
        },
        error:    function(xhr) {
          user.error = xhr.responseJSON["email"][0];
          user.dataLoading = false;
          $scope.$apply();
        }
      });
    }
  }
]);

todoApp.controller('todosCtrl', ['$scope', '$location', 
  function($scope, $location) {
    var todos = this;

    todos.logout = logout;

    $scope.todos = [];
    (function() {
      Todo.loadTodos({
        success: function(resp) { 
          $scope.todo_list = resp; 
          $scope.$apply();
        },
        error:   function(xhr)  {
          alert(xhr.responseJSON["error"]);
          todos.logout(); 
        }
      });
    })();

    function logout() {
      if (confirm("Do you really want to logout?") == true) {
        Todo.endSession({
          success: function(resp) {
            $location.path('/login');
            $scope.$apply();
          },
          error:   function(xhr)  {
            alert(xhr.responseJSON["error"]);
          }
        });
      }
    }
  }
]);