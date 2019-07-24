export default function(plugin, editor) {
    const data = { style: { listStyleType: 'decimal' } };
    return editor.wrapInList('ol_list', data);
}
