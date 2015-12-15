
/*
dialog module
 */
angular.module('dialog', []);

angular.module('dialog').controller('dialogCtrl', function($scope, $q, dialogService) {
  var ENTER_KEY, ESC_KEY, keyPressEvent;
  ESC_KEY = 27;
  ENTER_KEY = 13;
  $scope.deferred = null;
  $scope.dialog = {
    visible: false,
    type: null,
    text: null,
    call_to_action: null
  };
  keyPressEvent = function(event) {
    var ref;
    if ((ref = event.which) === ESC_KEY || ref === ENTER_KEY) {
      event.stopPropagation();
      switch (event.which) {
        case ENTER_KEY:
          $scope.deferred.resolve();
          break;
        case ESC_KEY:
          $scope.deferred.reject();
      }
      return false;
    }
  };
  $scope.$watch('dialog.visible', function(new_value, old_value) {
    if (new_value === old_value) {
      return;
    }
    if (new_value) {
      return window.addEventListener('keyup', keyPressEvent, true);
    } else {
      return window.removeEventListener('keyup', keyPressEvent, true);
    }
  });
  return dialogService.addListener(function(type, text, call_to_action) {
    $scope.deferred = $q.defer();
    $scope.dialog.text = text;
    $scope.dialog.call_to_action = call_to_action;
    $scope.dialog.type = type;
    $scope.dialog.visible = true;
    $scope.dialog.prompt_data = '';
    $scope.deferred.promise["finally"](function() {
      return $scope.dialog.visible = false;
    });
    return $scope.deferred.promise;
  });
});


/*
Holds the dialog service
 */
angular.module('dialog').service('dialogService', function($q) {
  var callbacks;
  callbacks = [];
  return {
    confirm: function(text, call_to_action) {
      if (call_to_action == null) {
        call_to_action = 'Ok';
      }
      return this.broadcastChange('CONFIRM', text, call_to_action);
    },
    alert: function(text, call_to_action) {
      if (call_to_action == null) {
        call_to_action = 'Ok';
      }
      return this.broadcastChange('ALERT', text, call_to_action);
    },
    prompt: function(text, call_to_action) {
      if (call_to_action == null) {
        call_to_action = 'Ok';
      }
      return this.broadcastChange('PROMPT', text, call_to_action);
    },
    addListener: function(callback) {
      return callbacks.push(callback);
    },
    removeListener: function(callback) {
      return _.pull(callbacks, callback);
    },
    broadcastChange: function() {
      var args;
      args = arguments;
      return $q.all(_.map(callbacks, function(callback) {
        return callback.apply(null, args);
      }));
    }
  };
});
