// Wrap all ESbuild bundling logic into this component
// functioned as transpiler for rawCode input, bundled code as output
import * as esbuild from "esbuild-wasm";
import { fetchPlugin } from "./plugins/fetch-plugin";
import { unpkgPathPlugin } from "./plugins/unpkg-path-plugin";

let service: esbuild.Service;
const bundle = async (rawCode: string) => {
  // Check: only start the service when it has not been init before
  if (!service) {
    // Dig inside public directories, find esbuild compiled binaries for access to webassembly service
    service = await esbuild.startService({
      worker: true,
      wasmURL: "https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm",
    });
  }
  try {
    const result = await service.build({
      entryPoints: ["index.js"],
      bundle: true,
      write: false,
      //** 3. Refactor plugins codes
      plugins: [unpkgPathPlugin(), fetchPlugin(rawCode)],
      // TLDR: Define unreachable code, https://esbuild.github.io/api/#define
      //! https://github.com/evanw/esbuild/issues/583#issuecomment-740131498
      define: {
        "process.env.NODE_ENV": '"production"', //!if (process.env.NODE_ENV !== "production") ...
        global: "window",
      },
    });

    return {
      code: result.outputFiles[0].text,
      err: "",
    };
  } catch (err) {
    return {
      code: "",
      // @ts-ignore
      err: err.message,
    };
  }
};

export default bundle;
