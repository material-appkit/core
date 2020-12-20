const isSourceFile = (node) => {
  const { type, mediaType } = node.internal;

  if (type === 'File') {
    if (mediaType === 'text/jsx' || mediaType === 'application/x-sh') {
      return true;
    }
  }

  return false;
};


const isNodeSupported = (node) => {
  return isSourceFile(node);
};


exports.onCreateNode = async ({
  node,
  actions,
  loadNodeContent,
  createNodeId,
  createContentDigest
}) => {
  if (!isNodeSupported(node)) {
    return;
  }

  const { createNode, createParentChildLink } = actions;
  const content = await loadNodeContent(node);
  const id = createNodeId(`${node.id} >>> SourceFile`);

  const plainTextNode = {
    id,
    children: [],
    content,
    parent: node.id,
    internal: {
      contentDigest: createContentDigest(content),
      type: 'SourceFile',
    },
  };

  createNode(plainTextNode);

  createParentChildLink({
    parent: node,
    child: plainTextNode,
  });
};
