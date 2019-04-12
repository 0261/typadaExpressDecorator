import * as Express from 'express';
import { ControllerMetadata, ControllerMethodMetadata, Method, Middleware, ApplicationMethodMetadata, RequestParameter, RequiredParameterMetadata } from './interface';
import { META_DATA } from "./constant";

export function Controller(basePath: string, ...middlewares: Array<Middleware>) {
    return function (target: any) {

        const currentMetadata: ControllerMetadata = {
            middlewares,
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

        const expressRouter = Express.Router();
        const controller: ControllerMetadata = Reflect.getMetadata(META_DATA.controller, target);
        const controllerMiddleware: Array<Middleware> = controller.middlewares;
        const { instance } = controller;

        for(const methodName in instance) {
            // decorated method
            const { metadata } = instance[methodName];
            if ( metadata && typeof instance[methodName] === 'function') {
                const callbackFunction = (req:Express.Request, res: Express.Response, next: Express.NextFunction): Express.RequestHandler => {
                    return instance[methodName](req, res, next);
                }
                const routerMiddlewares = metadata.middlewares;
                routerMiddlewares ? expressRouter[metadata.method](metadata.path, routerMiddlewares ,callbackFunction) : expressRouter[metadata.method](metadata.path, callbackFunction);
            }
        }

        const currentApplicationMetadata: ApplicationMethodMetadata = {
            basePath: controller.basePath,
            middlewares: controllerMiddleware,
            router: expressRouter
        }

        Reflect.defineMetadata(META_DATA.application, currentApplicationMetadata, target);
        const previousApplicationMetadata = Reflect.getMetadata(
            META_DATA.application,
            Reflect
        ) || [];
        const newApplicationMetadata = [currentApplicationMetadata, ...previousApplicationMetadata];
        Reflect.defineMetadata(META_DATA.application, newApplicationMetadata, Reflect);
        
    }
}

export function Required(path: 'body' | 'query', requiredParameters: Array<string>){

    return function(target: Object, propertyKey: string | symbol, parameterIndex: number) {

        let existingRequiredParameters: Array<RequiredParameterMetadata> = Reflect.getOwnMetadata(META_DATA.parameter, target, propertyKey) || [];

        const currentRequiredParameterMetadata: RequiredParameterMetadata = {
            index: parameterIndex,
            path,
            requiredParameters
        }
        
        existingRequiredParameters.push(currentRequiredParameterMetadata);
        
        Reflect.defineMetadata(META_DATA.parameter, existingRequiredParameters, target, propertyKey);
    }
}

export function Get(path?: string, ...middleware: Array<Middleware>): MethodDecorator {
    return httpMethod('get', path, ...middleware);
}

export function Post(path?: string, ...middleware: Array<Middleware>): MethodDecorator {
    return httpMethod('post', path, ...middleware);
}

export function Put(path?: string, ...middleware: Array<Middleware>): MethodDecorator {
    return httpMethod('put', path, ...middleware);
}

export function Delete(path?: string, ...middleware: Array<Middleware>): MethodDecorator {
    return httpMethod('delete', path, ...middleware);
}

export function Patch(path?: string, ...middleware: Array<Middleware>): MethodDecorator {
    return httpMethod('patch', path, ...middleware);
}

export function Middleware(middleware: Array<Middleware>): MethodDecorator {
    return function(target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor): PropertyDescriptor {
        const originalMethod = descriptor.value;
        descriptor.value = function(...args: any[]) {
            return originalMethod.apply(this, args);
        };
        descriptor.value.middleware = middleware;
        return descriptor;
    };
}

function httpMethod(method: Method, path?: string, ...middlewares: Array<Middleware>): MethodDecorator {

    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {

        const originalMethod = descriptor.value;
        descriptor.value = function() {
            const requiredParameters: Array<RequiredParameterMetadata> = Reflect.getOwnMetadata(META_DATA.parameter, target, propertyKey);
            validateRequiredParameter(requiredParameters, arguments);
            return originalMethod.apply(this, arguments);
        };        
        const currentMetadata: ControllerMethodMetadata = {
            middlewares,
            method,
            path: path ? `/${path}` : ''
        }
        Reflect.defineMetadata(META_DATA.method, currentMetadata, target);
        descriptor.value.metadata = Reflect.getMetadata(META_DATA.method, target);
        return descriptor;
    };
}

/**
 * @todo decorator chaining
 */
function validateRequiredParameter(requiredParameters: Array<RequiredParameterMetadata>, args) {
    const { method, query, body } = args[requiredParameters[0].index] as RequestParameter;
    const required = requiredParameters[0];
    const valiationPath = method !== 'GET' ? body : query;
    if(required) {
        for(const requiredParameter of required.requiredParameters){
            if(valiationPath[requiredParameter] === undefined){
                throw new Error(`Invalid argument, need [ ${requiredParameter} ] parameter.`);
            }
        }
    }
}