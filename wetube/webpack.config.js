const path = require("path");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const BASE_JS = "./src/client/js/";

module.exports = {
    entry: {
        main : BASE_JS + "main.js",
        videoPlayer:BASE_JS + "videoPlayer.js",
        recorder:BASE_JS + "recorder.js",
        commentSection:BASE_JS + "commentSection.js",
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "css/styles.css",
        }),
    ],
    output: {
        filename: "js/[name].js",
        // [name]을 주면 entry에 있는 이름을 가져와서 파일로 만들것이다.
        path: path.resolve(__dirname, "assets"),
        clean: true,
        // output folder를 build 시작하기 전에 clean 해주는 것을 말한다.
    },
    module: {
        rules:[
            {
                test: /\.js$/,
                use: { 
                    loader : "babel-loader",
                    options: {
                        presets: [["@babel/preset-env", {targets: "defaults"}]],
                    },
                },
                // js파일을 바벨로더라는 로더로 가공하는 것이다.
                // 웹팩은 노드모듈 폴더에서 바벨로더를 찾아 옵션을 전달하는것이다.
            },
            {
                test:/\.scss$/,
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
            }
        ],
    }
};