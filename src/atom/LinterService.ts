/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
export class LinterService {
    private _registry: Linter.IndieRegistry;
    public set registry(registry: Linter.IndieRegistry) {
        this._registry = registry;
    }

    public getLinter(name: string) {
        return this._registry.register({ name });
    }
}
