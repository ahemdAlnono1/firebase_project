const path = require("path");

module.exports = {
    mode : "development", 
    entry : "./src/index.js",// to put main js code and make webpack look into it
    output : {
        path : path.resolve(__dirname, "dist"),// the out put of the entry file
        filename: "bundle.js"
    },
    watch : true
}