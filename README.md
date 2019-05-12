## typadaExpressDecorator

### What is it ?
- Typescript + ES6 + Decorator + Express = ts-decorator-express

### Feature
- Method Decorator( Get, Put, Post, Delete, Patch ) + Method Level Middleware
- Controller Decorator + Controller Level Middleware
- Application Level Middleware
- Required Parameter( >= 1.0.21 )
- Required Channing ( >= 1.0.28)
- Regexp Route ( >= 1.0.32)


### Getting Start
```sh
npm i -D express@4 @types/express typecript
npm i ts-decorator-express
```

> `express` 4 >=, `typescript` 2 >=, `node` 10 >=

### tsconfig.json
```json
{
    "compilerOptions": {
        "target": "es5",
        "lib": [
            "es2015",
        ],
        "types": ["reflect-metadata"],
        "module": "commonjs",
        "baseUrl": "./",
        "strictNullChecks": true,
        "moduleResolution": "node",
        "experimentalDecorators": true,
        "emitDecoratorMetadata": true,
    },
    "exclude": [
        "node_modules"
    ]
}
```



## Example

```typescript
// ./server.ts

import './src/controllers';
import { TypadaExpressInstance } from "ts-decorator-express";
import * as Express from 'express';

const app = TypadaExpressInstance.createInstance([
    Express.json(), Express.urlencoded({ extended: true }),
]);

app.listen(3001, () => {
    console.log('Typada Express Decorator Start, ', 3001);
});
```

```typescript
// ./src/controllers/users
import { Controller, Get } from "ts-decorator-express";
import { middle1, middle2, middle3 } from "../middlewares";

@Controller('/users', middle1, middle2, middle3)
export class User {
    
    @Get('', middle1, middle2 ,middle3)
    async getUsers(req, res, next) {
        try {
            console.log('get Users')
            return res.status(200).json({
                status:200
            })
        } catch (error) {
            console.log(error);
        }
    }
    
    @Get(/\d/)
    async getUserById(req, res, next) {
        try{
         	console.log('get User By Id');
            return res.status(200).json({
                status:200
            })            
        } catch (error) {
            console.log(error);            
        }        
	}
    
    @Post('')
    async createUser(@Required.Body(['password']).Query(['id', 'email']) req, res, next) {
        try {
            console.log('create User')
            return res.status(200).json({
                status:200
            })
        } catch (error) {
            console.log(error);
        }
    }    
}
```
```typescript
// ./src/controllers/index
import './user';
```

```typescript
import { Request, Response, NextFunction } from "express";

export const middle1 = (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log('middle1');
        next();
    } catch (error) {
        console.log(error);
    }
}
export const middle2 = (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log('middle2');
        next();
    } catch (error) {
        console.log(error);
    }
}
export const middle3 = (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log('middle3');
        next();
    } catch (error) {
        console.log(error);
    }
}
export const middle4 = (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log('middle4');
        next();
    } catch (error) {
        console.log(error);
    }
}
```


## Result

`http://localhost:3001/users`



## Versioning
+ v1.0.32
    + add Regexp Route
+ v1.0.28
    + add required Chaning
+ v1.0.20
    + required decorator
+ v1.0.15
    + proxy instance
+ v1.0.10
    + 

