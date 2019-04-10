import * as Express from 'express';
import { META_DATA } from "./constant";


class TypadaFactory {
    private readonly app = Express();

    createInstance(middlewares?: Array<Express.RequestHandler>) {
        
        const controllers = Reflect.getMetadata(META_DATA.application, Reflect);
        
        for(const controller of controllers) {
            const { middlewares } = controller;
            middlewares.length > 0 ? this.app.use(controller.basePath, ...controller.middlewares, controller.router) : this.app.use(controller.basePath, controller.router);
        }

        if(middlewares){
            this.app.use(middlewares)
        }
        
        return this.app;
    }
}


export const TypadaExpressInstance = new TypadaFactory();