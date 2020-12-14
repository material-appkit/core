import clsx from 'clsx';

import PropTypes from 'prop-types';
import React from 'react';

import { Link as GatsbyLink } from 'gatsby';

import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import SitemapData from 'data/sitemap.json';

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

  const renderTree = (node, nodeIndexPath, depth) => {
    let children = null;
    if (Array.isArray(node.children)) {
      children = node.children.map((node, childIndex) => (
        renderTree(node, `${nodeIndexPath}.${childIndex}`, depth + 1)
      ));
    }

    const indices = nodeIndexPath.split('.');
    let currentNode = SitemapData;
    let path = '';
    indices.forEach((pathIndex, i) => {
      currentNode = currentNode[parseInt(pathIndex)];
      path = `${path}/${currentNode.path}`;
      if (i < indices.length - 1) {
        currentNode = currentNode.children;
      }
    });

    return (
      <TreeItem
        classes={{
          // iconContainer: classes[`d${depth}IconContainer`],
        }}
        key={nodeIndexPath}
        label={(
          <Link
            color="textPrimary"
            component={GatsbyLink}
            className={clsx(classes.link, classes[`d${depth}Link`])}
            to={path}
            underline="hover"
          >
            {node.name}
          </Link>
        )}
        nodeId={nodeIndexPath}
      >
        {children}
      </TreeItem>
    );
  };

  return (
    <TreeView
      className={classes.treeView}
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      defaultExpanded={['1', '2', '3']}
    >
      {SitemapData.map((rootNode, rootNodeIndex) =>
        renderTree(rootNode, `${rootNodeIndex}`, 1)
      )}
    </TreeView>
  );
}

ApplicationNavTree.propTypes = {
  location: PropTypes.object.isRequired,
};

export default ApplicationNavTree;
