import React from 'react';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import ViewController from '@material-appkit/core/components/ViewController';

import { COMMON_PAGE_PROPS } from 'variables';

const styles = makeStyles((theme) => ({

}));

function IndexPage(props) {
  const classes = styles();

  return (
    <ViewController
      title="Welcome"
      {...props}
    >
      <Box component="main" p={2}>
        <Typography>Index Page</Typography>
      </Box>
    </ViewController>
  );
}

IndexPage.propTypes = COMMON_PAGE_PROPS;

export default IndexPage;
