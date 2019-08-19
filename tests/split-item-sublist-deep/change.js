import expect from 'expect';
import { Selection, Point } from 'slate';
import { List } from 'immutable';

export default function(plugin, editor) {
    editor.splitListItem();

    // check new selection
    const selectedNode = editor.value.document.getTexts().get(2);

    const selection = new Selection({
      anchor: new Point({
        key: selectedNode.key,
        path: List([0, 0, 1, 1, 0, 0]),
        offset: 0
      }),
      focus: new Point({
        key: selectedNode.key,
        path: List([0, 0, 1, 1, 0, 0]),
        offset: 0
      }),
      isFocused: true
    });

    expect(editor.value.selection.toJS()).toMatch(selection.toJS());

    return editor;
}
