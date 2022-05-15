import * as esbuild from "esbuild-wasm";
import { useEffect, useRef, useState } from "react";
import { fetchPlugin } from "./plugins/fetch-plugin";
import { unpkgPathPlugin } from "./plugins/unpkg-path-plugin";

function App() {
  // to refer on specific var in fx component
  const ref = useRef<any>();
  const [input, setInput] = useState("");
  const [code, setCode] = useState("");

  const startService = async () => {
    // dig inside public directory, find esbuild compiled binaries
    // access to webassembly service
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: "https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm",
    });

    //#region output:
    // {build: ƒ, serve: ƒ, transform: ƒ, stop: ƒ}
    //   build: S => (g(), $.build(S))
    //   serve: ƒ serve(S, k)
    //   stop: ƒ stop()
    //   transform: ƒ transform(S, k};
    //#endregion
  };

  useEffect(() => {
    startService();
  }, []);

  const onClick = async () => {
    if (!ref.current) return;

    //build
    const result = await ref.current.build({
      entryPoints: ["index.js"],
      bundle: true,
      write: false,
      //** 3. Refactor plugins codes
      plugins: [unpkgPathPlugin(), fetchPlugin(input)],
      // TLDR: Define unreachable code, https://esbuild.github.io/api/#define
      //! https://github.com/evanw/esbuild/issues/583#issuecomment-740131498
      define: {
        "process.env.NODE_ENV": '"production"', //!if (process.env.NODE_ENV !== "production") ...
        global: "window",
      },
    });
    console.log(result);
    setCode(result.outputFiles[0].text);

    // trycatch can't handle async function
    (async (result) => {
      try {
        eval(result.outputFiles[0].text);
      } catch (error) {
        alert(error);
      }
    })(result);
  };

  return (
    <div className='App'>
      <h1>Mini Transpiler</h1>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}></textarea>
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      <pre>{code}</pre>
    </div>
  );
}

export default App;
