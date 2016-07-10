declare const key: ((key: any) => ClassDecorator);
declare const inject: ClassDecorator;
declare const transient: (key?: any) => ClassDecorator;
declare const singleton: {
    (registerInChild?: boolean): ClassDecorator;
    (key: any, registerInChild?: boolean): ClassDecorator;
};

declare namespace NodeJS {
    export interface Global {
        key: ((key: any) => ClassDecorator);
        inject: ClassDecorator | ((key: any) => ClassDecorator);
        transient: (key?: any) => ClassDecorator;
        singleton: {
            (registerInChild?: boolean): ClassDecorator;
            (key: any, registerInChild?: boolean): ClassDecorator;
        };

    }
}
