import {merge} from '../src/merge';
import {XmlDocument} from 'xmldoc';

describe('merge', () => {
    describe('xliff 1.2', () => {
        test('should add missing node', () => {
            const sourceFileContent = '<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">\n' +
                '  <file source-language="de" datatype="plaintext" original="ng2.template">\n' +
                '    <body>\n' +
                '      <trans-unit id="ID1" datatype="html">\n' +
                '        <source>source val</source>\n' +
                '      </trans-unit>\n' +
                '      <trans-unit id="ID2" datatype="html">\n' +
                '        <source>source val2</source>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>';
            const destFileContent = '<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">\n' +
                '  <file source-language="de" target-language="fr-ch" datatype="plaintext" original="ng2.template">\n' +
                '    <body>\n' +
                '      <trans-unit id="ID1" datatype="html">\n' +
                '        <source>source val</source>\n' +
                '        <target>target val</target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>';

            const result = merge(sourceFileContent, destFileContent);

            expect(norm(result)).toEqual(norm('<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">\n' +
                '  <file source-language="de" target-language="fr-ch" datatype="plaintext" original="ng2.template">\n' +
                '    <body>\n' +
                '      <trans-unit id="ID1" datatype="html">\n' +
                '        <source>source val</source>\n' +
                '        <target>target val</target>\n' +
                '      </trans-unit>\n' +
                '      <trans-unit id="ID2" datatype="html">\n' +
                '        <source>source val2</source>\n' +
                '        <target state="new">source val2</target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>'));
        });

        test('should not remove unused node', () => {
            const sourceFileContent = '<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">\n' +
                '  <file source-language="en" target-language="fr-ch" datatype="plaintext" original="ng2.template">\n' +
                '    <body>\n' +
                '      <trans-unit id="ID1" datatype="html">\n' +
                '        <source>source val1</source>\n' +
                '        <target state="new">target val1</target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>';
            const destFileContent = '<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">\n' +
                '  <file source-language="en" target-language="fr-ch" datatype="plaintext" original="ng2.template">\n' +
                '    <body>\n' +
                '      <trans-unit id="ID2" datatype="html">\n' +
                '        <source>source val2</source>\n' +
                '        <target state="new">target val2</target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>';

            const result = merge(sourceFileContent, destFileContent, {removeUnused: false});

            expect(norm(result)).toEqual(norm('<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">\n' +
                '  <file source-language="en" target-language="fr-ch" datatype="plaintext" original="ng2.template">\n' +
                '    <body>\n' +
                '      <trans-unit id="ID2" datatype="html">\n' +
                '        <source>source val2</source>\n' +
                '        <target state="new">target val2</target>\n' +
                '      </trans-unit>\n' +
                '      <trans-unit id="ID1" datatype="html">\n' +
                '        <source>source val1</source>\n' +
                '        <target state="new">target val1</target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>'));
        });

        test('should not remove unused node AND update targetNode', () => {
            const sourceFileContent = '<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">\n' +
                '  <file source-language="en" target-language="fr-ch" datatype="plaintext" original="ng2.template">\n' +
                '    <body>\n' +
                '      <trans-unit id="ID1" datatype="html">\n' +
                '        <source>source val2</source>\n' +
                '        <target state="new">target val2</target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>';
            const destFileContent = '<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">\n' +
                '  <file source-language="en" target-language="fr-ch" datatype="plaintext" original="ng2.template">\n' +
                '    <body>\n' +
                '      <trans-unit id="ID1" datatype="html">\n' +
                '        <source>source val1</source>\n' +
                '        <target state="new">target val1</target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>';

            const result = merge(sourceFileContent, destFileContent, {removeUnused: false});

            expect(norm(result)).toEqual(norm('<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">\n' +
                '  <file source-language="en" target-language="fr-ch" datatype="plaintext" original="ng2.template">\n' +
                '    <body>\n' +
                '      <trans-unit id="ID1" datatype="html">\n' +
                '        <source>source val2</source>\n' +
                '        <target state="new">target val2</target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>'));
        });

        test('should remove obsolete node', () => {
            const sourceFileContent = '<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">\n' +
                '  <file source-language="de" datatype="plaintext" original="ng2.template">\n' +
                '    <body>\n' +
                '      <trans-unit id="ID1" datatype="html">\n' +
                '        <source>source val</source>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>';
            const destFileContent = '<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">\n' +
                '  <file source-language="de" target-language="fr-ch" datatype="plaintext" original="ng2.template">\n' +
                '    <body>\n' +
                '      <trans-unit id="ID1" datatype="html">\n' +
                '        <source>source val</source>\n' +
                '        <target>target val</target>\n' +
                '      </trans-unit>\n' +
                '      <trans-unit id="ID2" datatype="html">\n' +
                '        <source>source val2</source>\n' +
                '        <target>source val2</target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>';

            const result = merge(sourceFileContent, destFileContent);

            expect(norm(result)).toEqual(norm('<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">\n' +
                '  <file source-language="de" target-language="fr-ch" datatype="plaintext" original="ng2.template">\n' +
                '    <body>\n' +
                '      <trans-unit id="ID1" datatype="html">\n' +
                '        <source>source val</source>\n' +
                '        <target>target val</target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>'));
        });

        test('should update changed node', () => {
            const sourceFileContent = '<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">\n' +
                '  <file source-language="de" datatype="plaintext" original="ng2.template">\n' +
                '    <body>\n' +
                '      <trans-unit id="ID1" datatype="html">\n' +
                '        <source>source val new</source>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>';
            const destFileContent = '<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">\n' +
                '  <file source-language="de" target-language="fr-ch" datatype="plaintext" original="ng2.template">\n' +
                '    <body>\n' +
                '      <trans-unit id="ID1" datatype="html">\n' +
                '        <source>source val</source>\n' +
                '        <target>target val</target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>';

            const result = merge(sourceFileContent, destFileContent);

            expect(norm(result)).toEqual(norm('<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">\n' +
                '  <file source-language="de" target-language="fr-ch" datatype="plaintext" original="ng2.template">\n' +
                '    <body>\n' +
                '      <trans-unit id="ID1" datatype="html">\n' +
                '        <source>source val new</source>\n' +
                '        <target state="new">target val</target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>'));
        });
        test('should update changed node without changing translation state if disabled', () => {
            const sourceFileContent = '<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">\n' +
                '  <file source-language="de" datatype="plaintext" original="ng2.template">\n' +
                '    <body>\n' +
                '      <trans-unit id="ID1" datatype="html">\n' +
                '        <source>source val new</source>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>';
            const destFileContent = '<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">\n' +
                '  <file source-language="de" target-language="fr-ch" datatype="plaintext" original="ng2.template">\n' +
                '    <body>\n' +
                '      <trans-unit id="ID1" datatype="html">\n' +
                '        <source>source val</source>\n' +
                '        <target>target val</target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>';

            const result = merge(sourceFileContent, destFileContent, {resetTranslationState: false});

            expect(norm(result)).toEqual(norm('<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">\n' +
                '  <file source-language="de" target-language="fr-ch" datatype="plaintext" original="ng2.template">\n' +
                '    <body>\n' +
                '      <trans-unit id="ID1" datatype="html">\n' +
                '        <source>source val new</source>\n' +
                '        <target>target val</target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>'));
        });

        test('should fuzzy match changed node', () => {
            const sourceFileContent = '<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">\n' +
                '  <file source-language="de" datatype="plaintext" original="ng2.template">\n' +
                '    <body>\n' +
                '      <trans-unit id="ID1" datatype="html">\n' +
                '        <source>new source val that is long enough</source>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>';
            const destFileContent = '<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">\n' +
                '  <file source-language="de" target-language="fr-ch" datatype="plaintext" original="ng2.template">\n' +
                '    <body>\n' +
                '      <trans-unit id="random-id" datatype="html">\n' +
                '        <source>source val that is long enough</source>\n' +
                '        <target>target val</target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>';

            const result = merge(sourceFileContent, destFileContent);

            expect(norm(result)).toEqual(norm('<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">\n' +
                '  <file source-language="de" target-language="fr-ch" datatype="plaintext" original="ng2.template">\n' +
                '    <body>\n' +
                '      <trans-unit id="ID1" datatype="html">\n' +
                '        <source>new source val that is long enough</source>\n' +
                '        <target state="new">target val</target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>'));
        });

        test('should ignore whitespace changes', () => {
            const sourceFileContent = '<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">\n' +
                '  <file source-language="de" datatype="plaintext" original="ng2.template">\n' +
                '    <body>\n' +
                '      <trans-unit id="ID1" datatype="html">\n' +
                '        <source>source     val</source>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>';
            const destFileContent = '<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">\n' +
                '  <file source-language="de" target-language="fr-ch" datatype="plaintext" original="ng2.template">\n' +
                '    <body>\n' +
                '      <trans-unit id="ID1" datatype="html">\n' +
                '        <source>source val</source>\n' +
                '        <target>target val</target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>';

            const result = merge(sourceFileContent, destFileContent);

            expect(norm(result)).toEqual(norm('<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">\n' +
                '  <file source-language="de" target-language="fr-ch" datatype="plaintext" original="ng2.template">\n' +
                '    <body>\n' +
                '      <trans-unit id="ID1" datatype="html">\n' +
                '        <source>source val</source>\n' +
                '        <target>target val</target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>'));
        });

        test('should not ignore whitespace changes with option collapseWhitespace=false', () => {
            const sourceFileContent = '<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">\n' +
                '  <file source-language="de" datatype="plaintext" original="ng2.template">\n' +
                '    <body>\n' +
                '      <trans-unit id="ID1" datatype="html">\n' +
                '        <source>source     val</source>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>';
            const destFileContent = '<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">\n' +
                '  <file source-language="de" target-language="fr-ch" datatype="plaintext" original="ng2.template">\n' +
                '    <body>\n' +
                '      <trans-unit id="ID1" datatype="html">\n' +
                '        <source>source val</source>\n' +
                '        <target>target val</target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>';

            const result = merge(sourceFileContent, destFileContent, {collapseWhitespace: false});

            expect(norm(result)).toEqual(norm('<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">\n' +
                '  <file source-language="de" target-language="fr-ch" datatype="plaintext" original="ng2.template">\n' +
                '    <body>\n' +
                '      <trans-unit id="ID1" datatype="html">\n' +
                '        <source>source     val</source>\n' +
                '        <target state="new">target val</target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>'));
        });
        test('should retain location', () => {
            const sourceFileContent = '<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">\n' +
                '  <file source-language="de" datatype="plaintext" original="ng2.template">\n' +
                '    <body>\n' +
                '      <trans-unit id="ID1" datatype="html">\n' +
                '        <source>source val</source>\n' +
                '        <context-group purpose="location">\n' +
                '          <context context-type="sourcefile">src/app/app.component.html</context>\n' +
                '          <context context-type="linenumber">1</context>\n' +
                '        </context-group>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>';
            const destFileContent = '<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">\n' +
                '  <file source-language="de" target-language="fr-ch" datatype="plaintext" original="ng2.template">\n' +
                '    <body>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>';

            const result = merge(sourceFileContent, destFileContent);

            expect(norm(result)).toEqual(norm('<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">\n' +
                '  <file source-language="de" target-language="fr-ch" datatype="plaintext" original="ng2.template">\n' +
                '    <body>\n' +
                '      <trans-unit id="ID1" datatype="html">\n' +
                '        <source>source val</source>\n' +
                '        <target state="new">source val</target>\n' +
                '        <context-group purpose="location">\n' +
                '          <context context-type="sourcefile">src/app/app.component.html</context>\n' +
                '          <context context-type="linenumber">1</context>\n' +
                '        </context-group>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>'));
        });
        test('should add location', () => {
            const sourceFileContent = '<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">\n' +
                '  <file source-language="de" datatype="plaintext" original="ng2.template">\n' +
                '    <body>\n' +
                '      <trans-unit id="ID1" datatype="html">\n' +
                '        <source>source val</source>\n' +
                '        <context-group purpose="location">\n' +
                '          <context context-type="sourcefile">src/app/app.component.html</context>\n' +
                '          <context context-type="linenumber">1</context>\n' +
                '        </context-group>\n' +
                '        <context-group purpose="location">\n' +
                '          <context context-type="sourcefile">src/app/app.component2.html</context>\n' +
                '          <context context-type="linenumber">2</context>\n' +
                '        </context-group>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>';
            const destFileContent = '<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">\n' +
                '  <file source-language="de" target-language="fr-ch" datatype="plaintext" original="ng2.template">\n' +
                '    <body>\n' +
                '      <trans-unit id="ID1" datatype="html">\n' +
                '        <source>source val</source>\n' +
                '        <target state="new">source val</target>\n' +
                '        <context-group purpose="location">\n' +
                '          <context context-type="sourcefile">src/app/app.component.html</context>\n' +
                '          <context context-type="linenumber">1</context>\n' +
                '        </context-group>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>';

            const result = merge(sourceFileContent, destFileContent);

            expect(norm(result)).toEqual(norm('<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">\n' +
                '  <file source-language="de" target-language="fr-ch" datatype="plaintext" original="ng2.template">\n' +
                '    <body>\n' +
                '      <trans-unit id="ID1" datatype="html">\n' +
                '        <source>source val</source>\n' +
                '        <target state="new">source val</target>\n' +
                '        <context-group purpose="location">\n' +
                '          <context context-type="sourcefile">src/app/app.component.html</context>\n' +
                '          <context context-type="linenumber">1</context>\n' +
                '        </context-group>\n' +
                '        <context-group purpose="location">\n' +
                '          <context context-type="sourcefile">src/app/app.component2.html</context>\n' +
                '          <context context-type="linenumber">2</context>\n' +
                '        </context-group>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>'));
        });
        test('should update location', () => {
            const sourceFileContent = '<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">\n' +
                '  <file source-language="de" datatype="plaintext" original="ng2.template">\n' +
                '    <body>\n' +
                '      <trans-unit id="ID1" datatype="html">\n' +
                '        <source>source val</source>\n' +
                '        <context-group purpose="location">\n' +
                '          <context context-type="sourcefile">SOME NEW VALUE</context>\n' +
                '          <context context-type="linenumber">1</context>\n' +
                '        </context-group>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>';
            const destFileContent = '<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">\n' +
                '  <file source-language="de" target-language="fr-ch" datatype="plaintext" original="ng2.template">\n' +
                '    <body>\n' +
                '      <trans-unit id="ID1" datatype="html">\n' +
                '        <source>source val</source>\n' +
                '        <target state="new">source val</target>\n' +
                '        <context-group purpose="location">\n' +
                '          <context context-type="sourcefile">some old value</context>\n' +
                '          <context context-type="linenumber">1</context>\n' +
                '        </context-group>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>';

            const result = merge(sourceFileContent, destFileContent);

            expect(norm(result)).toEqual(norm('<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">\n' +
                '  <file source-language="de" target-language="fr-ch" datatype="plaintext" original="ng2.template">\n' +
                '    <body>\n' +
                '      <trans-unit id="ID1" datatype="html">\n' +
                '        <source>source val</source>\n' +
                '        <target state="new">source val</target>\n' +
                '        <context-group purpose="location">\n' +
                '          <context context-type="sourcefile">SOME NEW VALUE</context>\n' +
                '          <context context-type="linenumber">1</context>\n' +
                '        </context-group>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>'));
        });

        test('should add missing node with state=final given sourceLanguage=true', () => {
            const sourceFileContent = '<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">\n' +
                '  <file source-language="de" datatype="plaintext" original="ng2.template">\n' +
                '    <body>\n' +
                '      <trans-unit id="ID1" datatype="html">\n' +
                '        <source>source val</source>\n' +
                '      </trans-unit>\n' +
                '      <trans-unit id="ID2" datatype="html">\n' +
                '        <source>source val2</source>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>';
            const destFileContent = '<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">\n' +
                '  <file source-language="de" target-language="fr-ch" datatype="plaintext" original="ng2.template">\n' +
                '    <body>\n' +
                '      <trans-unit id="ID1" datatype="html">\n' +
                '        <source>source val</source>\n' +
                '        <target>target val</target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>';

            const result = merge(sourceFileContent, destFileContent, {sourceLanguage: true});

            expect(norm(result)).toEqual(norm('<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">\n' +
                '  <file source-language="de" target-language="fr-ch" datatype="plaintext" original="ng2.template">\n' +
                '    <body>\n' +
                '      <trans-unit id="ID1" datatype="html">\n' +
                '        <source>source val</source>\n' +
                '        <target>target val</target>\n' +
                '      </trans-unit>\n' +
                '      <trans-unit id="ID2" datatype="html">\n' +
                '        <source>source val2</source>\n' +
                '        <target state="final">source val2</target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>'));
        })

        test('should update node with state=final given sourceLanguage=true', () => {
            const sourceFileContent = '<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">\n' +
                '  <file source-language="de" datatype="plaintext" original="ng2.template">\n' +
                '    <body>\n' +
                '      <trans-unit id="ID1" datatype="html">\n' +
                '        <source>source val changed</source>\n' +
                '      </trans-unit>\n' +
                '      <trans-unit id="ID2" datatype="html">\n' +
                '        <source>source val2</source>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>';
            const destFileContent = '<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">\n' +
                '  <file source-language="de" target-language="fr-ch" datatype="plaintext" original="ng2.template">\n' +
                '    <body>\n' +
                '      <trans-unit id="ID1" datatype="html">\n' +
                '        <source>source val</source>\n' +
                '        <target>target val</target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>';

            const result = merge(sourceFileContent, destFileContent, {sourceLanguage: true});

            expect(norm(result)).toEqual(norm('<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">\n' +
                '  <file source-language="de" target-language="fr-ch" datatype="plaintext" original="ng2.template">\n' +
                '    <body>\n' +
                '      <trans-unit id="ID1" datatype="html">\n' +
                '        <source>source val changed</source>\n' +
                '        <target state="final">source val changed</target>\n' +
                '      </trans-unit>\n' +
                '      <trans-unit id="ID2" datatype="html">\n' +
                '        <source>source val2</source>\n' +
                '        <target state="final">source val2</target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>'));
        })
    });

    describe('xliff 2.0', () => {
        test('should add missing node', () => {
            const sourceFileContent = '<xliff version="2.0" xmlns="urn:oasis:names:tc:xliff:document:2.0" srcLang="de">\n' +
                '  <file original="ng.template" id="ngi18n">\n' +
                '    <unit id="ID1">\n' +
                '      <segment>\n' +
                '        <source>source val</source>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '    <unit id="ID2">\n' +
                '      <segment>\n' +
                '        <source>source val2</source>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '</xliff>';
            const destFileContent = '<xliff version="2.0" xmlns="urn:oasis:names:tc:xliff:document:2.0" srcLang="de" trgLang="fr-CH">\n' +
                '  <file original="ng.template" id="ngi18n">\n' +
                '    <unit id="ID1">\n' +
                '      <segment state="translated">\n' +
                '        <source>source val</source>\n' +
                '        <target>target val</target>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '</xliff>';

            const result = merge(sourceFileContent, destFileContent);

            expect(norm(result)).toEqual(norm('<xliff version="2.0" xmlns="urn:oasis:names:tc:xliff:document:2.0" srcLang="de" trgLang="fr-CH">\n' +
                '  <file original="ng.template" id="ngi18n">\n' +
                '    <unit id="ID1">\n' +
                '      <segment state="translated">\n' +
                '        <source>source val</source>\n' +
                '        <target>target val</target>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  <unit id="ID2">\n' +
                '      <segment state="initial">\n' +
                '        <source>source val2</source>\n' +
                '        <target>source val2</target>\n' +
                '      </segment>\n' +
                '    </unit></file>\n' +
                '</xliff>'));
        });
        test('should add missing node with empty target when newTranslationTargetsBlank=true', () => {
            const sourceFileContent = '<xliff version="2.0" xmlns="urn:oasis:names:tc:xliff:document:2.0" srcLang="de">\n' +
                '  <file original="ng.template" id="ngi18n">\n' +
                '    <unit id="ID1">\n' +
                '      <segment>\n' +
                '        <source>source val</source>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '    <unit id="ID2">\n' +
                '      <segment>\n' +
                '        <source>source val2</source>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '</xliff>';
            const destFileContent = '<xliff version="2.0" xmlns="urn:oasis:names:tc:xliff:document:2.0" srcLang="de" trgLang="fr-CH">\n' +
                '  <file original="ng.template" id="ngi18n">\n' +
                '    <unit id="ID1">\n' +
                '      <segment state="translated">\n' +
                '        <source>source val</source>\n' +
                '        <target>target val</target>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '</xliff>';

            const result = merge(sourceFileContent, destFileContent, {newTranslationTargetsBlank: true});

            expect(norm(result)).toEqual(norm('<xliff version="2.0" xmlns="urn:oasis:names:tc:xliff:document:2.0" srcLang="de" trgLang="fr-CH">\n' +
                '  <file original="ng.template" id="ngi18n">\n' +
                '    <unit id="ID1">\n' +
                '      <segment state="translated">\n' +
                '        <source>source val</source>\n' +
                '        <target>target val</target>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  <unit id="ID2">\n' +
                '      <segment state="initial">\n' +
                '        <source>source val2</source>\n' +
                '        <target></target>\n' +
                '      </segment>\n' +
                '    </unit></file>\n' +
                '</xliff>'));
        });
        test('should handle xml declaration without line break', () => {
            const sourceFileContent = '<?xml version="1.0"?><xliff version="2.0" xmlns="urn:oasis:names:tc:xliff:document:2.0" srcLang="de">\n' +
                '  <file original="ng.template" id="ngi18n">\n' +
                '    <unit id="ID1">\n' +
                '      <segment>\n' +
                '        <source>source val</source>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '    <unit id="ID2">\n' +
                '      <segment>\n' +
                '        <source>source val2</source>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '</xliff>';
            const destFileContent = '<?xml version="1.0"?><xliff version="2.0" xmlns="urn:oasis:names:tc:xliff:document:2.0" srcLang="de" trgLang="fr-CH">\n' +
                '  <file original="ng.template" id="ngi18n">\n' +
                '    <unit id="ID1">\n' +
                '      <segment state="translated">\n' +
                '        <source>source val</source>\n' +
                '        <target>target val</target>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '</xliff>';

            const result = merge(sourceFileContent, destFileContent);

            expect(norm(result)).toEqual(norm('<?xml version="1.0"?><xliff version="2.0" xmlns="urn:oasis:names:tc:xliff:document:2.0" srcLang="de" trgLang="fr-CH">\n' +
                '  <file original="ng.template" id="ngi18n">\n' +
                '    <unit id="ID1">\n' +
                '      <segment state="translated">\n' +
                '        <source>source val</source>\n' +
                '        <target>target val</target>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  <unit id="ID2">\n' +
                '      <segment state="initial">\n' +
                '        <source>source val2</source>\n' +
                '        <target>source val2</target>\n' +
                '      </segment>\n' +
                '    </unit></file>\n' +
                '</xliff>'));
        });

        test('should remove obsolete node', () => {
            const sourceFileContent = '<xliff version="2.0" xmlns="urn:oasis:names:tc:xliff:document:2.0" srcLang="de">\n' +
                '  <file original="ng.template" id="ngi18n">\n' +
                '    <unit id="ID1">\n' +
                '      <segment>\n' +
                '        <source>source val</source>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '</xliff>';
            const destFileContent = '<xliff version="2.0" xmlns="urn:oasis:names:tc:xliff:document:2.0" srcLang="de" trgLang="fr-CH">\n' +
                '  <file original="ng.template" id="ngi18n">\n' +
                '    <unit id="ID1">\n' +
                '      <segment state="translated">\n' +
                '        <source>source val</source>\n' +
                '        <target>target val</target>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '    <unit id="ID2">\n' +
                '      <segment state="initial">\n' +
                '        <source>source val2</source>\n' +
                '        <target>source val2</target>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '</xliff>';

            const result = merge(sourceFileContent, destFileContent);

            expect(norm(result)).toEqual(norm('<xliff version="2.0" xmlns="urn:oasis:names:tc:xliff:document:2.0" srcLang="de" trgLang="fr-CH">\n' +
                '  <file original="ng.template" id="ngi18n">\n' +
                '    <unit id="ID1">\n' +
                '      <segment state="translated">\n' +
                '        <source>source val</source>\n' +
                '        <target>target val</target>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '</xliff>'));
        });

        test('should update changed node', () => {
            const sourceFileContent = '<xliff version="2.0" xmlns="urn:oasis:names:tc:xliff:document:2.0" srcLang="de">\n' +
                '  <file original="ng.template" id="ngi18n">\n' +
                '    <unit id="ID1">\n' +
                '      <segment>\n' +
                '        <source>new source val</source>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '</xliff>';
            const destFileContent = '<xliff version="2.0" xmlns="urn:oasis:names:tc:xliff:document:2.0" srcLang="de" trgLang="fr-CH">\n' +
                '  <file original="ng.template" id="ngi18n">\n' +
                '    <unit id="ID1">\n' +
                '      <segment state="translated">\n' +
                '        <source>source val</source>\n' +
                '        <target>target val</target>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '</xliff>';

            const result = merge(sourceFileContent, destFileContent);

            expect(norm(result)).toEqual(norm('<xliff version="2.0" xmlns="urn:oasis:names:tc:xliff:document:2.0" srcLang="de" trgLang="fr-CH">\n' +
                '  <file original="ng.template" id="ngi18n">\n' +
                '    <unit id="ID1">\n' +
                '      <segment state="initial">\n' +
                '        <source>new source val</source>\n' +
                '        <target>target val</target>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '</xliff>'));
        });

        test('should update changed node without updating translation state if disabled', () => {
            const sourceFileContent = '<xliff version="2.0" xmlns="urn:oasis:names:tc:xliff:document:2.0" srcLang="de">\n' +
                '  <file original="ng.template" id="ngi18n">\n' +
                '    <unit id="ID1">\n' +
                '      <segment>\n' +
                '        <source>new source val</source>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '</xliff>';
            const destFileContent = '<xliff version="2.0" xmlns="urn:oasis:names:tc:xliff:document:2.0" srcLang="de" trgLang="fr-CH">\n' +
                '  <file original="ng.template" id="ngi18n">\n' +
                '    <unit id="ID1">\n' +
                '      <segment state="translated">\n' +
                '        <source>source val</source>\n' +
                '        <target>target val</target>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '</xliff>';

            const result = merge(sourceFileContent, destFileContent, {resetTranslationState: false});

            expect(norm(result)).toEqual(norm('<xliff version="2.0" xmlns="urn:oasis:names:tc:xliff:document:2.0" srcLang="de" trgLang="fr-CH">\n' +
                '  <file original="ng.template" id="ngi18n">\n' +
                '    <unit id="ID1">\n' +
                '      <segment state="translated">\n' +
                '        <source>new source val</source>\n' +
                '        <target>target val</target>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '</xliff>'));
        });

        test('should fuzzy match changed node', () => {
            const sourceFileContent = '<xliff version="2.0" xmlns="urn:oasis:names:tc:xliff:document:2.0" srcLang="de">\n' +
                '  <file original="ng.template" id="ngi18n">\n' +
                '    <unit id="ID1">\n' +
                '      <segment>\n' +
                '        <source>new source val that is long enough</source>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '</xliff>';
            const destFileContent = '<xliff version="2.0" xmlns="urn:oasis:names:tc:xliff:document:2.0" srcLang="de" trgLang="fr-CH">\n' +
                '  <file original="ng.template" id="ngi18n">\n' +
                '    <unit id="random-id">\n' +
                '      <segment state="translated">\n' +
                '        <source>source val that is long enough</source>\n' +
                '        <target>target val</target>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '</xliff>';

            const result = merge(sourceFileContent, destFileContent);

            expect(norm(result)).toEqual(norm('<xliff version="2.0" xmlns="urn:oasis:names:tc:xliff:document:2.0" srcLang="de" trgLang="fr-CH">\n' +
                '  <file original="ng.template" id="ngi18n">\n' +
                '    <unit id="ID1">\n' +
                '      <segment state="initial">\n' +
                '        <source>new source val that is long enough</source>\n' +
                '        <target>target val</target>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '</xliff>'));
        });

        test('should ignore whitespace changes', () => {
            const sourceFileContent = '<xliff version="2.0" xmlns="urn:oasis:names:tc:xliff:document:2.0" srcLang="de">\n' +
                '  <file original="ng.template" id="ngi18n">\n' +
                '    <unit id="ID1">\n' +
                '      <segment>\n' +
                '        <source>source    end</source>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '</xliff>';
            const destFileContent = '<xliff version="2.0" xmlns="urn:oasis:names:tc:xliff:document:2.0" srcLang="de" trgLang="fr-CH">\n' +
                '  <file original="ng.template" id="ngi18n">\n' +
                '    <unit id="ID1">\n' +
                '      <segment state="translated">\n' +
                '        <source>source end</source>\n' +
                '        <target>target val</target>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '</xliff>';

            const result = merge(sourceFileContent, destFileContent);

            expect(norm(result)).toEqual(norm('<xliff version="2.0" xmlns="urn:oasis:names:tc:xliff:document:2.0" srcLang="de" trgLang="fr-CH">\n' +
                '  <file original="ng.template" id="ngi18n">\n' +
                '    <unit id="ID1">\n' +
                '      <segment state="translated">\n' +
                '        <source>source end</source>\n' +
                '        <target>target val</target>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '</xliff>'));
        });

        test('should not ignore whitespace changes with option collapseWhitespace=false', () => {
            const sourceFileContent = '<xliff version="2.0" xmlns="urn:oasis:names:tc:xliff:document:2.0" srcLang="de">\n' +
                '  <file original="ng.template" id="ngi18n">\n' +
                '    <unit id="ID1">\n' +
                '      <segment>\n' +
                '        <source>source    end</source>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '</xliff>';
            const destFileContent = '<xliff version="2.0" xmlns="urn:oasis:names:tc:xliff:document:2.0" srcLang="de" trgLang="fr-CH">\n' +
                '  <file original="ng.template" id="ngi18n">\n' +
                '    <unit id="ID1">\n' +
                '      <segment state="translated">\n' +
                '        <source>source end</source>\n' +
                '        <target>target val</target>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '</xliff>';

            const result = merge(sourceFileContent, destFileContent, {collapseWhitespace: false});

            expect(norm(result)).toEqual(norm('<xliff version="2.0" xmlns="urn:oasis:names:tc:xliff:document:2.0" srcLang="de" trgLang="fr-CH">\n' +
                '  <file original="ng.template" id="ngi18n">\n' +
                '    <unit id="ID1">\n' +
                '      <segment state="initial">\n' +
                '        <source>source    end</source>\n' +
                '        <target>target val</target>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '</xliff>'));
        });
        test('should replace apostrophe if configured', () => {
            const sourceFileContent = '<xliff version="2.0" xmlns="urn:oasis:names:tc:xliff:document:2.0" srcLang="de">\n' +
                '  <file original="ng.template" id="ngi18n">\n' +
                '    <unit id="ID1">\n' +
                '      <segment>\n' +
                '        <source>source\'val</source>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '</xliff>';
            const destFileContent = '<xliff version="2.0" xmlns="urn:oasis:names:tc:xliff:document:2.0" srcLang="de" trgLang="fr-CH">\n' +
                '  <file original="ng.template" id="ngi18n">\n' +
                '  </file>\n' +
                '</xliff>';

            const result = merge(sourceFileContent, destFileContent, {replaceApostrophe: true});

            expect(result).toContain('&apos;');
            expect(result).not.toContain('\'');
        });
        test('should not replace apostrophe if configured', () => {
            const sourceFileContent = '<xliff version="2.0" xmlns="urn:oasis:names:tc:xliff:document:2.0" srcLang="de">\n' +
                '  <file original="ng.template" id="ngi18n">\n' +
                '    <unit id="ID1">\n' +
                '      <segment>\n' +
                '        <source>source\'val</source>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '</xliff>';
            const destFileContent = '<xliff version="2.0" xmlns="urn:oasis:names:tc:xliff:document:2.0" srcLang="de" trgLang="fr-CH">\n' +
                '  <file original="ng.template" id="ngi18n">\n' +
                '  </file>\n' +
                '</xliff>';

            const result = merge(sourceFileContent, destFileContent, {replaceApostrophe: false});

            expect(result).not.toContain('&apos;');
            expect(result).toContain('\'');
        });
        test('should retain notes', () => {
            const sourceFileContent = '<xliff version="2.0" xmlns="urn:oasis:names:tc:xliff:document:2.0" srcLang="de">\n' +
                '  <file original="ng.template" id="ngi18n">\n' +
                '    <unit id="ID1">\n' +
                '      <notes>\n' +
                '        <note category="location">D:/Localization/Angular/Bugs/Icu/src/app/app.component.ts:2</note>\n' +
                '      </notes>' +
                '      <segment>\n' +
                '        <source>source text</source>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '</xliff>';
            const destFileContent = '<xliff version="2.0" xmlns="urn:oasis:names:tc:xliff:document:2.0" srcLang="de" trgLang="fr-CH">\n' +
                '  <file original="ng.template" id="ngi18n">\n' +
                '  </file>\n' +
                '</xliff>';

            const result = merge(sourceFileContent, destFileContent);

            expect(norm(result)).toEqual(norm('<xliff version="2.0" xmlns="urn:oasis:names:tc:xliff:document:2.0" srcLang="de" trgLang="fr-CH">\n' +
                '  <file original="ng.template" id="ngi18n">\n' +
                '    <unit id="ID1">\n' +
                '      <notes>\n' +
                '        <note category="location">D:/Localization/Angular/Bugs/Icu/src/app/app.component.ts:2</note>\n' +
                '      </notes>\n' +
                '      <segment state="initial">\n' +
                '        <source>source text</source>\n' +
                '        <target>source text</target>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '</xliff>'));
        });
        test('should update notes', () => {
            const sourceFileContent = '<xliff version="2.0" xmlns="urn:oasis:names:tc:xliff:document:2.0" srcLang="de">\n' +
                '  <file original="ng.template" id="ngi18n">\n' +
                '    <unit id="ID1">\n' +
                '      <notes>\n' +
                '        <note category="location">A NEW LOCATION</note>\n' +
                '      </notes>' +
                '      <segment>\n' +
                '        <source>source text</source>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '</xliff>';
            const destFileContent = '<xliff version="2.0" xmlns="urn:oasis:names:tc:xliff:document:2.0" srcLang="de" trgLang="fr-CH">\n' +
                '  <file original="ng.template" id="ngi18n">\n' +
                '    <unit id="ID1">\n' +
                '      <notes>\n' +
                '        <note category="location">some old location</note>\n' +
                '      </notes>\n' +
                '      <segment state="initial">\n' +
                '        <source>source text</source>\n' +
                '        <target>source text</target>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '</xliff>';

            const result = merge(sourceFileContent, destFileContent);

            expect(norm(result)).toEqual(norm('<xliff version="2.0" xmlns="urn:oasis:names:tc:xliff:document:2.0" srcLang="de" trgLang="fr-CH">\n' +
                '  <file original="ng.template" id="ngi18n">\n' +
                '    <unit id="ID1">\n' +
                '      <notes>\n' +
                '        <note category="location">A NEW LOCATION</note>\n' +
                '      </notes>\n' +
                '      <segment state="initial">\n' +
                '        <source>source text</source>\n' +
                '        <target>source text</target>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '</xliff>'));
        });
    });

});

function norm(xml: string): string {
    return new XmlDocument(xml).toString({compressed: true, preserveWhitespace: false});
}
