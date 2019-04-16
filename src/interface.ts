import * as Express from 'express';
import * as http from "http";

export type Middleware = Express.RequestHandler;

export interface ControllerMetadata {
    basePath: string;
    middlewares: Array<Middleware>;
    instance: new () => any;
}

export type Method = 'post' | 'get' | 'patch' | 'put' | 'delete';

export interface ControllerMethodMetadata {
    method: Method;
    path: string;
    middlewares: Array<Middleware>;
}

export type ControllerMiddlewareMetadata = Array<Middleware>;

export interface ApplicationMethodMetadata {
    basePath: string;
    router: Express.Router;
    middlewares: Array<Middleware>;
}

export interface RequiredParameterMetadata {
    index: number;
    path: string;
    requiredParameters: Array<any>;
}


export interface ProxyInstance {
    listen(port: number, hostname: string, backlog: number, callback?: Function): http.Server;
    listen(port: number, hostname: string, callback?: Function): http.Server;
    listen(port: number, callback?: Function): http.Server;
    listen(path: string, callback?: Function): http.Server;
    listen(handle: any, listeningListener?: Function): http.Server;
    locals: any;
    path(): string;
    set(setting: string, val: any): Express.Application;
    param(name: string | string[], handler: Express.RequestParamHandler): this;
    param(callback: (name: string, matcher: RegExp) => Express.RequestParamHandler): this;
}

export interface ProxyOptions {
    proxy: boolean;
}


export interface RequestParameter {
    body: {};
    query: {};
    method: string;
}

export interface ValidationDecorator {
    Body(values: Array<string>, ): ValidationDecorator & ParameterDecorator;
    Query(values: Array<string>, ): ValidationDecorator & ParameterDecorator;
}

export interface ExistingRequiredParameters {
    query: Array<string>;
    body: Array<string>;
}
