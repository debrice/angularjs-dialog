# angularjs-dialog

Provide an elegant match to native dialog feature for your angular
JS web application.

Dialog expects you to be using ui-router library and to have a
dedicated dialog view for it to render itself.

## Usage

Import dialog as a module dependency

```coffee
angular.module('my_app', ['dialog'])
```

in your index.html make sure you have a ui-view. Something like:

```jade
doctype html

html(
    lang = "en"
    ng-app = "app"
)

    head
        each script in scripts
            script(src="/#{script}")
    body
        div(ui-view="content")
        div(ui-view="dialog")
```

## Prompt Dialog

Prompt user for an input

```coffee
angular.module('my_app').directive 'myController',
    (
        dialogService
    ) ->
        dialog_promise = dialogService.prompt(
            'Paste a list of zipcode here:'  # modal content
            'Insert Postal Codes'            # Call to action
        )

        dialog_promise.catch ->  # User cancel by pressing <ESC> or cancel
            undefined

        dialog_promise.then (input_value) ->  # User clicked the call to action
            undefined
```

## Alert Dialog

Inform the user, only

```coffee
angular.module('my_app').directive 'myController',
    (
        dialogService
    ) ->
        dialog_promise = dialogService.prompt(
            'Information about what the user just did...'  # modal content
        )

        dialog_promise.finally ->  # User closes the alert dialog
            undefined

```

## Confirm Dialog

Give the user a dialog with a Cancel and a Call to action. If user
click the call to action, the promise is resolved, otherwise it is
rejected

```coffee
angular.module('my_app').directive 'myController',
    (
        myObjectService
        dialogService
    ) ->
        dialog_promise = dialogService.confirm(
            'Confirm you want to delete X'  # modal content
            'Yes delete X'                  # Call to action
        )

        dialog_promise.then ->  # User closes the alert dialog
            myObjectService.delete()

```
