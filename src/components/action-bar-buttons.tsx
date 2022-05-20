import { Action } from "../state/actions";

interface ActionBarButtonsProps {
  actionIcon: string;
  onClick(): Action;
}

const ActionBarButtons: React.FC<ActionBarButtonsProps> = ({
  actionIcon,
  onClick,
}) => {
  return (
    <button className='button is-primary is-small' onClick={onClick}>
      <span className='icon'>
        <i className={actionIcon}></i>
      </span>
    </button>
  );
};

export default ActionBarButtons;
