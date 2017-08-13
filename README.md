# Redux Session Manager Middleware


This middleware will serialize your redux store to sessionStorage for yout **client-side only** app, to allow you to populate the redux store with a preloaded state on refresh. *(SSR apps would handle this differently)*. How to restore the state is described [here](#restoring-state).

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

const options = { ... };
const store = createStore(reducers, [ sessionManager(options)])
```

### Options
| Property | Type | Required? | Description |
|:---|:---|:---|:---
name | string | yes | This will be the key in sessionStorage for the serialized state |
ignoreActions | array | no | An array of action types that will not execute this middleware |
exclude | object | no | An object where the key is the name of the reducer containing state to exclude from serialization and the value is either a `'*'` to indicate the entire reducer state, or an array reprenting the keyPath to the part to exclude. Ex ```const exclude = { myReducer : ['prop1', 'nestedProp2', 'value'] }```


### Restoring state

State restoration upon refresh, can be handled via middleware, but I'd recommend just populating the store with a preloadedState instead, so that unnecessary actions to achieve this result aren't needed.

This can simply be achieved by pulling out the state from sessionStorage and passing it to `createStore`

Ex:
```javascript
const restoredState = JSON.parse(sessionStorage.getItem('myReducer');
```
You may need to provide a `reviver` function to `JSON.parse` if you had custom classes. Documentation on `reviver` can be found [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse)

### FAQ

**Q: My state isn't being properly saved after an action dispataches**

A: Since this is *middleware*, it is executed before the reducer receives the action to update the state. So this serialization is essentially 1 action behind. I've experimented with ugly hacks to get the modified state after the reducer but none that are worth shipping. If anyone has any ideas feel free to contribute!