import * as esbuild from "esbuild-wasm";
import axios from "axios";
import localForage from "localforage";

const fileCache = localForage.createInstance({
  name: "filecache",
});

export const fetchPlugin = (inputCode: string) => {
  return {
    name: "fetch-plugin",
    setup(build: esbuild.PluginBuild) {
      //* Load case: index.js
      build.onLoad({ filter: /(^index\.js$)/ }, () => {
        return {
          loader: "jsx",
          // import is es module, require is common js module
          contents: inputCode,
        };
      });

      //** 2. Caching using IndexDB
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        console.log(
          "Make use of the features of buildPlugin will run thru ALL onLoad function"
        );

        // check if cache available
        const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(
          args.path
        );
        if (cachedResult) {
          console.log("Cache Hit!");
          return cachedResult;
        } else {
          console.log("Cache Missed!");
        }
      });

      //* Load case: file ending with .css
      build.onLoad({ filter: /.css$/ }, async (args: any) => {
        const { data, request } = await axios.get(args.path);

        const escaped = data
          .replace(/\n/g, "") //replace newlines with empty ''
          .replace(/"/g, '\\"') //escape double quotes using \\
          .replace(/'/g, "\\'"); //escape single quotes using \\

        const contents = `
          const style = document.createElement('style')
          style.innerText = '${escaped}';
          document.head.appendChild(style);
          `;

        const result: esbuild.OnLoadResult = {
          loader: "jsx",
          contents,
          // new URL('./',"https://unpkg.com/nested-test-pkg@1.0.0/src/index.js")
          resolveDir: new URL("./", request.responseURL).pathname, // resolveDir is to communicate which dir to find the required file
        };

        // save response into cache where:
        // key:value = args.path:result={loader,contents,resolveDir}
        await fileCache.setItem(args.path, result);

        return result;
      });

      //* Default load case: main file of module
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        const { data, request } = await axios.get(args.path);

        const result: esbuild.OnLoadResult = {
          loader: "jsx",
          contents: data,
          // new URL('./',"https://unpkg.com/nested-test-pkg@1.0.0/src/index.js")
          resolveDir: new URL("./", request.responseURL).pathname, // resolveDir is to communicate which dir to find the required file
        };

        await fileCache.setItem(args.path, result);

        return result;
      });
    },
  };
};
