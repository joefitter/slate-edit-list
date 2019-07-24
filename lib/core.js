// @flow
import Options, { type OptionsFormat } from './options';
import { schema, normalizeNode } from './validation';
import {
    wrapInList,
    unwrapList,
    splitListItem,
    increaseItemDepth,
    decreaseItemDepth
} from './commands';
import {
    getItemDepth,
    isList,
    isSelectionInList,
    getCurrentItem,
    getCurrentList,
    getItemsAtRange,
    getPreviousItem,
    getListForItem
} from './queries';

/**
 * Returns the core of the plugin, limited to the validation and normalization
 * part of `slate-edit-list`, and utils.
 *
 * Import this directly: `import EditListCore from 'slate-edit-table/lib/core'`
 * if you don't care about behavior/rendering.
 */
function core(
    // Options for the plugin
    opts: OptionsFormat = {}
): Object {
    opts = new Options(opts);

    return {
        schema: schema(opts),
        normalizeNode: normalizeNode(opts),

        queries: {
            getCurrentItem: getCurrentItem.bind(null, opts),
            getCurrentList: getCurrentList.bind(null, opts),
            getItemDepth: getItemDepth.bind(null, opts),
            getItemsAtRange: getItemsAtRange.bind(null, opts),
            getPreviousItem: getPreviousItem.bind(null, opts),
            isList: isList.bind(null, opts),
            isSelectionInList: isSelectionInList.bind(null, opts),
            getListForItem: getListForItem.bind(null, opts)
        },

        commands: {
            decreaseItemDepth: bindAndScopeChange(opts, decreaseItemDepth),
            increaseItemDepth: bindAndScopeChange(opts, increaseItemDepth),
            splitListItem: bindAndScopeChange(opts, splitListItem),
            unwrapList: bindAndScopeChange(opts, unwrapList),
            wrapInList: wrapInList.bind(null, opts)
        }
    };
}

/**
 * Bind a command to given options, and scope it to act only inside a list
 */
function bindAndScopeChange(opts: Options, fn: *): * {
    return (editor, ...args) => {
        if (!editor.isSelectionInList()) {
            return editor;
        }

        // $FlowFixMe
        return fn(...[opts, editor].concat(args));
    };
}

export default core;
