angular.module('dialog').controller 'dialogCtrl',
  (
    $scope
    $q
    dialogService
  ) ->
    ESC_KEY = 27
    ENTER_KEY = 13

    $scope.deferred = null
    $scope.dialog =
      visible: false
      type: null
      text: null
      call_to_action: null

    keyPressEvent = (event) ->
      if event.which in [ESC_KEY, ENTER_KEY]
        event.stopPropagation()

        switch event.which
          when ENTER_KEY
            $scope.deferred.resolve()

          when ESC_KEY
            $scope.deferred.reject()

        return false

    # Listen to keypress to close dialog on ESC key pressed
    $scope.$watch 'dialog.visible', (new_value, old_value) ->
      return if new_value is old_value

      if new_value
        window.addEventListener 'keyup', keyPressEvent, true
      else
        window.removeEventListener 'keyup', keyPressEvent, true


    dialogService.addListener (type, text, call_to_action) ->
      $scope.deferred = $q.defer()

      $scope.dialog.text = text
      $scope.dialog.call_to_action = call_to_action
      $scope.dialog.type = type
      $scope.dialog.visible = true
      $scope.dialog.prompt_data = ''

      $scope.deferred.promise.finally ->
        $scope.dialog.visible = false

      return $scope.deferred.promise
