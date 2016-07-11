/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
/* tslint:disable */
import * as cp from 'child_process';
import * as net from 'net';
import * as os from 'os';
import * as path from 'path';

export interface IForkOptions {
    cwd?: string;
    env?: any;
    encoding?: string;
    execArgv?: string[];
}

function makeRandomHexString(length: number): string {
    const chars = ['0', '1', '2', '3', '4', '5', '6', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];
    let result = '';
    for (let i = 0; i < length; i++) {
        const idx = Math.floor(chars.length * Math.random());
        result += chars[idx];
    }
    return result;
}

function generatePipeName(): string {
    const randomName = 'atom-' + makeRandomHexString(40);
    if (process.platform === 'win32') {
        return '\\\\.\\pipe\\' + randomName + '-sock';
    }

    // Mac/Unix: use socket file
    return path.join(os.tmpdir(), randomName + '.sock');
}

function generatePatchedEnv(env: any, stdInPipeName: string, stdOutPipeName: string): any {
    // Set the two unique pipe names and the electron flag as process env

    const newEnv: any = {};
    for (const key in env) {
        newEnv[key] = env[key];
    }

    newEnv['STDIN_PIPE_NAME'] = stdInPipeName;
    newEnv['STDOUT_PIPE_NAME'] = stdOutPipeName;
    newEnv['ATOM_SHELL_INTERNAL_RUN_AS_NODE'] = '1';

    return newEnv;
}

export function fork(modulePath: string, args: string[], options: IForkOptions, callback: (error: any, cp: cp.ChildProcess) => void): void {

    let callbackCalled = false;
    const resolve = (result: cp.ChildProcess) => {
        if (callbackCalled) {
            return;
        }
        callbackCalled = true;
        callback(null, result);
    };
    const reject = (err: any) => {
        if (callbackCalled) {
            return;
        }
        callbackCalled = true;
        callback(err, <any>null);
    };

    // Generate two unique pipe names
    const stdInPipeName = generatePipeName();
    const stdOutPipeName = generatePipeName();

    const newEnv = generatePatchedEnv(options.env || process.env, stdInPipeName, stdOutPipeName);

    let childProcess: cp.ChildProcess;

    // Begin listening to stdout pipe
    const server = net.createServer((stream) => {
        // The child process will write exactly one chunk with content `ready` when it has installed a listener to the stdin pipe

        stream.once('data', (chunk: Buffer) => {
            // The child process is sending me the `ready` chunk, time to connect to the stdin pipe
            childProcess.stdin = <any>net.connect(stdInPipeName);

            // From now on the childProcess.stdout is available for reading
            childProcess.stdout = stream;

            resolve(childProcess);
        });
    });
    server.listen(stdOutPipeName);

    let serverClosed = false;
    const closeServer = () => {
        if (serverClosed) {
            return;
        }
        serverClosed = true;
        server.close();
    }

    // Create the process
    const bootstrapperPath = path.join(__dirname, 'electronForkStart');
    childProcess = cp.fork(bootstrapperPath, [modulePath].concat(args), <any>{
        silent: true,
        cwd: options.cwd,
        env: newEnv,
        execArgv: options.execArgv
    });

    childProcess.once('error', (err: Error) => {
        closeServer();
        reject(err);
    });

    childProcess.once('exit', (err: Error) => {
        closeServer();
        reject(err);
    });
}
