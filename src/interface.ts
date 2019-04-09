import * as Express from 'express';

export type Middleware = Express.RequestHandler;

export interface ControllerMetadata {
    basePath: string;
    // middlewares: Middleware[];
    instance: new () => any;
}

export type Method = 'post' | 'get' | 'patch' | 'put' | 'delete';

export interface ControllerMethodMetadata {
    method: Method;
    path: string;
    middleware: Middleware[];
}

export type ControllerMiddlewareMetadata = Array<Middleware>;
