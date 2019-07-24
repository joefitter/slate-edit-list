// @flow
import { type Editor, type Node } from 'slate';
import type Options from '../options';

type Normalizer = Editor => any;

/**
 * Create a schema definition with rules to normalize lists
 */
function normalizeNode(opts: Options): Node => void | Normalizer {
    return (node, editor, next) => joinAdjacentLists(opts, node, editor, next);
}

/**
 * A rule that joins adjacent lists of the same type
 */
function joinAdjacentLists(
    opts: Options,
    node: Node,
    editor: Editor,
    next
): void | Normalizer {
    if (node.object !== 'document' && node.object !== 'block') {
        return next();
    }

    const invalids = node.nodes
        .map((child, i) => {
            if (!editor.isList(child)) return null;
            const nextNode = node.nodes.get(i + 1);
            if (
                !nextNode ||
                !editor.isList(nextNode) ||
                !opts.canMerge(child, nextNode)
            ) {
                return null;
            }

            return [child, nextNode];
        })
        .filter(Boolean);

    if (invalids.isEmpty()) {
        return next();
    }

    /**
     * Join the list pairs
     */
    // We join in reverse order, so that multiple lists folds onto the first one
    return () => {
        invalids.reverse().forEach(pair => {
            const [first, second] = pair;
            const updatedSecond = editor.value.document.getDescendant(
                second.key
            );
            updatedSecond.nodes.forEach((secondNode, index) => {
                editor.moveNodeByKey(
                    secondNode.key,
                    first.key,
                    first.nodes.size + index,
                    { normalize: false }
                );
            });

            editor.removeNodeByKey(second.key, { normalize: false });
        });
    };
}

export default normalizeNode;
