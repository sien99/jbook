import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators } from "../state";

// to simplify the process of dispatching actions from components
export const useActions = () => {
  const dispatch = useDispatch();

  // prevent client side keep re-rendering due to change of bindActionCreators (due to useEffects)
  // bindActionCreators actually has not change in content, can useMemo to prevent unnecessary rerendering
  return useMemo(() => {
    return bindActionCreators(actionCreators, dispatch);
  }, [dispatch]);
};

//* In Components:
// Define: const { updateCells } = useActions();
// Call: updateCells(...args);
