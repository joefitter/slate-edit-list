// @flow
import { type Editor } from 'slate';
import type Options from '../options';

/**
 * Unwrap items at range from their list.
 */
function unwrapList(opts: Options, editor: Editor): Editor {
    const items = editor.getItemsAtRange();

    if (items.isEmpty()) {
        return editor;
    }

    // Unwrap the items from their list
    items.forEach(item =>
        editor.unwrapNodeByKey(item.key, { normalize: false })
    );

    // Parent of the list of the items
    const firstItem = items.first();
    const parent = editor.value.document.getParent(firstItem.key);

    let index = parent.nodes.findIndex(node => node.key === firstItem.key);

    // Unwrap the items' children
    items.forEach(item => {
        item.nodes.forEach(node => {
            editor.moveNodeByKey(node.key, parent.key, index, {
                normalize: false
            });
            index += 1;
        });
    });

    // Finally, remove the now empty items
    items.forEach(item =>
        editor.removeNodeByKey(item.key, { normalize: false })
    );

    return editor;
}

export default unwrapList;
