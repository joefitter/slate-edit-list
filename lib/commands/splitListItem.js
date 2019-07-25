// @flow
import { type Editor } from 'slate';
import type Options from '../options';

/**
 * Split a list item at the start of the current range.
 */
function splitListItem(opts: Options, editor: Editor): Editor {
    const { value } = editor;
    const currentItem = editor.getCurrentItem();
    if (!currentItem) {
        return editor;
    }

    const splitOffset = value.selection.start.offset;

    return editor.splitDescendantsByKey(
        currentItem.key,
        value.selection.start.key,
        splitOffset
    );
}

export default splitListItem;
