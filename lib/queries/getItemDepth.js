// @flow
import { type Editor, type Block } from 'slate';
import type Options from '../options';

/**
 * Get depth of current block in a document list
 */
function getItemDepth(opts: Options, editor: Editor, block?: Block): number {
    const { value } = editor;
    const { document, startBlock } = value;
    block = block || startBlock;

    const currentItem = editor.getCurrentItem(block);
    if (!currentItem) {
        return 0;
    }

    const list = document.getParent(currentItem.key);

    return 1 + editor.getItemDepth(list);
}

export default getItemDepth;
