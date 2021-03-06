const DEFAULT_STACK_SIZE = 32;

/**
 *
 * @summary
 * A utility class used to walk a tree using a depth-first tree traversal.
 */
export default class TreeEnumerator {
  /**
   * @constructor
   * @param {Object} root
   * Tree-like object to be traversed
   */
  constructor(root) {
    this.root = root;

    this.stackSize = DEFAULT_STACK_SIZE;
    this.stack = new Array(this.stackSize);
    this.stackIndex = null;

    this.reset();
  }


  /**
   * @summary
   * Return the item at the current cursor position, then advance cursor to the next item
   *
   * @returns {*}
   */
  nextObject() {
    while (this.stackIndex >= 0) {
      const top = this.stack[this.stackIndex];
      const children = top.node.children;

      // If the top node has not been visited (viz. index == -1) then mark its first child as the
      // next node to visit and return the node...
      if (top.index < 0) {
        top.index = 0;
        return top.node;
      }

      // If all children of the top node have been visited then remove it from the stack and continue;
      // otherwise push a new stack element corresponding to its next child (allocating/reallocating
      // the stack if necessary).
      if (!children || top.index === children.length) {
        --this.stackIndex;
      } else {
        const child = children[top.index++];
        this.stack[++this.stackIndex] = { node: child, index: -1 };
      }
    }

    return null;
  }


  /**
   * @summary
   * Return the cursor to the beginning of the collection
   */
  reset() {
    this.stack[0] = { node: this.root, index: -1 };
    this.stackIndex = 0;
  }
}
