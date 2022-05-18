import * as esbuild from "esbuild-wasm";

//**  1. Override Esbuild Natural process that trying to access file system
export const unpkgPathPlugin = () => {
  return {
    name: "unpkg-path-plugin", //identify
    // Build: Bundling process find files, load > parse > transpiling > join
    setup(build: esbuild.PluginBuild) {
      //* Case 1: Handle root entry file of 'index.js'
      build.onResolve({ filter: /(^index\.js$)/ }, () => {
        return { path: "index.js", namespace: "a" };
      });

      //* Case 2: Handle relative path in a module (./ && ../)
      build.onResolve({ filter: /^\.+\// }, (args: any) => {
        // new URL(args.path, args.importer + "/") - URL constructor (built-in node pkg)
        return {
          namespace: "a",
          path: new URL(
            args.path,
            // resolveDir: "/nested-test-pkg@1.0.0/src"
            "https://unpkg.com" + args.resolveDir + "/"
          ).href,
        };
      });

      //* Default case: Handle main file of a module
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        return { namespace: "a", path: `https://unpkg.com/${args.path}` };
      });
    },
  };
};
