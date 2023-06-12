# Async Storage Middleware
A [Galena](https://www.npmjs.com/package/@figliolia/galena) middleware for persisting units of State with [Async Storage](https://react-native-async-storage.github.io/async-storage/). 

# Getting Started

## Installation
```bash
npm install --save @figliolia/galena-async-storage
# or
yarn add @figliolia/galena-async-storage
```

## Basic Usage

```typescript
import { State } from "@figliolia/galena";
import { AsyncStorageMiddleware } from "@figliolia/galena-async-storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

const UserState = new State("User", {
  token: "",
  username: ""
});

void AsyncStorage.getItem("User").then(savedState => {
  if(savedState) {
    // Initialize User State from async storage
    UserState.update(state => {
      state.token = savedState.token;
      state.username = savedState.username;
    });
  }
  // Persist all future state mutations using AsyncStorageMiddleware
  UserState.registerMiddleware(new AsyncStorageMiddleware());
});
```
### Persisting State Mutations
Once the `AsyncStorageMiddleware()` is registered on your state, each call to `State.update()`, `State.backgroundUpdate()`, and `State.priorityUpdate()` will persist the latest mutation into `AsyncStorage`. Each entry's key will be equal to `State.name`.

## Factories for Persisted Galena State
In production, you may find yourself with several units of State requiring `AsyncStorage`. If using `Galena` instances, applying this middleware to all unit's of `State` is as easy as calling:

```typescript
import { Galena } from "@figliolia/galena";
import { AsyncStorageMiddleware } from "@figliolia/galena-async-storage";

export const AppState = new Galena([
  new AsyncStorageMiddleware()
]);

const MyState = AppState.composeState("My State", {
  token: "",
  username: ""
});
// MyState.middleware = [new AsyncStorageMiddleware()];
```

However, if you're using Island Architecture and require several AsyncStorage-persisted units of State, a factory can be created for automatically applying the `AsyncStorageMiddleware`

```typescript
import { State, type Middleware } from "@figliolia/galena";
import { AsyncStorageMiddleware } from "@figliolia/galena-async-storage";

export const createPersistedState = <T>(
  name: string, 
  initialState: T, 
  middleware: [new AsyncStorageMiddleware()]
) => {
  const state = new State<T>(name, initialState);
  state.registerMiddleware(...middleware);
  return state;
}
```