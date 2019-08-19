// @flow
/* global document */
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import ReactDOM from 'react-dom';
import { Editor } from 'slate-react';

import PluginEditList from '../lib/';

import INITIAL_VALUE from './value';

const plugin = PluginEditList();
const plugins = [plugin];

function renderBlock(props: *) {
    const { node, attributes, children, editor } = props;
    const isCurrentItem = plugin.queries
        .getItemsAtRange(editor.value)
        .contains(node);

    switch (node.type) {
        case 'ul_list':
            return <ul {...attributes}>{children}</ul>;
        case 'ol_list':
            return <ol {...attributes}>{children}</ol>;

        case 'list_item':
            return (
                <li
                    className={isCurrentItem ? 'current-item' : ''}
                    title={isCurrentItem ? 'Current Item' : ''}
                    {...props.attributes}
                >
                    {props.children}
                </li>
            );

        case 'paragraph':
            return <p {...attributes}>{children}</p>;
        case 'heading':
            return <h1 {...attributes}>{children}</h1>;
        default:
            return <p {...attributes}>{children}</p>;
    }
}

class Example extends React.Component<*, *> {
    editor: Editor;
    constructor(props) {
        super(props);
        this.call = this.call.bind(this);
    }

    state = {
        value: INITIAL_VALUE
    };

    renderToolbar() {
        const inList = plugin.queries.isSelectionInList(this.state.value);

        return (
            <div>
                <button
                    className={inList ? 'active' : ''}
                    onClick={this.call(inList ? 'unwrapList' : 'wrapInList')}
                >
                    <i className="fa fa-list-ul fa-lg" />
                </button>

                <button
                    className={inList ? '' : 'disabled'}
                    onClick={this.call('decreaseItemDepth')}
                >
                    <i className="fa fa-outdent fa-lg" />
                </button>

                <button
                    className={inList ? '' : 'disabled'}
                    onClick={this.call('increaseItemDepth')}
                >
                    <i className="fa fa-indent fa-lg" />
                </button>

                <span className="sep">·</span>

                <button onClick={this.call('wrapInList')}>Wrap in list</button>
                <button onClick={this.call('unwrapList')}>
                    Unwrap from list
                </button>
            </div>
        );
    }

    call(change) {
        return e => {
            e.preventDefault();
            this.editor[change]();
        };
    }

    setEditorComponent = (ref: Editor) => {
        this.editor = ref;
    };

    onChange = ({ value }) => {
        this.setState({
            value
        });
    };

    render() {
        return (
            <div>
                {this.renderToolbar()}
                <Editor
                    ref={this.setEditorComponent}
                    placeholder="Enter some text..."
                    plugins={plugins}
                    value={this.state.value}
                    onChange={this.onChange}
                    renderBlock={renderBlock}
                    shouldNodeComponentUpdate={props =>
                        // To update the highlighting of nodes inside the selection
                        props.node.type === 'list_item'
                    }
                />
            </div>
        );
    }
}

// $FlowFixMe
ReactDOM.render(<Example />, document.getElementById('example'));
