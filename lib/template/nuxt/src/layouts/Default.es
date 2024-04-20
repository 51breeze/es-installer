package layouts
import web.components.Component
class Default extends Component{
    @Override
    protected render(){
        return <div>
            <slot:default />
        </div>
    }
}