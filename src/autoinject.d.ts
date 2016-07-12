declare const activate: ClassDecorator;
declare const key: ((key: any) => ClassDecorator);
declare const autoinject: ClassDecorator;
declare const transient: (key?: any) => ClassDecorator;
declare const singleton: {
    (registerInChild?: boolean): ClassDecorator;
    (key: any, registerInChild?: boolean): ClassDecorator;
};
declare const inject: ParameterDecorator;
declare const all: ParameterDecorator;
declare const factory: ParameterDecorator;
declare const lazy: ParameterDecorator;
declare const newInstance: ParameterDecorator;
declare const optional: ParameterDecorator;

declare namespace NodeJS {
    export interface Global {
        activate: ClassDecorator;
        key: ((key: any) => ClassDecorator);
        autoinject: ClassDecorator | ((key: any) => ClassDecorator);
        transient: (key?: any) => ClassDecorator;
        singleton: {
            (registerInChild?: boolean): ClassDecorator;
            (key: any, registerInChild?: boolean): ClassDecorator;
        };

        inject: ParameterDecorator;
        all: ParameterDecorator;
        factory: ParameterDecorator;
        lazy: ParameterDecorator;
        newInstance: ParameterDecorator;
        optional: ParameterDecorator;
    }
}
