// @flow
import { Data, type Editor, type Block } from 'slate';
import { List } from 'immutable';

import type Options from '../options';

/**
 * Wrap the blocks in the current selection in a new list. Selected
 * lists are merged together.
 */
function wrapInList(
    opts: Options,
    editor: Editor,
    type?: string,
    data?: Object | Data
): Editor {
    const selectedBlocks = getHighestSelectedBlocks(editor);
    type = type || opts.types[0];

    // Wrap in container
    editor.wrapBlock(
        {
            type,
            data: Data.create(data)
        },
        { normalize: false }
    );

    // Wrap in list items
    selectedBlocks.forEach(node => {
        if (editor.isList(node)) {
            // Merge its items with the created list
            node.nodes.forEach(({ key }) =>
                editor.unwrapNodeByKey(key, { normalize: false })
            );
        } else {
            editor.wrapBlockByKey(node.key, opts.typeItem, {
                normalize: false
            });
        }
    });

    return editor.normalize();
}

/**
 * Returns the highest list of blocks that cover the current selection
 */
function getHighestSelectedBlocks(editor: Editor): List<Block> {
    const { value } = editor;
    const range = value.selection;
    const { document } = value;

    const startBlock = document.getClosestBlock(range.start.key);
    const endBlock = document.getClosestBlock(range.end.key);

    if (startBlock === endBlock) {
        return List([startBlock]);
    }
    const ancestor = document.getCommonAncestor(startBlock.key, endBlock.key);
    const startPath = ancestor.getPath(startBlock.key);
    const endPath = ancestor.getPath(endBlock.key);

    return ancestor.nodes.slice(startPath[0], endPath[0] + 1);
}

export default wrapInList;
