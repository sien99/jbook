import "./code-cell.css";
import React, { useEffect } from "react";
import { useActions } from "../hooks/use-actions";
import { useTypedSelector } from "../hooks/use-typed-selector";
import { Cell } from "../state";
import CodeEditor from "./code-editor";
import Preview from "./preview";
import Resizable from "./resizable";

interface CodeCellProps {
  cell: Cell;
}

const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  const { updateCell, createBundle } = useActions();
  const bundle = useTypedSelector((state) => state.bundles[cell.id]);

  // Implement debouncing logic for code bundling
  useEffect(() => {
    //* to handle first time unnecessary 750ms wait or 2 times rerender
    //! cons: getting nasty deps error on eslint
    if (!bundle) {
      createBundle(cell.id, cell.content);
      return;
    }
    // return identifier for the timer function we create
    const timer = setTimeout(async () => {
      createBundle(cell.id, cell.content); //build
    }, 750);

    // cancel previous timer function once input changes
    return () => clearTimeout(timer);
    // eslint-disable-next-line
  }, [cell.id, cell.content, createBundle]);

  const initValue = "//Write Your Code Here";

  return (
    <Resizable direction='vertical'>
      <div
        style={{
          height: "calc(100% - 10px)",
          display: "flex",
          flexDirection: "row",
        }}>
        <Resizable direction='horizontal'>
          <CodeEditor
            initialValue={cell.content || initValue}
            onChange={(value) => {
              updateCell(cell.id, value);
            }}
          />
        </Resizable>
        {/* Code Preview will not render when:
        1. Initial undefined state due to 750ms loading period
        2. Bundling process is loading  */}

        {!bundle || bundle.loading ? (
          <div className='progress-cover'>
            <progress className='progress is-small is-primary' max='100'>
              Loading
            </progress>
          </div>
        ) : (
          <Preview code={bundle.code} err={bundle.err} />
        )}
      </div>
    </Resizable>
  );
};

export default CodeCell;
