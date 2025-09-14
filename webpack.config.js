const path = require("path");
const webpack = require("webpack");

module.exports = {
  mode: "production",
  devtool: "source-map",
  entry: "./client/index.js",
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ["babel-loader"],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  output: {
    path: path.join(__dirname, "public/dist"),
    filename: "bundle.min.js",
    clean: true,
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("production"),
    }),
  ],
};
