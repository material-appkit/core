const path = require('path');

require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});

const gaTrackingId = process.env.GATSBY_GOOGLE_ANALYTICS_TRACKING_ID;


module.exports = {
  siteMetadata: {
    title: process.env.GATSBY_APP_TITLE,
    description: 'An app skeleton to kickstart app development with Material-AppKit and Gatsby',
  },
  plugins: [
    //--------------------------------------------------------------------------
    'gatsby-plugin-preact',
    //--------------------------------------------------------------------------
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        background_color: '#fafafa',
        cache_busting_mode: 'none',
        display: 'standalone',
        icon: 'src/images/application-logo.png',
        name: process.env.GATSBY_APP_TITLE,
        theme_color: '#fff',
        short_name: process.env.GATSBY_APP_TITLE,
        start_url: '/',
      }
    },
    'gatsby-plugin-remove-serviceworker',
    // {
    //   resolve: 'gatsby-plugin-offline',
    //   options: {
    //     precachePages: ['/vehicles', '/sold-row'],
    //     workboxConfig: {
    //       globIgnores: ['sw-update-manager.js'],
    //       globPatterns: ['**/*'],
    //       skipWaiting: false,
    //     },
    //   },
    // },

    //--------------------------------------------------------------------------
    {
      resolve: 'gatsby-plugin-google-analytics',
      options: {
        // The property ID; the tracking code won't be generated without it
        trackingId: gaTrackingId,
        // Defines where to place the tracking script - 'true' in the head and 'false' in the body
        head: false,
        // Setting this parameter is optional
        anonymize: true,
        // Setting this parameter is also optional
        respectDNT: false,
        // Defers execution of google analytics script after page load
        defer: false,
        // This setting determines how often site speed beacons will be sent.
        // By default, 1% of users will be automatically be measured.
        siteSpeedSampleRate: 10,
      },
    },

    //--------------------------------------------------------------------------
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: `${__dirname}/src/images/`,
      },
    },

    //--------------------------------------------------------------------------
    'gatsby-plugin-sharp',

    //--------------------------------------------------------------------------
    'gatsby-transformer-sharp',

    //--------------------------------------------------------------------------
    'gatsby-plugin-app-layout',
    'gatsby-plugin-material-ui',

    //--------------------------------------------------------------------------
    'gatsby-plugin-react-helmet-async',

    //--------------------------------------------------------------------------
    {
      resolve: 'gatsby-plugin-load-script',
      options: {
        src: '/noie.js',
      },
    },
  ],
};
