// @flow
import { type Editor } from 'slate';
import type Options from '../options';

/**
 * User pressed Enter in an editor
 *
 * Enter in a list item should split the list item
 * Enter in an empty list item should remove it
 * Shift+Enter in a list item should make a new line
 */
function onEnter(event: *, editor: Editor, opts: Options, next): void | any {
    // Pressing Shift+Enter
    // should split block normally
    if (event.shiftKey) {
        return next();
    }

    const { value } = editor;
    const currentItem = editor.getCurrentItem();

    // Not in a list
    if (!currentItem) {
        return next();
    }

    event.preventDefault();

    // If expanded, delete first.
    if (value.isExpanded) {
        editor.delete();
    }

    if (currentItem.isEmpty()) {
        // Block is empty, we exit the list
        if (editor.getItemDepth() > 1) {
            return editor.decreaseItemDepth();
        }
        // Exit list
        return editor.unwrapList();
    }
    // Split list item
    return editor.splitListItem();
}

export default onEnter;
