import 'reflect-metadata';
import * as Express from 'express';
import { META_DATA } from "./constant";
import { ControllerMetadata, ControllerMethodMetadata, Method, Middleware, ApplicationMethodMetadata } from './interface';


class TypadaFactory {
    private readonly app = Express();

    createInstance(applicationMiddleware: Array<Express.RequestHandler> = []) {
        
        const controllers = Reflect.getMetadata(META_DATA.application, Reflect) as Array<ApplicationMethodMetadata>;
        const attachedMiddleware = this.attachedMiddleware(controllers, applicationMiddleware);
        return this.app;
    }
    // attachControllerLevelMiddleware
    attachedMiddleware(controllers: Array<ApplicationMethodMetadata>, applicationMiddleware: Array<Express.RequestHandler> = []): boolean {
        try {

            if(!controllers) return false;

            controllers.map(controller => {
                const {basePath, router, middlewares } = controller;
                const totalMiddlewares = applicationMiddleware.length < 1 ? middlewares : middlewares.concat(applicationMiddleware);
                this.app.use(basePath, ...totalMiddlewares, router);
            });

            return true;
        } catch (error) {
            console.log(`attachControllerLevelMiddleware`, error);
            return false;
        }
    }
}


export const TypadaExpressInstance = new TypadaFactory();