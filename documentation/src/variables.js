import PropTypes from 'prop-types';

export const BREAKPOINTS = ['xs', 'sm', 'md', 'lg', 'xl'];

// ----------------------------------------------------------------------------------
// ERROR MESSAGES
// ----------------------------------------------------------------------------------
export const E_REQUEST_ABORTED = 'AbortError';

export const DEFAULT_NOTISTACK_OPTIONS = {
  anchorOrigin: { horizontal: 'center', vertical: 'top' },
  autoHideDuration: 2000,
  variant: 'info',
};

export const COMMON_PAGE_PROPS = {
  data: PropTypes.object,
  location: PropTypes.object,
  pageContext: PropTypes.object,
};
