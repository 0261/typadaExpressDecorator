import * as Express from 'express';
import { META_DATA } from "./constant";


class TypadaFactory {
    private readonly app = Express();

    createInstance(middlewares?: Array<Express.RequestHandler>) {
        
        const controllers = Reflect.getMetadata(META_DATA.application, Reflect);
        
        // add middleware to controllers
        if(controllers){
            controllers.forEach(controller => {
                const { middlewares } = controller;
                middlewares.length > 0 ? this.app.use(controller.basePath, ...controller.middlewares, controller.router) : this.app.use(controller.basePath, controller.router);    
            })
        }
        
        // add middleware to express application
        if(middlewares){
            middlewares.forEach(middleware => {
                this.app.use(middleware);
            })
        }

        return this.app;
    }
}


export const TypadaExpressInstance = new TypadaFactory();