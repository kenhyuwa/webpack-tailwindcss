const path = require('path');
const fs = require('fs');
const { ProgressPlugin } = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BeautifyHtmlWebpackPlugin = require('beautify-html-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const { src, dest } = require('./config');

const HTML = (dir) => {
  const directory = `${src.pages}/${dir}`;
  const files = fs.readdirSync(path.resolve(__dirname, directory));
  return files.map((item) => {
    const [name, extension] = item.split('.');
    return new HtmlWebpackPlugin({
      title: name.charAt(0).toUpperCase() + name.slice(1),
      filename: `${dir}/${name}.html`,
      template: path.resolve(__dirname, `${directory}/${name}.${extension}`),
    });
  });
};

module.exports = (env, argv) => ({
  mode: argv.mode || 'development',
  entry: {
    index: `${src.js}/app.js`,
  },
  output: {
    filename: `${dest.js}/[name]-[contenthash:8].js`,
    path: path.resolve(__dirname, dest.dist),
    clean: true,
    publicPath: '/',
  },
  devServer: {
    contentBase: path.resolve(__dirname, dest.dist),
    open: true,
  },
  devtool: argv.mode === 'production' ? false : 'inline-source-map',
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'node_modules/'),
      '~@': path.resolve(__dirname, './src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          'eslint-loader',
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        ],
      },
      {
        test: /\.s?css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  [
                    'postcss-preset-env',
                    {
                      // Options
                    },
                  ],
                ],
              },
            },
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },
  optimization: {
    minimizer: [
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: [
            'default',
            {
              discardComments: { removeAll: true },
            },
          ],
        },
      }),
      new TerserPlugin(),
    ],
  },
  plugins: [
    new ProgressPlugin(),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Dashboard',
      filename: 'index.html',
      template: path.resolve(__dirname, `${src.pages}/index.html`),
    }),
    new MiniCssExtractPlugin({
      filename: `${dest.css}/app-[contenthash:8].css`,
    }),
    new BeautifyHtmlWebpackPlugin(),
  ].concat(HTML('components')),
});
