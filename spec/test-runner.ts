/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
/* tslint:disable:no-any no-require-imports no-inner-html */
import { readFileSync } from 'fs';
import { join } from 'path';
import { CompositeDisposable } from 'ts-disposables';

module.exports = (
    {testPaths, buildAtomEnvironment, buildDefaultApplicationDelegate, headless}: {
        testPaths: string[];
        buildAtomEnvironment: (opts: any) => typeof atom;
        applicationDelegate: any;
        window: Window;
        document: Document;
        enablePersistence: boolean;
        buildDefaultApplicationDelegate: any;
        logFile: string;
        headless: boolean
    }): Promise<number> => {
    console.log(testPaths);
    // const fixtures = testPaths.map(x => join(x, 'fixtures'));

    const applicationDelegate = buildDefaultApplicationDelegate();

    applicationDelegate.setRepresentedFilename = () => {/* */ };
    applicationDelegate.setWindowDocumentEdited = () => {/* */ };

    const mochaCtor: typeof Mocha = require('mocha');
    const globby: (paths: string[]) => Promise<string[]> = require('globby');

    const instance = buildAtomEnvironment({
        applicationDelegate: applicationDelegate,
        window, document,
        configDirPath: process.env.ATOM_HOME,
        enablePersistence: false
    });

    (<any>document).atom = instance;
    (<any>window).atom = instance;
    (<any>global).atom = instance;

    const atomDiv = document.createElement('div');
    atomDiv.style.display = 'none';
    document.body.appendChild(atomDiv);
    atomDiv.appendChild(<any>atom.views.getView(atom.workspace));

    const mochaDiv = document.createElement('div');
    mochaDiv.id = 'mocha';
    document.body.appendChild(mochaDiv);

    const mochaCss = document.createElement('style');
    mochaCss.innerHTML = `html, body { overflow: inherit; }\n` + readFileSync(join(__dirname, '..', 'node_modules', 'mocha', 'mocha.css')).toString();
    document.head.appendChild(mochaCss);

    const mocha = new mochaCtor({
        ui: 'bdd',
        reporter: headless ? 'mocha-unfunk-reporter' : 'html',
        timeout: 60000,
        // grep: new RegExp("editor switch")
    });

    let cd: CompositeDisposable;

    (<any>mocha).suite.beforeEach(() => {
        cd = new CompositeDisposable();

        // process.chdir(fixtures[0]);
        // atom.project.setPaths(<any>fixtures);
    });

    (<any>mocha).suite.afterEach(() => {
        cd.dispose();
        atom.packages.deactivatePackages();
        (<any>atom).reset();
    });

    return Promise.all(testPaths.map(path => globby([join(path, '**/*Spec.js')])
        .then(fs => fs.forEach(f => mocha.addFile(f)))))
        .then(() => {
            return new Promise<number>(resolve => mocha.run(resolve));
        });
};
