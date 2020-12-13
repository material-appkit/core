/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const path = require('path');
const webpack = require('webpack');

exports.onCreateWebpackConfig = ({ getConfig, stage, actions }) => {
  const extraWebpackConfig = {
    plugins: [
      // Required if using superagent due to build issues
      // See: https://github.com/gatsbyjs/gatsby/issues/2615
      // new webpack.DefinePlugin({ "global.GENTLY": false })
    ],
    resolve: {
      modules: [
        path.resolve(__dirname, 'src'),
        'node_modules',
      ],
      symlinks: false,
    },
    target: 'web',
  };

  // Disable sourcemaps in production environment
  // See: http://blog.marcnuri.com/gatsby-disable-source-maps-production/
  if (getConfig().mode === 'production') {
    extraWebpackConfig.devtool = false;
  }

  actions.setWebpackConfig(extraWebpackConfig);
};


// Implement the Gatsby API “onCreatePage”. This is
// called after every page is created.

// page.matchPath is a special key that's used for matching pages
// with corresponding routes only on the client.
exports.onCreatePage = async ({ page, actions }) => {
  const { createPage } = actions;

  if (page.path.match(/^\/vehicle\/(.*)/)) {
    page.matchPath = "/vehicle/:uuid";
    createPage(page);
  }

  if (page.path.match(/^\/campaign\/(.*)/)) {
    page.matchPath = "/campaign/:uuid";
    createPage(page);
  }

  if (page.path.match(/^\/campaign-item\/(.*)/)) {
    page.matchPath = "/campaign-item/:uuid";
    createPage(page);
  }

  if (page.path.match(/^\/sign-up\/activate\/(.*)/)) {
    page.matchPath = "/sign-up/activate/:uid/:token";
    createPage(page);
  }

  if (page.path.match(/^\/set_password\/(.*)/)) {
    page.matchPath = "/set_password/:uid/:token";
    createPage(page);
  }
};
