package api.http;

class Index{

      @Get('/')
      public hello(){
            return `Hello`;
      }
      
      @Post('/list')
      public list(){
            return json( {list:''}, 200 );
      }

}