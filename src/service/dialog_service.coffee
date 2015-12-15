###
Holds the dialog service
###

angular.module('dialog').service 'dialogService',
  (
    $q
  ) ->
    callbacks = []

    confirm: (text, call_to_action='Ok') ->
      return @broadcastChange 'CONFIRM', text, call_to_action

    alert: (text, call_to_action='Ok') ->
      return @broadcastChange 'ALERT', text, call_to_action

    prompt: (text, call_to_action='Ok') ->
      return @broadcastChange 'PROMPT', text, call_to_action

    addListener: (callback) ->
      callbacks.push callback

    removeListener: (callback) ->
      _.pull(callbacks, callback)

    broadcastChange: ->
      args = arguments
      return $q.all _.map callbacks, (callback) ->
        callback.apply null, args
