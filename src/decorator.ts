import { ControllerMetadata, ControllerMethodMetadata, Method, Middleware } from '@src/interface';
import { META_DATA } from "@src/constant";

export function Controller(basePath: string, ...middleware: Middleware[]) {
    return function (target: any) {

        const currentMetadata: ControllerMetadata = {
            middleware,
            basePath,
            instance: new target()
        };

        Reflect.defineMetadata(META_DATA.controller, currentMetadata, target);
        
        const previousMetadata: ControllerMetadata[] = Reflect.getMetadata(
            META_DATA.controller,
            Reflect
        ) || [];

        const newMetadata = [currentMetadata, ...previousMetadata];
        
        Reflect.defineMetadata(
            META_DATA.controller,
            newMetadata,
            Reflect
        );
    }
}

export function Get(path?: string): MethodDecorator {
    return httpMethod('get', path);
}

export function Post(path?: string): MethodDecorator {
    return httpMethod('post', path);
}

export function Put(path?: string): MethodDecorator {
    return httpMethod('put', path);
}

export function Delete(path?: string): MethodDecorator {
    return httpMethod('delete', path);
}

function httpMethod(method: Method, path?: string): MethodDecorator {

    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {

        const originalMethod = descriptor.value;
        descriptor.value = function(...args: any[]) {
            return originalMethod.apply(this, args);
        };        
        const currentMetadata: ControllerMethodMetadata = {
            method,
            path: path ? `/${path}` : ''
        }
        Reflect.defineMetadata(META_DATA.method, currentMetadata, target);
        descriptor.value.metadata = Reflect.getMetadata(META_DATA.method, target);
        return descriptor;
    };
}