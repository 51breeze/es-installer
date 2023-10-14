package;

import mp.Application;
class Bootstrap extends Application{

	static start(){
		const boot = new Bootstrap();
		boot.provide('esApp', boot)
		return boot.mount();
	}

	@Override
	get store(){
		return {bootstrap:this}
	}

	@Override
	protected onLaunch():void{
		
		 console.log('-------onLaunch--------', this.app )
	}

}