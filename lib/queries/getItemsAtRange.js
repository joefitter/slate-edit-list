// @flow
import { type Editor, type Block, type Range } from 'slate';
import { List } from 'immutable';

import type Options from '../options';

/**
 * Return the list of items at the given range. The returned items are
 * the highest list item blocks that cover the range.
 *
 * Returns an empty list if no list of items can cover the range
 */
function getItemsAtRange(
    opts: Options,
    editor: Editor,
    range?: Range
): List<Block> {
    const { value } = editor;
    range = range || value.selection;

    if (!range.start) {
        return List();
    }

    const { document } = value;

    const startBlock = document.getClosestBlock(range.start.key);
    const endBlock = document.getClosestBlock(range.end.key);

    if (startBlock === endBlock) {
        const item = editor.getCurrentItem(startBlock);
        return item ? List([item]) : List();
    }

    const ancestor = document.getCommonAncestor(startBlock.key, endBlock.key);

    if (editor.isList(ancestor)) {
        const startPath = ancestor.getPath(startBlock.key);
        const endPath = ancestor.getPath(endBlock.key);

        return ancestor.nodes.slice(startPath.get(0), endPath.get(0) + 1);
    } else if (ancestor.type === opts.typeItem) {
        // The ancestor is the highest list item that covers the range
        return List([ancestor]);
    }
    // No list of items can cover the range
    return List();
}

export default getItemsAtRange;
