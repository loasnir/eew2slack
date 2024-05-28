const webpack = require("webpack");
const GasPlugin = require("gas-webpack-plugin");
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = {
  mode: "development",
  entry: "./src/index.ts",

  module: {
    rules: [
      {
        test: /\.ts/,
        use: "ts-loader",
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  plugins: [
    new GasPlugin(),
    new ESLintPlugin({
      extensions: ['.ts', '.js'],
      exclude: 'node_modules'
    }),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify([])
    })
  ],
};
