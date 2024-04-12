//这里是应用配置
export const imgHost = 'http://127.0.0.1:8090/img';

let http = null;
when( Env(NODE_ENV, development) ){
    http = 'http://127.0.0.1:8090/api'
}then{
    http = 'http://127.0.0.1:8090/'
}

export default {
    title:'title',
    http
}