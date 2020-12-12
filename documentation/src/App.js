import intl from 'react-intl-universal';
import isEqual from 'lodash.isequal';

import PropTypes from 'prop-types';

import React, { Suspense } from 'react';
import { Router, Route, Switch } from 'react-router-dom';

import { Helmet, HelmetProvider } from 'react-helmet-async';

import withWidth from '@material-ui/core/withWidth';

import NavManager from '@material-appkit/core/managers/NavManager';
import { filterByKeys } from '@material-appkit/core/util/object';

import PlaceholderLayout from 'layout/PlaceholderLayout';

import AppContext from 'AppContext';
import paths from 'paths';
import { activeLocale } from 'util/shortcuts';

import {
  DEFAULT_LOCALE,
  LOCALE_CHOICES,
  LOCALE_INFO_MAP,
} from 'variables';

class App extends React.PureComponent {
  constructor(props) {
    super();

    this.layoutRoutes = [{
      pathname: paths.index,
      Component: React.lazy(() => import('./layout/MainLayout')),
      placeholder: <PlaceholderLayout />,
    }];

    this.state = {
      layoutConfig: null,

      appContext: {
        loadProgress: null,
        locale: activeLocale(),
        pageTitle: null,
        update: this.updateAppContext,
      },
    };
  }


  componentDidMount() {
    const intl_locales = {};
    LOCALE_CHOICES.forEach((locale) => {
      intl_locales[locale] = LOCALE_INFO_MAP[locale].source;
    });

    let currentLocale = this.state.appContext.locale;
    if (!LOCALE_CHOICES[currentLocale]) {
      currentLocale = DEFAULT_LOCALE;
    }

    intl.init({
      currentLocale,
      locales: intl_locales,
      fallbackLocale: DEFAULT_LOCALE,
    });
  }


  updateAppContext = (context) => {
    const appContext = this.state.appContext;

    const filteredContext = filterByKeys(appContext, Object.keys(context));

    if (!isEqual(filteredContext, context)) {
      const updatedContext = {...appContext, ...context };
      this.setState({ appContext: updatedContext });
    }
  };


  layoutDidMount = (layoutConfig) => {
    this.setState({ layoutConfig });
  };


  layoutWillUnmount = () => {
    this.setState({ layoutConfig: null });
  };


  get pageTitle() {
    const { pageTitle } = this.state.appContext;

    let pageTitleComponents = [];
    if (pageTitle) {
      if (Array.isArray(pageTitle)) {
        pageTitleComponents = [...pageTitle];
      } else {
        pageTitleComponents = [pageTitle];
      }
    }
    pageTitleComponents.push('Material AppKit');

    return pageTitleComponents.join(' | ');
  }

  render() {
    const appContext = {
      ...this.state.appContext,
      breakpoint: this.props.width,
    };

    return (
      <AppContext.Provider value={appContext}>
        <Router history={NavManager.history}>
          <HelmetProvider>
            <Helmet>
              <link rel="canonical" href="https://admin.motostar.ca/" />
              <title>{this.pageTitle}</title>
            </Helmet>

            <Switch>
              {this.layoutRoutes.map((routeInfo) => (
                <Route
                  key={routeInfo.pathname}
                  path={routeInfo.pathname}
                  render={(routeProps) => (
                    <Suspense fallback={routeInfo.placeholder}>
                      <routeInfo.Component
                        onMount={this.layoutDidMount}
                        onUnmount={this.layoutWillUnmount}
                        {...this.props}
                        {...routeProps}
                      />
                    </Suspense>
                  )}
                />
              ))}
            </Switch>
          </HelmetProvider>
        </Router>
      </AppContext.Provider>
    );
  }
}

App.propTypes = {
  width: PropTypes.string.isRequired,
};

export default withWidth()(App);
