import "./action-bar.css";
import { useActions } from "../hooks/use-actions";
import ActionBarButtons from "./action-bar-buttons";

interface ActionBarProps {
  id: string;
}

const ActionBar: React.FC<ActionBarProps> = ({ id }) => {
  const { moveCell, deleteCell } = useActions();

  return (
    <div className='action-bar'>
      <ActionBarButtons
        actionIcon='fa fa-arrow-up'
        onClick={() => moveCell(id, "up")}
      />
      <ActionBarButtons
        actionIcon='fa fa-arrow-down'
        onClick={() => moveCell(id, "down")}
      />
      <ActionBarButtons
        actionIcon='fa fa-times'
        onClick={() => deleteCell(id)}
      />
    </div>
  );
};

export default ActionBar;
