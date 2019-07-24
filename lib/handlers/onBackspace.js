// @flow
import { type Editor } from 'slate';
import type Options from '../options';

/**
 * User pressed Delete in an editor
 */
function onBackspace(
    event: *,
    editor: Editor,
    opts: Options,
    next
): void | any {
    const { value } = editor;
    const { startOffset, selection } = value;

    // Only unwrap...
    // ... with a collapsed selection
    if (selection.isExpanded) {
        return next();
    }

    // ... when at the beginning of nodes
    if (startOffset > 0) {
        return next();
    }
    // ... in a list
    const currentItem = editor.getCurrentItem();
    if (!currentItem) {
        return next();
    }
    // ... more precisely at the beginning of the current item
    if (!selection.anchor.isAtStartOfNode(currentItem)) {
        return next();
    }

    event.preventDefault();
    return editor.unwrapList();
}

export default onBackspace;
