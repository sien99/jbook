import * as esbuild from "esbuild-wasm";
import { useEffect, useRef, useState } from "react";

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
      wasmURL: "/esbuild.wasm",
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

    const res = await ref.current.transform(input, {
      loader: "jsx",
      target: "es2015",
    });

    setCode(res.code);
  };

  return (
    <div className='App'>
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
