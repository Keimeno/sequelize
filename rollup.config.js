'use strict';

const { nodeResolve } = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const json = require('@rollup/plugin-json');
const nodePolyfills = require('rollup-plugin-node-polyfills');

const dialectsPackages = ['mysql2', 'tedious', 'pg', 'pg-hstore', 'sqlite3'];

module.exports = {
  input: 'index.js',
  output: {
    file: 'build/index.mjs',
    format: 'esm'
  },
  plugins: [
    json(),
    commonjs({
      esmExternals(id) {
        if (dialectsPackages.includes(id)) {
          return true;
        }

        return false;
      },
      dynamicRequireTargets: [
        ...dialectsPackages.map(
          dialectsPackage => `node_modules/${dialectsPackage}/*.js`
        )
      ]
    }),
    // resolves external dependencies
    nodeResolve({ preferBuiltins: false }),
    // polyfills node standard libraries
    nodePolyfills()
  ]
};
