const isSourceFile = (node) => {
  const { type, mediaType } = node.internal;

  if (type === 'File') {
    if (mediaType === 'text/jsx') {
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
  createContentDigest,
  ...rest
}) => {
  if (!isNodeSupported(node)) {
    return;
  }

  console.log(rest);

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
      type: "SourceFile",
    },
  };

  createNode(plainTextNode);

  createParentChildLink({
    parent: node,
    child: plainTextNode,
  });
};
