import { include } from '@material-appkit/core/util/path';

const paths = {
  index: '/',

  reference: include('/reference', {
    index: '/',
  }),
};

export default paths;
