import React, { useState } from 'react';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import ViewController from '@material-appkit/core/components/ViewController';

import { NAVIGATION_CONTROLLER_PAGE_PROPS } from 'variables';

function ReferenceIndexPage(props) {
  const [contextMenuItems] = useState(null);
  const [rightToolbarItem] = useState(null);

  return (
    <ViewController
      contextMenuItems={contextMenuItems}
      rightBarItem={rightToolbarItem}
      title="Reference"
      {...props}
    >
      <Box component="main" p={2}>
        <Typography variant="h1">
          Material AppKit Documentation
        </Typography>
      </Box>
    </ViewController>
  );
}

ReferenceIndexPage.propTypes = NAVIGATION_CONTROLLER_PAGE_PROPS;

export default ReferenceIndexPage;
