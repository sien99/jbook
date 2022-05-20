import React, { useEffect, useState } from "react";
import bundle from "../bundler";
import { useActions } from "../hooks/use-actions";
import { Cell } from "../state";
import CodeEditor from "./code-editor";
import Preview from "./preview";
import Resizable from "./resizable";

interface CodeCellProps {
  cell: Cell;
}

const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  // to refer on specific var in fx component
  const [err, setErr] = useState("");
  const [code, setCode] = useState("");
  const { updateCell } = useActions();

  // Implement debouncing logic for code bundling
  useEffect(() => {
    // return identifier for the timer function we create
    const timer = setTimeout(async () => {
      //build
      const output = await bundle(cell.content);
      setCode(output.code);
      setErr(output.err);
    }, 750);

    // cancel previous timer function once input changes
    return () => clearTimeout(timer);
  }, [cell.content]);

  const initValue = `// 1. Syntax Error: dwewhjdfwejyfd\n// 2. Runtime Error: invalidfunction()\n// 3. Asynchronous Error: setTimeout(()=>{error},1000)
  `;

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
            initialValue={initValue}
            onChange={(value) => {
              updateCell(cell.id, value);
            }}
          />
        </Resizable>
        <Preview code={code} err={err} />
      </div>
    </Resizable>
  );
};

export default CodeCell;
