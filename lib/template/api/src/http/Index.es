package api.http;

import server.kernel.Controller;

class Index extends Controller{

      @Get('/')
      public hello(){
            return `Hello`;
      }
      
      @Post('/list')
      public list(){
            return json( {list:''}, 200 );
      }

}