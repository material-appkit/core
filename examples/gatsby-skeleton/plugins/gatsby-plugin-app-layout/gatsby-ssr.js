import React from 'react';
import PropTypes from 'prop-types';
import AppThemeProvider from './AppThemeProvider';

export const wrapRootElement = ({ element }) =>
	<AppThemeProvider>
		{element}
	</AppThemeProvider>;

wrapRootElement.propTypes = {
	element: PropTypes.node
};
