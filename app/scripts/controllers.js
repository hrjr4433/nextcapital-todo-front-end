todoApp.controller('homeCtrl', ['$scope', function($scope) {}]);

todoApp.controller('userCtrl', ['$scope', '$location', '$rootScope', '$cookieStore', '$http', 'loadingImage',
  function($scope, $location, $rootScope, $cookieStore, $http, loadingImage) {
    // if cookie exist, then go to todos page
    if ( $rootScope.globals) { $location.path('/'); }
    var user = this;

    user.login = login;
    user.register = register;
    user.loadingImage = loadingImage;

    function setup_cookies(resp) {
      $rootScope.globals = { currentUser: resp };

      $http.defaults.headers.common['Authorization'] = 'Basic ' + user.email;
      $cookieStore.put('globals', $rootScope.globals);
      $location.path('/');
      $scope.$apply();
    }

    // login using API
    function login() {
      user.dataLoading = true;
      Todo.startSession({
        email: user.email, 
        password: user.password, 
        success: function(resp) {
          setup_cookies(resp);
        },
        error: function(xhr) {
          if (xhr.responseText == "") {
            user.error = "Error, it could be network issue.";
          }
          else {
            user.error = xhr.responseJSON["error"];
          }
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
          $("#register").modal("hide");
          $('#register').on('hidden.bs.modal', function() { setup_cookies(resp); });
          $scope.$apply();
        },
        error:    function(xhr) {if (xhr.responseText == "") {
            user.reg_error = "Error, it could be network issue.";
          }
          else {
            user.reg_error = xhr.responseJSON["email"][0];
          }
          user.dataLoading = false;
          $scope.$apply();
        }
      });
      user.dataLoading = false;
    }
  }
]);

todoApp.controller('todosCtrl', ['$scope', '$location', '$rootScope', '$cookieStore', '$http', '$route', 'loadingImage', 'DTOptionsBuilder',
  function($scope, $location, $rootScope, $cookieStore, $http, $route, loadingImage, DTOptionsBuilder) {
    var todos = this;
    todos.selected = null;

    todos.logout = logout;
    todos.create = create;
    todos.mark = mark;
    todos.select = select;
    todos.edit = edit;
    todos.loadingImage = loadingImage;

    function clear_cookies() {
      // clear cookie
      $rootScope.globals = {};
      $cookieStore.remove('globals');
      $http.defaults.headers.common.Authorization = 'To Do ';
    }

    (function() {
      Todo.loadTodos({
        success: function(list) {
          $scope.dtOption = DTOptionsBuilder.newOptions().withOption('order', [0,'desc']);
          $scope.todo_list = list;
          $scope.$apply();
        },
        error:   function(xhr)  {
          alert(xhr.responseJSON["error"]);
          clear_cookies();
          $location.path('/login');
        }
      });
    })();

    function logout() {
      if (confirm("Do you really want to logout?")) {
        Todo.endSession({
          success: function(resp) {
            clear_cookies();
            $location.path('/login');
            $scope.$apply();
          },
          error:   function(xhr)  {
            alert(xhr.responseJSON["error"]);
          }
        });
      }
    }

    function create() {
      todos.dataLoading = true;
      Todo.createTodo({
        todo: {
          description: todos.desc,
          is_complete: false
        },
        success: function(todo) {
          $("#create").modal("hide");
          $('#create').on('hidden.bs.modal', function() { $route.reload(); });
        },
        error:   function()     { alert('todo create error!') }
      });
      todos.dataLoading = false;
    }

    function mark(item) {
      var is_completed = !(item.is_complete)
      Todo.updateTodo({
        todoId: item.id,
        data: { is_complete: is_completed },
        success: function(todo) {
          item.is_complete = is_completed;
          $scope.$apply();
        },
        error:   function(xhr)  { alert(xhr.responseJSON["error"]); }
      });
    }

    function select(item) { 
      todos.selected = item;
      todos.selected_desc = angular.copy(item.description); 
    }

    function edit() {
      todos.dataLoading = true;
      Todo.updateTodo({
        todoId: todos.selected.id,
        data: { description: todos.selected_desc },
        success: function() { 
          todos.selected.description = todos.selected_desc;
          $scope.$apply();
          $("#edit").modal("hide");
        },
        error:   function(xhr)  { 
          alert(xhr.responseJSON["error"]); 
          $route.reload();
        }
      });
      todos.dataLoading = false;
    }
  }
]);