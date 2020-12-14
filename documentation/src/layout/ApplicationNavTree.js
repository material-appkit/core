import PropTypes from 'prop-types';
import React from 'react';

import { Link as GatsbyLink } from 'gatsby';

import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';

import SitemapData from 'data/sitemap.json';

const styles = makeStyles((theme) => ({
  d1Label: {
    fontSize: theme.typography.pxToRem(16),
    padding: theme.spacing(0.5, 2),
  },
  d1IconContainer: {
    display: 'none',
  },

  d2Label: {
    fontSize: theme.typography.pxToRem(14),
    padding: theme.spacing(0.25, 0),
  },

  link: {
    color: theme.palette.text.primary,
    textDecoration: 'none',
  },
}));

function ApplicationNavTree({ location }) {
  const classes = styles();

  // const handleNodeLabelClick = (e, selectedNode, nodeIndexPath) => {
  //   const indices = nodeIndexPath.split('.');
  //
  //   let node = SitemapData;
  //   let path = '';
  //   indices.forEach((pathIndex, i) => {
  //     node = node[parseInt(pathIndex)];
  //     path = `${path}/${node.path}`;
  //     if (i < indices.length - 1) {
  //       node = node.children;
  //     }
  //   });
  //
  //   navigate(path);
  // };

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
      path = `${path}/${node.path}`;
      if (i < indices.length - 1) {
        currentNode = currentNode.children;
      }
    });

    return (
      <TreeItem
        classes={{
          iconContainer: classes[`d${depth}IconContainer`],
          label: classes[`d${depth}Label`],
        }}
        component={GatsbyLink}
        to="/foobar"
        key={nodeIndexPath}
        label={(
          <GatsbyLink
            className={classes.link}
            component={Link}
            to={path}
          >
            {node.name}
          </GatsbyLink>
        )}
        nodeId={nodeIndexPath}
      >
        {children}
      </TreeItem>
    );
  };

  return (
    <TreeView
      expanded={['2', '4', '5']}
      selected={[]}
    >
      {SitemapData.map((rootNode, rootNodeIndex) => renderTree(rootNode, `${rootNodeIndex}`, 1))}
    </TreeView>
  );
}

ApplicationNavTree.propTypes = {
  location: PropTypes.object.isRequired,
};

export default ApplicationNavTree;
