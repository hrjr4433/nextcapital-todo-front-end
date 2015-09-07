// general error handling
function general_error_handling(xhr) {
  if (xhr.responseText == "") {
    return "Error, it could be network issue.";
  }
  else {
    return xhr.responseJSON["error"];
  } 
}

// controller for login page
todoApp.controller('userCtrl', ['$scope', '$location', '$rootScope', '$cookieStore', '$http', 'loadingImage',
  function($scope, $location, $rootScope, $cookieStore, $http, loadingImage) {
    // if cookie exist, then go to todos page
    if ( $rootScope.globals) { $location.path('/'); }
    var user = this;

    user.login = login;
    user.register = register;
    user.loadingImage = loadingImage;

    // store the cookie
    function store_cookie(resp) {
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
          store_cookie(resp);
        },
        error: function(xhr) {
          user.error = general_error_handling(xhr);
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
          $('#register').on('hidden.bs.modal', function() { store_cookie(resp); });
          $scope.$apply();
        },
        error:    function(xhr) {
          if (xhr.responseText == "") {
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

// controller for To Do page
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

    // clear stored cookie
    function clear_cookies() {
      // clear cookie
      $rootScope.globals = {};
      $cookieStore.remove('globals');
      $http.defaults.headers.common.Authorization = 'To Do ';
    }

    // load To Do list on loading the page using API
    (function() {
      Todo.loadTodos({
        success: function(list) {
          $scope.dtOption = DTOptionsBuilder.newOptions().withOption('order', [0,'desc']);
          $scope.todo_list = list;
          $scope.$apply();
        },
        error:   function(xhr)  {
          alert(general_error_handling(xhr));
          clear_cookies();
          $location.path('/login');
        }
      });
    })();

    // logout using API
    function logout() {
      if (confirm("Do you really want to logout?")) {
        Todo.endSession({
          success: function(resp) {
            clear_cookies();
            $location.path('/login');
            $scope.$apply();
          },
          error:   function(xhr)  {
            alert(general_error_handling(xhr));
            clear_cookies();
            $location.path('/login');
          }
        });
      }
    }

    // create To Do using API
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
        error:   function(xhr)     { 
          todos.create_error = general_error_handling(xhr);
          $scope.$apply();
        }
      });
      todos.dataLoading = false;
    }

    // update is_compelete of To Do using API
    function mark(item) {
      var is_completed = !(item.is_complete)
      Todo.updateTodo({
        todoId: item.id,
        data: { is_complete: is_completed },
        success: function(todo) {
          item.is_complete = is_completed;
          $scope.$apply();
        },
        error:   function(xhr)  { 
          alert(general_error_handling(xhr));
        }
      });
    }

    // save selected item and copy the description
    function select(item) { 
      todos.selected = item;
      todos.selected_desc = angular.copy(item.description); 
    }

    // update description of To Do using API
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
          todos.edit_error = general_error_handling(xhr);
          $scope.$apply();
        }
      });
      todos.dataLoading = false;
    }
  }
]);