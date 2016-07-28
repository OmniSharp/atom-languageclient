/* tslint:disable-next-line */
/// <reference path="../typings/modules/lodash/index.d.ts" />
/**
 * A custom rule to enforce sort order on imports
 */
import * as _ from 'lodash';
import * as Lint from 'tslint/lib/lint';
import * as ts from 'typescript';

type ImportOrExportDeclaration = ts.ImportDeclaration | ts.ImportEqualsDeclaration | ts.ExportDeclaration;

export class Rule extends Lint.Rules.AbstractRule {
    public apply(sourceFile: ts.SourceFile) {
        return this.applyWithWalker(new SortImportsWalker(sourceFile, this.getOptions()));
    }
}

class SortImportsWalker extends Lint.RuleWalker {
    public visitSourceFile(node: ts.SourceFile) {
        const imports = this._getImports(node);
        const importCompareLines = _.map(imports, getSortKey);
        const sortedImportLines = _.sortBy(importCompareLines, customSortKey);

        _.each(imports, (actualImport, index) => {
            if (importCompareLines[index] !== sortedImportLines[index]) {
                const expectedImportIndex = _.findIndex(importCompareLines, line => line === sortedImportLines[index]);
                const expectedImport = imports[expectedImportIndex];
                this.addFailure(this._getImportFailure(expectedImport, actualImport));
            }
        });

        _.each(imports, statement => {
            if (isImportStatement(statement) && !isImportRequireStatement(statement) && statement.importClause) {
                const bindings = statement.importClause.namedBindings;
                if (bindings) {
                    if (isNamedImports(bindings)) {
                        const elements = _.map(bindings.elements, x => x.getText());
                        const sortedElements = _.sortBy(elements, customSortKey);

                        if (!_.isEqual(elements, sortedElements)) {

                            this.addFailure(this._getClauseFailure(statement.importClause, elements, sortedElements));
                        }
                    }
                }
            } else if (isExportStatement(statement) && !isImportRequireStatement(statement) && statement.exportClause) {
                const elements = _.map(statement.exportClause.elements, x => x.getText());
                const sortedElements = _.sortBy(elements, customSortKey);

                if (!_.isEqual(elements, sortedElements)) {
                    this.addFailure(this._getClauseFailure(statement.exportClause, elements, sortedElements));
                }
            }
        });

        const groups = _.groupBy(
            _.filter(imports, statement => ((isImportStatement(statement) || isExportStatement(statement)) && !isImportRequireStatement(statement)) && statement.moduleSpecifier),
            (statement: ts.ImportDeclaration | ts.ExportDeclaration) => `${statement.kind}|${_.trim(statement.moduleSpecifier.getText(), '\'"')}`);

        _.each(groups, (statements, key) => {
            if (statements.length > 1) {
                _.each(this._getDuplicateFailure(key, statements), x => this.addFailure(x));
            }
        });

        super.visitSourceFile(node);
    }

    private _getImports(sourceFile: ts.SourceFile) {
        let nonImportFound: ts.Statement = null;
        const imports: ImportOrExportDeclaration[] = [];

        for (const statement of sourceFile.statements) {
            if (statement.kind === ts.SyntaxKind.JSDocComment ||
                statement.kind === ts.SyntaxKind.MultiLineCommentTrivia ||
                statement.kind === ts.SyntaxKind.SingleLineCommentTrivia) {
                continue;
            }

            if (isTargetStatement(statement)) {
                if (nonImportFound) {
                    this.addFailure(
                        this.createFailure(
                            nonImportFound.getStart(),
                            nonImportFound.getWidth(),
                            'order imports: unexpected import after code has started'
                        )
                    );
                    nonImportFound = null;
                }

                imports.push(statement);
            } else {
                nonImportFound = statement;
            }
        }

        return imports;
    }

    private _getImportFailure(expectedImport: ImportOrExportDeclaration, actualImport: ImportOrExportDeclaration) {
        const expected = getImportBindingName(expectedImport);
        const actual = getImportBindingName(actualImport);
        const message = `order imports: expected '${expected}' but saw '${actual}'`;
        return this.createFailure(
            actualImport.getStart(),
            actualImport.getWidth(),
            message
        );
    }

    private _getClauseFailure(clause: ts.ImportClause | ts.NamedExports, actualStatements: string[], expectedStatements: string[]) {
        const message = `order imports: expected '{ ${expectedStatements.join(', ')} }' but saw '{ ${actualStatements.join(', ')}' }`;
        return this.createFailure(
            clause.getStart(),
            clause.getWidth(),
            message
        );
    }

    private _getDuplicateFailure(key: string, imports: ImportOrExportDeclaration[]) {
        const values = key.split('|');
        const kind = _.toNumber(key.split('|')[0]);
        const name = values[1];
        const message = `order imports: duplicate ${ts.SyntaxKind[kind].toLowerCase()} '${name}' found and should be consolidated`;
        return _.map(imports, x => this.createFailure(x.getStart(), x.getWidth(), message));
    }
}

function getSortKey(statement: ImportOrExportDeclaration) {
    try {
        if (isImportStatement(statement) && !isImportRequireStatement(statement)) {
            return _.trim(statement.moduleSpecifier.getText(), '\'"');
        } else if (isExportStatement(statement) && !isImportRequireStatement(statement)) {
            return _.trim(statement.moduleSpecifier.getText(), '\'"');
        } else {
            return _.trim(statement.moduleReference.getText(), '\'"');
        }
    } catch (e) {
        return null;
    }
}

function isTargetStatement(node: ts.Node): node is ImportOrExportDeclaration {
    return (
        node.kind === ts.SyntaxKind.ImportDeclaration ||
        node.kind === ts.SyntaxKind.ExportDeclaration ||
        node.kind === ts.SyntaxKind.ImportEqualsDeclaration
    );
}

function getImportBindingName(node: ImportOrExportDeclaration) {
    if (isImportRequireStatement(node)) {
        return _.trim(node.moduleReference.getText(), '\'"');
    } else if (isExportStatement(node)) {
        return _.trim(node.moduleSpecifier.getText(), '\'"');
    } else {
        return _.trim(node.moduleSpecifier.getText(), '\'"');
    }
}

function isImportRequireStatement(node: ImportOrExportDeclaration): node is ts.ImportEqualsDeclaration {
    return node.kind === ts.SyntaxKind.ImportEqualsDeclaration;
}

function isExportStatement(node: ImportOrExportDeclaration): node is ts.ExportDeclaration {
    return node.kind === ts.SyntaxKind.ExportDeclaration;
}

function isImportStatement(node: ImportOrExportDeclaration): node is ts.ImportDeclaration {
    return node.kind === ts.SyntaxKind.ImportDeclaration;
}

function isNamedImports(node: ts.Node): node is ts.NamedImports {
    return node.kind === ts.SyntaxKind.NamedImports;
}

function customSortKey(key: string) {
    try {
        let result = key;
        if (key[0] === '@') {
            result = _.trim(key, '@').toLowerCase();
        } else if (_.startsWith(key, 'lodash')) {
            result = `0${key}`;
        } else if (_.startsWith(key, `rxjs`)) {
            result = `0${key}`;
        } else if (_.startsWith(key, './') || _.startsWith(key, '../')) {
            const split = key.split('/');
            let prefix: string;
            result = _.last(split);
            if (result === 'index') {
                result = _.nth(split, -2);
            }
            if (result.match(/^[A-Z]/)) {
                prefix = 'z';
            } else {
                prefix = 'y';
            }
            result = `${prefix}${result}`.toLowerCase();
        }

        return result.replace(/\//g, '');
    } catch (e) {
        return null;
    }
}
