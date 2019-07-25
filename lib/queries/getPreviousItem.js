// @flow
import { type Editor, type Block } from 'slate';
import type Options from '../options';

/**
 * Return the previous item, from current selection or from a node.
 */
function getPreviousItem(opts: Options, editor: Editor, block?: Block): ?Block {
    const { value } = editor;
    const { document, startBlock } = value;
    block = block || startBlock;

    const currentItem = editor.getCurrentItem(block);
    if (!currentItem) {
        return null;
    }

    const previousSibling = document.getPreviousSibling(currentItem.key);

    if (!previousSibling) {
        return null;
    } else if (previousSibling.type === opts.typeItem) {
        return previousSibling;
    }
    return null;
}

export default getPreviousItem;
