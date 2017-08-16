# Redux Session Manager Middleware
[![Travis](https://img.shields.io/travis/ssilve1989/redux-session-manager-middleware.svg)](https://travis-ci.org/ssilve1989/redux-session-manager-middleware)
[![npm](https://img.shields.io/npm/v/redux-session-manager-middleware.svg?style=flat-square)](https://www.npmjs.com/package/redux-session-manager-middleware)

This middleware will serialize your redux store to sessionStorage for your **client-side only** app, to allow you to populate the redux store with a preloaded state on refresh. *(SSR apps would handle this differently)*. How to restore the state is described [here](#restoring-state).

## Installation

```
npm i redux-session-manager-middleware
```

## Usage
Apply this middleware similarly to other redux middleware. The only difference
being that this middleware requires an options argument

```javascript
import { createStore } from 'redux';
import sessionManager from 'redux-session-manager-middleware'

const options = { 
  name : "myApplication",
  exclude : [
    "myReducer1",
    [
    	"myReducer2", [
    		'excludedProp1'
    		['keys', 'to', 'excluded', 'property2']
        ]
    ]
  ],
  ignoreActions: [ ACTION_1, ACTION_2 ]
};
const store = createStore(reducers, [ sessionManager(options)])
```

### Options
| Property | Type | Required? | Description |
|:---|:---|:---|:---
name | string | yes | This will be the key in sessionStorage for the serialized state |
ignoreActions | array | no | An array of action types that will not execute this middleware |
exclude | array[string\|array] | no | An array containing either a string representing the reducer to exclude, or an array of [reducerName, keyPaths] where keyPaths can be either a string for a direct property of the reducer, or an array representing the keyPath to the property to be excluded.


### Restoring state

State restoration upon refresh, can be handled via middleware, but I'd recommend just populating the store with a preloadedState instead, so that unnecessary actions to achieve this result aren't needed.

This can simply be achieved by pulling out the state from sessionStorage and passing it to `createStore`

Ex:
```javascript
const restoredState = JSON.parse(sessionStorage.getItem('myReducer');
```
You may need to provide a `reviver` function to `JSON.parse` if you had custom classes. Documentation on `reviver` can be found [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse)

### FAQ

**Q: My state isn't being saved after an action dispatches**

A: Since this is *middleware*, it is executed before the reducer receives the action to update the state. So this serialization is essentially 1 action behind. I've experimented with ugly hacks to get the modified state after the reducer but none that are worth shipping. If anyone has any ideas feel free to contribute!
