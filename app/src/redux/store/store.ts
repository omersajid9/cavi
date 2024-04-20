import {
  combineReducers
} from "redux";
import {
  configureStore,
  getDefaultMiddleware
} from "@reduxjs/toolkit";
import {
  createHashHistory
} from "history";
import {
  createReduxHistoryContext
} from "redux-first-history";
import undoable from "easy-redux-undo";
import copyReducer from "../components/copy/copySlice";
import counterReducer from "../components/counter/counterSlice";
import complexReducer from "../components/complex/complexSlice";
import searchReducer from "../components/search/searchSlice";

const {
  routerMiddleware,
  createReduxHistory,
  routerReducer
} = createReduxHistoryContext({
  history: createHashHistory()
});

export const store = configureStore({
  reducer: combineReducers({
    router: routerReducer,
    copy: undoable(
      combineReducers({
        copy: copyReducer
      })
    ),
    // copy: copyReducer,
    search: searchReducer,
    // undoable: undoable(
    //   combineReducers({
    //     counter: counterReducer,
    //     complex: complexReducer
    //   })
    // )
  }),
  middleware: [...getDefaultMiddleware({
    serializableCheck: false
  }), routerMiddleware]
});

export const history = createReduxHistory(store);

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;