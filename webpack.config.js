// webpack.config.js
const VueLoaderPlugin = require("vue-loader/lib/plugin");
var path = require("path");

module.exports = {
  mode: "development",
  watch: true,
  entry: {
    index: "./src/index.js",
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader",
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
      },
      {
        test: /\.s[ac]ss|.css$/i,
        use: ["vue-style-loader", "css-loader", "sass-loader"],
      },
    ],
  },
  plugins: [new VueLoaderPlugin()],
  resolve: {
    alias: {
      "vue$": "vue/dist/vue.esm.js",
    },
  },
  devServer: {
    static: path.join(__dirname, "dist"),
    compress: true,
    port: 9000,
  },
};
