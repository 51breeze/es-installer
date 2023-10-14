package components;
import web.components.Component

class List extends Component {

    items:({label:string})[] = [];

   // title:string ='the is list Component';

    fromData={check:'string',type:'123',  account: 'string',password: 'string'};

    @Reactive
    private name = 'the is list Component';

    get title(){
        return this.name;
    }

    set title(value:string){
        this.name = value;
    }

    private _homePage = null;

    @Injector
    set homePage(value){
        this._homePage = value;
         console.log('------Injector(homePage)---------', value )
    }

    get homePage(){
        return this._homePage;
    }

    private lists = null;

    @Injector(list)
    set homeList(value){
        this.lists = value;
    }

    @Override
    render(){

        console.log('---List Component----render-----', this.title, this.items, this.fromData );

        return <div class="list" xmlns:ui="web.ui" xmlns:d="@directives">
            <h5 ref='title'>{this.title}</h5>
            <h6>{this.name}</h6>
            <div class='for-way1'>
                <d:for name="items" item="item" key="key">
                    <span ref='way1-item'>{item.label}</span>
                </d:for>
            </div>

            <div class='for-way2'>
                <span d:for="(item,index) in items">
                    {item.label}-{index}
                </span>
            </div>

            <div class='for-way3'>
                <span d:each="(item,index) in items">
                    {item.label}-{index}
                </span>
            </div>

            <div class='for-way4'>
                <d:each name="items" item="item" key="key" >
                    {item.label}-{key}
                </d:each>
            </div>

            <div class='from-data'>
                <div d:for="(item,key) in fromData" class={key}>
                    {key}:{item}
                </div>
            </div>
            
        </div>
    }

}