import React, { useState } from 'react';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import ViewController from '@material-appkit/core/components/ViewController';

import { COMMON_PAGE_PROPS } from 'variables';

function WelcomePage(props) {
  const [title] = useState('Welcome');
  const [contextMenuItems] = useState(null);
  const [rightToolbarItem] = useState(null);

  return (
    <ViewController
      contextMenuItems={contextMenuItems}
      pageTitle={title}
      rightBarItem={rightToolbarItem}
      title={title}
      {...props}
    >
      <Box p={2}>
        <Typography variant="h1">
          Material AppKit Documentation
        </Typography>
      </Box>
    </ViewController>
  );
}

WelcomePage.propTypes = COMMON_PAGE_PROPS;

export default WelcomePage;
