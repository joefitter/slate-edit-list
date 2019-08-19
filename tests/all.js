/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import expect from 'expect';
import fs from 'fs';
import path from 'path';
import { Editor, Value } from 'slate';

import EditList from '../lib';

describe('slate-edit-list', () => {
    const tests = fs.readdirSync(__dirname);

    tests.forEach((test, index) => {
        if (test[0] === '.' || path.extname(test).length > 0) return;
        it(test, () => {
            const dir = path.resolve(__dirname, test);
            const plugin = EditList();

            const input = require(path.resolve(dir, 'input.js')).default;

            const editor = new Editor({
                plugins: [plugin],
                value: Value.fromJS(input)
            });

            const expectedPath = path.resolve(dir, 'expected.js');
            const runChange = require(path.resolve(dir, 'change.js')).default;

            return (
                Promise.resolve()
                    .then(() => runChange(plugin, editor))
                    // eslint-disable-next-line consistent-return
                    .then(() => {
                        let expected;

                        try {
                            expected = Value.fromJS(
                                require(expectedPath).default
                            ).toJS();
                        } catch (e) {
                            // eslint-disable-next-line no-console
                            console.log('no expected val, skipping');
                        }

                        if (expected) {
                            const actual = editor.value.toJS();
                            return expect(actual).toEqual(expected);
                        }
                    })
            );
        });
    });
});
