import { include } from '@material-appkit/core/util/path';

export default {
  index: '/',

  error: include('/', {
    critical: '500',
    nonCritical: '404',
  }),
};
