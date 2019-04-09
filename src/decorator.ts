import * as Express from 'express';
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

export function Application(controllers: Array<ControllerMetadata>) {
    return function(target: any) {
        const routers = controllers.map( controller => {
            const router = resolveRouter(controller);
            return {
                router,
                basePath: controller.basePath
            };
        });
        const currentRouterMetadata = routers
        Reflect.defineMetadata(META_DATA.router, currentRouterMetadata, Reflect);
    }
}

function resolveRouter(controller: ControllerMetadata) {
    const expressRouter = Express.Router();
    const { instance }  = controller;
    for(const property in instance) {
        if( instance[property].metadata) {
            const metadata = instance[property].metadata;
            const route = (req:Express.Request, res:Express.Response, next:Express.NextFunction) => {
                return instance[property](req,res,next);
            };
            expressRouter[metadata.method](metadata.path, route);            
        }
    }
    return expressRouter;
}

export function Get(path?: string, ...middleware: Middleware[]): MethodDecorator {
    return httpMethod('get', path, ...middleware);
}

export function Post(path?: string, ...middleware: Middleware[]): MethodDecorator {
    return httpMethod('post', path, ...middleware);
}

export function Put(path?: string, ...middleware: Middleware[]): MethodDecorator {
    return httpMethod('put', path, ...middleware);
}

export function Delete(path?: string, ...middleware: Middleware[]): MethodDecorator {
    return httpMethod('delete', path, ...middleware);
}

function httpMethod(method: Method, path?: string, ...middleware: Middleware[]): MethodDecorator {

    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {

        const originalMethod = descriptor.value;
        descriptor.value = function(...args: any[]) {
            return originalMethod.apply(this, args);
        };        
        const currentMetadata: ControllerMethodMetadata = {
            method,
            middleware,
            path: path ? `/${path}` : ''
        }
        Reflect.defineMetadata(META_DATA.method, currentMetadata, target);
        descriptor.value.metadata = Reflect.getMetadata(META_DATA.method, target);
        return descriptor;
    };
}