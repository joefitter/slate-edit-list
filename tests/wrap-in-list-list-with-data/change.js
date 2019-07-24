export default function(plugin, editor) {
    const data = { style: { listStyleType: 'disc' } };
    return editor.wrapInList(false, data);
}
