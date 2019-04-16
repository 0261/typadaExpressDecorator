## typadaExpressDecorator

### What is it ?
- Typescript + ES6 + Decorator + Express = ts-decorator-express
- 타입스크립트와 데코레이터로 만들어진 expressjs Wrapper



### Feature
- Method Decorator( Get, Put, Post, Delete, Patch ) + Method Level Middleware
- Controller Decorator + Controller Level Middleware
- Application Level Middleware
- Required Parameter( >= 1.0.21 )


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
 - Controller 클래스를 생성합니다. TypadaExpressInstance에 Controller 클래스를 등록하기 위해 Controller 데코레이터를 사용합니다.
 - Controller 데코레이터는 첫번 째 인자로 path를 받습니다. 두번 째 인자로 Controller 클래스에 적용될 middleware를 받습니다.

 - Controller 클래스에 정의된 함수들에 httpMethod 데코레이터를 사용합니다.
 - httpMethod 데코레이터는 Get, Put, Delete, Patch, Post를 지원합니다.
 - 첫번 째 인자로 path를 받습니다. 두번 째 인자로 middleware를 받습니다. ( 주의: 첫 path에는 '/'를 사용하지 않습니다. )
 - httpMethod 데코레이터가 붙은 함수는 자동으로 Controller Route에 등록됩니다.
 - path는 express의 path를 따라갑니다. (e.g, :id => /users/1, /users/2, /users/3, :id/order => /users/1/order ..., 정규식도 지원합니다.)
 - Required 데코레이터는 request에 담겨져있는 값 중 필수값들을 지정하는 데코레이터입니다. Required 데코레이터는 Body함수와 Query함수를 이용해 사용가능합니다. Body함수는 문자열 배열을 인수로 받습니다. Request Body안에 인수로 넣은 문자열이 없을 경우 에러를 호출합니다.
 - 위의 예시는 /users로 Post요청했을 경우 QueryString에 id와 email을 필수 값으로 지정하고 Request Body에 password를 필수 값으로 지정한 예시입니다.
 - 참고 @Required.Body(['123']).Body(['456']).Body(['789']).Query(['000']).Body(...).Query(...).Query(...).Body(['564'
 ]).Query(['092']) ...처럼 무한히 체이닝 할 경우 마지막 값만 적용됩니다.

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
    + 안정화
 
