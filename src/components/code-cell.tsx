import { useEffect, useState } from "react";
import bundle from "../bundler";
import CodeEditor from "./code-editor";
import Preview from "./preview";
import Resizable from "./resizable";

const CodeCell = () => {
  // to refer on specific var in fx component
  const [input, setInput] = useState("");
  const [err, setErr] = useState("");
  const [code, setCode] = useState("");

  // Implement debouncing logic for code bundling
  useEffect(() => {
    // return identifier for the timer function we create
    const timer = setTimeout(async () => {
      //build
      const output = await bundle(input);
      setCode(output.code);
      setErr(output.err);
    }, 1000);

    // cancel previous timer function once input changes
    return () => clearTimeout(timer);
  }, [input]);

  const initValue = `// 1. Syntax Error: dwewhjdfwejyfd\n// 2. Runtime Error: invalidfunction()\n// 3. Asynchronous Error: setTimeout(()=>{error},1000)
  `;

  return (
    <Resizable direction='vertical'>
      <div style={{ height: "100%", display: "flex", flexDirection: "row" }}>
        <Resizable direction='horizontal'>
          <CodeEditor
            initialValue={initValue}
            onChange={(value) => setInput(value)}
          />
        </Resizable>
        <Preview code={code} err={err} />
      </div>
    </Resizable>
  );
};

export default CodeCell;
