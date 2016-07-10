// http://flight-manual.atom.io/behind-atom/sections/serialization-in-atom/
interface IAtomPackage<TSettings> {
    version: number;
    serialize(): any;
    activate(state: TSettings): void;
    deactivate(): void;
}
