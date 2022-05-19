import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators } from "../state";

// to simplify the process of dispatching actions from components
export const useActions = () => {
  const dispatch = useDispatch();

  return bindActionCreators(actionCreators, dispatch);
};

//* In Components:
// Define: const { updateCells } = useActions();
// Call: updateCells(...args);
