/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import { ChildProcess } from 'child_process';
/* tslint:disable:variable-name no-any */

export interface IStreamInfo {
    writer: NodeJS.WritableStream;
    reader: NodeJS.ReadableStream;
}

export interface IExecutableOptions {
    cwd?: string;
    stdio?: string | string[];
    env?: any;
    detached?: boolean;
}

export interface IExecutable {
    command: string;
    args?: string[];
    options?: IExecutableOptions;
}

export interface IForkOptions {
    cwd?: string;
    env?: any;
    encoding?: string;
    execArgv?: string[];
}

export enum TransportKind {
    stdio,
    ipc
}

export interface INodeModule {
    module: string;
    transport?: TransportKind;
    args?: string[];
    runtime?: string;
    options?: IForkOptions;
}

export type ILanguageProtocolServerOptions = IExecutable | { run: IExecutable; debug: IExecutable; } |  { run: INodeModule; debug: INodeModule } | INodeModule | (() => Promise<ChildProcess | IStreamInfo>);
