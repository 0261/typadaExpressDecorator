## typadaExpressDecorator

### What is it ?
- Typescript + ES6 + Decorator + Express = ts-decorator-express
- 타입스크립트와 데코레이터로 만들어진 expressjs Wrapper



### Feature
- Method Decorator( Get, Put, Post, Delete, Patch ) + Middleware
- Controller Decorator + Middleware


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

const app = TypadaExpressInstance.createInstance();

app.listen(3001, () => {
    console.log('Typada Express Decorator Start, ', 3001);
});
```

 - TypadaExpressInstance.createInstance()를 호출해 Express Application Server를 생성합니다.
 - createInstance는 어플리케이션단에 적용되는 Middleware를 인자로 받을 수 있습니다.
 
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
    
    @Get(':id')
    async getUser(req, res, next) {
        try {
            console.log('get User')
            return res.status(200).json({
                status:200
            })
        } catch (error) {
            console.log(error);
        }
    }
}
```
 - Controller 클래스를 생성합니다. TypadaExpressInstance에 Controller 클래스를 등록하기 위해 Controller 데코레이터를 사용합니다.
 - Controller 데코레이터는 첫번 째 인자로 path를 받습니다. 두번 째 인자로 Controller 클래스에 적용될 middleware를 받습니다.

 - Controller 클래스에 정의된 함수들에 httpMethod 데코레이터를 사용합니다.
 - httpMethod 데코레이터는 Get, Put, Delete, Patch, Post를 지원합니다.
 - 첫번 째 인자로 path를 받습니다. 두번 째 인자로 middleware를 받습니다. ( 주의: 첫 path에는 '/'를 사용하지 않습니다. )
 - httpMethod 데코레이터가 붙은 함수는 자동으로 Controller Route에 등록됩니다.
 - path는 express의 path를 따라갑니다. (e.g, :id => /users/1, /users/2, /users/3, :id/order => /users/1/order ..., 정규식도 지원합니다.)

```typescript
// ./src/controllers/index
import './user';
```

 - 만들어진 컨트롤러를 수입합니다. 이렇게 수입된 컨트롤러는 TypadaExpressInstance에 자동으로 등록되어 Express Application Server의 컨트롤러 역할을 합니다.

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

- 미들웨어입니다.




## Result

`http://localhost:3001/users`에서 확인 가능합니다.





## versioning

+ v1.0.20
    + required decorator 추가
+ v1.0.15
    + proxy instance 추가
+ v1.0.10
    + 
 
