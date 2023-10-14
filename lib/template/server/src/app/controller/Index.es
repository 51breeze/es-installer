package app.controller;

import server.kernel.Controller;
import app.model.User;

import "../../assets/main.js";
import "../../assets/style.css";

class Index extends Controller{

      @Embed('../../assets/less/index.less')
      file:string;

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