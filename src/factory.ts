import 'reflect-metadata';
import * as Express from 'express';
import { META_DATA } from "./constant";
import { ApplicationMethodMetadata, ProxyInstance } from './interface';


class TypadaFactory {

    private readonly app: Express.Application = Express();

    createInstance(applicationMiddleware: Array<Express.RequestHandler> = []): ProxyInstance {
        
        const controllers = Reflect.getMetadata(META_DATA.application, Reflect) as Array<ApplicationMethodMetadata>;

        const proxyInstance = this.createProxyInstance();

        this.attachedMiddleware(controllers, applicationMiddleware);

        return proxyInstance;
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

    // create Proxy Instance
    createProxyInstance(): ProxyInstance {
        try {
            const handler = {
                get: (obj, prop) => {
                    if(META_DATA.AVAILABLE_EXPRESS_PROPERTY.includes(typeof prop === 'symbol' ? 'do not' : prop)){
                        return obj[prop]
                    }
                    return `Invalid Property: ${prop} property`;
                }
            }
            const proxyInstance = new Proxy(Express(), handler) as ProxyInstance;
            return proxyInstance;
        } catch (error) {
            console.log(error);
            throw new Error();
        }
    }
}


export const TypadaExpressInstance = new TypadaFactory();