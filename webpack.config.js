const path = require("path");

module.exports = {
  mode: "production", // Use "development" for debugging
  entry: "./src/index.ts", // Main TypeScript entry file
  output: {
    filename: "bundle.js", // Output file name
    path: path.resolve(__dirname, "dist"), // Output directory
  },
  resolve: {
    extensions: [".ts", ".js"], // Resolve TypeScript and JavaScript files
  },
  module: {
    rules: [
      {
        test: /\.ts$/, // Match TypeScript files
        use: "ts-loader", // Use ts-loader to compile
        exclude: /node_modules/,
      },
    ],
  },
};