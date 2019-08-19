import expect from 'expect';

export default function(plugin, editor) {
    const previousItem = editor.getPreviousItem();
    expect(previousItem.key).toBe('previous_item');
}
