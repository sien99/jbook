import { RootState } from "../state/reducers/index";
import { useSelector, TypedUseSelectorHook } from "react-redux";

// Component get type information for state stored in redux store from useTypedSelector
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
