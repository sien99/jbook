import axios from "axios";
import * as esbuild from "esbuild-wasm";

//* Override Esbuild Natural process that trying to access file system
export const unpkgPathPlugin = () => {
  const pkgReq = "axios"; //s,m,nested-test-pkg
  return {
    name: "unpkg-path-plugin", //identify
    // Build: Bundling process find files, load > parse > transpiling > join
    setup(build: esbuild.PluginBuild) {
      //* onResolve figure out where index.js file store
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        console.log("onResolve", args);
        if (args.path === "index.js")
          return { path: args.path, namespace: "a" };

        // handle ./utils, ../utils using URL constructor (built-in node pkg)
        if (args.path.includes("./") || args.path.includes("../")) {
          // console.log(new URL(args.path, args.importer + "/"));

          return {
            namespace: "a",
            // must include +'./' at the end of importer: "https://unpkg.com/medium-test-pkg"
            // new URL generate a whole obj, we need only href property
            path: new URL(
              args.path,
              // resolveDir: "/nested-test-pkg@1.0.0/src"
              "https://unpkg.com" + args.resolveDir + "/"
            ).href,
          };
        }

        return { namespace: "a", path: `https://unpkg.com/${args.path}` };
      });
      //* onLoad attempt to load the index.js / any file
      //! https://github.com/evanw/esbuild/issues/583#issuecomment-740131498
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        console.log("onLoad", args);
        // when esbuild intended to load index.js file
        // redirect it to loaded payload
        if (args.path === "index.js") {
          // esbuild found 'index.js' file, parse it & find any import/require/exports
          // eg. import message from './message'; => run onResolve step again
          return {
            loader: "jsx",
            // import is es module, require is common js module
            contents: `
             const pkg1 = require('${pkgReq}');
             import React from 'react';
             console.log(pkg1,react);
           `,
          };
          // when reading file from directory not index.js, load contents here
        }

        const { data, request } = await axios.get(args.path);

        // resolveDir is to communicate which dir to find the required file
        // onResolve retrieved payload with prop:resolveDir
        return {
          loader: "jsx",
          contents: data,
          // new URL('./',"https://unpkg.com/nested-test-pkg@1.0.0/src/index.js")
          resolveDir: new URL("./", request.responseURL).pathname,
        };
      });
    },
  };
};
