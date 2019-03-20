package
{
   import es.core.Application;
   import es.core.View;

   [Router(default=home)]
   public class Welcome extends Application 
   {
       public function Welcome()
       {
           super();
       }

       public function home()
       {
          //这是一个视图基类， 如果想实现自己的视图，可以使用基于 xml 的语法实现。
          var view:View = new View( this );
          this.title = "Welcome to EaseScript!";
          view.element.html("<h1 style='height:60px;line-height:60px;font-size:16px; text-align:center;'>Welcome to EaseScript ^v^</h1>");
       }
   }

}