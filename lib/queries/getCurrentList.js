// @flow
import { type Editor, type Block } from 'slate';
import type Options from '../options';

/**
 * Return the parent list block, from current selection or from a node (paragraph in a list item).
 */
function getCurrentList(opts: Options, editor: Editor, block?: Block): ?Block {
    const item = editor.getCurrentItem(block);

    if (!item) {
        return null;
    }

    return editor.getListForItem(item);
}

export default getCurrentList;
