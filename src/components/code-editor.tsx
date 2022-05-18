import "./code-editor.css";
import MonacoEditor, { OnMount } from "@monaco-editor/react";
import prettier from "prettier";
import parser from "prettier/parser-babel"; //for JS code
import { useRef } from "react";

interface CodeEditorProps {
  initialValue: string;
  onChange(value: string): void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ onChange, initialValue }) => {
  const editorRef = useRef<any>();

  // getValue() return string that currently inside the editor
  const onEditorDidMount: OnMount = (monacoEditor, monaco) => {
    editorRef.current = monacoEditor;
    monacoEditor.onDidChangeModelContent(() => {
      onChange(editorRef.current.getValue());
    });

    monacoEditor.getModel()?.updateOptions({ tabSize: 2 });
  };

  const onFormatClick = () => {
    console.log(editorRef.current);
    //TODO: GET CURRENT VALUE FROM IDE
    const unformatted = editorRef.current.getModel().getValue();

    //TODO: FORMAT THAT VALUES
    const formatted = prettier
      .format(unformatted, {
        parser: "babel",
        plugins: [parser],
        useTabs: false,
        semi: true,
        singleQuote: true,
      })
      .replace(/\n$/, "");
    // remove the last line append after prettier, need to remove
    // it because we don't want to store this extra 1 line in user code

    //TODO: SET FORMATTED VALUE BACK TO IDE
    editorRef.current.setValue(formatted);
  };

  return (
    <div className='editor-wrapper'>
      <button
        className='button button-format is-primary is-small'
        onClick={onFormatClick}>
        Format
      </button>
      <MonacoEditor
        onMount={onEditorDidMount}
        value={initialValue}
        theme='vs-dark'
        language='javascript'
        height='100%'
        options={{
          wordWrap: "on",
          minimap: { enabled: false },
          showUnused: false,
          folding: false,
          lineNumbersMinChars: 3,
          fontSize: 16,
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  );
};

export default CodeEditor;
