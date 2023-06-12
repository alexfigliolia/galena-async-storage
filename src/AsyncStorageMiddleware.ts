import type { State } from "@figliolia/galena";
import { Middleware } from "@figliolia/galena";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Device Storage Middleware
 *
 * A Galena middleware that persists your State using `AsyncStorage`
 *
 * ```typescript
 * import { State } from "@figliolia/galena";
 * import { DeviceStorageMiddleware } from "@figliolia/galena-async-storage";
 * import AsyncStorage from "@react-native-async-storage/async-storage";
 *
 * const MyState = new State("User", await AsyncStorage.getItem("User") || {
 *   token: "",
 *   username: ""
 * });
 *
 * MyState.registerMiddleware(new DeviceStorageMiddleware());
 *
 * MyState.update(state => {
 *   state.username = "Bob Dylan";
 *   state.token = "Authentication token";
 * });
 *
 * const UserState = await AsyncStorage.getItem("User");
 * {
 *   username: "Bob Dylan",
 *   token: "Authentication token"
 * }
 * ```
 */
export class DeviceStorageMiddleware<
  T extends string | number | boolean | Record<string, any>,
> extends Middleware<T> {
  override onUpdate(state: State<T>) {
    void AsyncStorage.setItem(state.name, this.stringify(state.getState()));
  }

  private stringify(nextState: Readonly<T>) {
    if (typeof nextState === "string") {
      return nextState;
    }
    return JSON.stringify(nextState);
  }
}
