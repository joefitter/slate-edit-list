// @flow
import { type Editor } from 'slate';

import type Options from '../options';

/**
 * True if selection is inside a list (and can be unwrapped)
 */
function isSelectionInList(
    opts: Options,
    editor: Editor,
    type?: string
): boolean {
    const items = editor.getItemsAtRange();
    return (
        !items.isEmpty() &&
        // Check the type of the list if needed
        (!type || editor.getListForItem(items.first()).get('type') === type)
    );
}

export default isSelectionInList;
