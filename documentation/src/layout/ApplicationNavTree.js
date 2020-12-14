import clsx from 'clsx';

import PropTypes from 'prop-types';
import React, { useContext, useState } from 'react';

import { Link as GatsbyLink } from 'gatsby';

import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import AppContext from 'AppContext';

const styles = makeStyles((theme) => ({
  treeView: {
    paddingLeft: theme.spacing(1),
  },

  d1Link: {
    fontSize: theme.typography.pxToRem(18),
    padding: theme.spacing(0.5, 0),
  },

  d2Link: {
    fontSize: theme.typography.pxToRem(16),
    padding: theme.spacing(0.25, 0),
  },

  d3Link: {
    fontSize: theme.typography.pxToRem(14),
    padding: theme.spacing(0.25, 0),
  },

  link: {
    display: 'block',
  },
}));

function ApplicationNavTree({ location }) {
  const classes = styles();
  const context = useContext(AppContext);
  const { sitemap } = context;

  const [selectedNodeId] = useState(null);


  const renderTree = (node, depth) => {
    return (
      <TreeItem
        key={node.id}
        label={(
          <Link
            color="textPrimary"
            component={GatsbyLink}
            className={clsx(classes.link, classes[`d${depth}Link`])}
            to={node.url}
            underline="hover"
          >
            {node.name}
          </Link>
        )}
        nodeId={node.id}
      >
        {Array.isArray(node.children) && (
          node.children.map((childNode) => renderTree(childNode, depth + 1))
        )}
      </TreeItem>
    );
  };

  return (
    <TreeView
      className={classes.treeView}
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      defaultExpanded={['1', '1.2', '2', '3']}
      selected={selectedNodeId}
    >
      {sitemap.map((rootNode) => renderTree(rootNode, 1))}
    </TreeView>
  );
}

ApplicationNavTree.propTypes = {
  location: PropTypes.object.isRequired,
};

export default ApplicationNavTree;
