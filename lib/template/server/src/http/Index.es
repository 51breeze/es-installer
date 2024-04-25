package http

import app.model.User;


class Index{

      @Get('/')
      public hello(){
            const user = new User();
            return `Hello, ${user.userName}!`;
      }
      
      @Post('/list')
      public list(){
            const user = new User();
            return json( user.list(), 200 );
      }

}