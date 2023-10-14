package components;
import web.components.Component

class Directive extends Component {

    condition:boolean = true;

    @Injector
    set list(value){
        console.log('------Directive Injector(Home page list)---------', value )
    }
    
    @Override
    render(){
        console.log('---Directive Component render---', this.condition)
        return <div class="directive" xmlns:ui="web.ui" xmlns:d="@directives">
            <div class='if-condition'>
                <div d:if="condition" class='way-1'>if-way 1</div>
                <d:if condition="condition">
                    <div class='way-2'>if-way 2-1</div>
                    <div class='way-2'>if-way 2-2</div>
                </d:if>
            </div>
            <div class='show'>
                <div d:show="condition" class='way-1'>show-way 1</div>
                <d:show condition="condition">
                    <div class='way-2'>show-way 2-1</div>
                    <div class='way-2'>show-way 2-2</div>
                </d:show>
            </div>
        </div>
    }

}