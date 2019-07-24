// @flow
import { type Editor } from 'slate';
import type Options from '../options';

/**
 * User pressed Tab in an editor.
 * Tab       -> Increase item depth if inside a list item
 * Shift+Tab -> Decrease item depth if inside a list item
 */
function onTab(event: *, editor: Editor, opts: Options, next): void | any {
    const { value } = editor;
    const { isCollapsed } = value.selection;

    if (!isCollapsed || !editor.getCurrentItem()) {
        return next();
    }

    // Shift+tab reduce depth
    if (event.shiftKey) {
        event.preventDefault();
        return editor.decreaseItemDepth();
    }

    // Tab increases depth
    event.preventDefault();
    return editor.increaseItemDepth();
}

export default onTab;
