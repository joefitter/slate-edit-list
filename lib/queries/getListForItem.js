// @flow
import { type Editor, type Block } from 'slate';
import type Options from '../options';

/**
 * Return the parent list block for an item block.
 */
function getListForItem(opts: Options, editor: Editor, item: Block): ?Block {
    const {
        value: { document }
    } = editor;
    const parent = document.getParent(item.key);
    return parent && editor.isList(parent) ? parent : null;
}

export default getListForItem;
