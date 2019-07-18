// factory
// import createExpress, { Application as Express } from 'express';
// export class Application {
//     private readonly express: Express;

//     public constructor(
//         private readonly options: Application.Options = {}
//     ) {
//         this.express = createExpress();

//         this.initialize();
//     }

//     private initialize(): void { }

//     public listen(callback?: () => void): void;
//     public listen(port?: number, callback?: () => void): void;
//     public listen(portOrCallback?: number | (() => void), callback?: () => void): void {
//         const port: number = this.options.port || 3000;
//         this.express.listen(port, callback);
//     }
// }
// export namespace Application {
//     export interface Options {
//         readonly port?: number;
//     }
// }

// export namespace ApplicationFactory {
//     export interface Options extends Application.Options { }

//     export function create(options?: ApplicationFactory.Options): Application {
//         return new Application(options);
//     }
// }

// const application: Application = ApplicationFactory.create({
//     port: 80
// });

// application.listen((): void => {
//     console.log('Application is running.');
// }); test pull panda
