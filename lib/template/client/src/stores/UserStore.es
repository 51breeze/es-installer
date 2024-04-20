package stores;

import web.Store;

class UserStore extends Store{

    userinfo = {name:'sss'};

    isLogin = false;

    set info( value ){
        this.persson = value;
    }

    get addName(){
        return userinfo.add;
    }

    fetch(){
        this.isLogin = true;
        this.setState('add', 'setState')
        this.userinfo.name = 'zs'
        return this.userinfo;
    }

    //每个Store都应该定义这个方法
    static use(){
        return Store.use(UserStore)
    }

}