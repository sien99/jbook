import { ActionType } from "./action-types/index";
import { store } from "./store";
// const state = store.getState();
// const test = state.cells.data

store.dispatch({
  type: ActionType.INSERT_CELL_BEFORE,
  payload: {
    id: null,
    type: "code",
  },
});
store.dispatch({
  type: ActionType.INSERT_CELL_BEFORE,
  payload: {
    id: null,
    type: "text",
  },
});
store.dispatch({
  type: ActionType.INSERT_CELL_BEFORE,
  payload: {
    id: null,
    type: "text",
  },
});

const [id, id2, id3] = store.getState().cells.order;

console.log(id, id2, id3);

store.dispatch({
  type: ActionType.MOVE_CELL,
  payload: {
    id: id,
    direction: "down",
  },
});

store.dispatch({
  type: ActionType.DELETE_CELL,
  payload: id2,
});

store.dispatch({
  type: ActionType.UPDATE_CELL,
  payload: {
    id: id3,
    content: "Hi, I'm updated",
  },
});

console.log(store.getState());
