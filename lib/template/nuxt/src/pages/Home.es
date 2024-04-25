package pages;

import web.components.Page

import logo from 'assets/logo.png';

import web.Lang

@Router('/')
class Home extends Page{

	switchLang(value){
		if(Lang.getLocale() !== value){
			Lang.setLocale(value)
			this.forceUpdate();
		}
	}

	@Override
	render(){
		return <div xmlns:d="@directives" class="container" xmlns:ui="web.ui">
				<div class="header">
					<ui:Dropdown>
						<ui:Button class="t-but">
							<span class="icon-t">
								<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M911.330758 158.080968c0-0.516042 0-1.032085 0-1.548127L911.330758 100.284226c0-17.717453-14.277171-31.994625-31.994625-31.994625-17.717453 0-31.994625 14.277171-31.994625 31.994625 0 0 0 25.802117-25.802117 25.802117l-622.69108 0c-25.802117 0-25.802117-25.802117-25.802117-25.802117 0-17.717453-14.277171-31.994625-31.994625-31.994625S109.056946 82.566773 109.056946 100.284226l0 153.952629c0 17.717453 14.277171 31.994625 31.994625 31.994625s31.994625-14.277171 31.994625-31.994625l0-0.172014c0-63.989249 63.989249-63.989249 63.989249-63.989249l152.060474 0c13.589115 1.204099 56.248614 8.944734 59.688896 57.452713l0 584.847976c-3.440282 48.507979-46.099782 56.248614-59.688896 57.452713l-37.843104 0c-17.717453 0-31.994625 14.277171-31.994625 31.994625s14.277171 31.994625 31.994625 31.994625l129.526625 0 0 0 0 0 59.172854 0 0 0 0 0 129.526625 0c17.717453 0 31.994625-14.277171 31.994625-31.994625s-14.277171-31.994625-31.994625-31.994625l-38.015118 0c-13.589115-1.204099-56.248614-8.944734-59.688896-57.452713l0-584.847976c3.440282-48.507979 46.099782-56.248614 59.688896-57.452713l151.88846 0c0 0 63.989249-0.172014 63.989249 63.989249l0 0.172014c0 17.717453 14.277171 31.994625 31.994625 31.994625s31.994625-14.277171 31.994625-31.994625l0-94.607761C911.330758 159.113052 911.330758 158.59701 911.330758 158.080968z"></path></svg>
							</span>
							<span>{Lang.fetch('home.lang')}</span>
						</ui:Button>
						<slot:dropdown>
							<ui:DropdownMenu>
								<ui:DropdownItem on:click={switchLang('zh-CN')}>{Lang.fetch('home.cn')}</ui:DropdownItem>
								<ui:DropdownItem on:click={switchLang('us-EN')}>{Lang.fetch('home.en')}</ui:DropdownItem>
							</ui:DropdownMenu>
						</slot:dropdown>
					</ui:Dropdown>
				</div>
				
				<div class="wrap">
					<div class="logo">
						<img src={logo} />
					</div>
					<div class="title">
						<h1>
							<span>{Lang.fetch('home.title')}</span>
							<i class="beta">{Lang.fetch('home.beta')}</i>
						</h1>
					</div>
					<div class="content">
						<div>
							<p>{Lang.fetch('home.desc.intro')}</p>
							<p>{Lang.fetch('home.desc.feature')}</p>
							<p class="info" innerHTML={Lang.fetch('home.learn')}></p>
						</div>
					</div>
				</div>
				<div class="footer">
					<span><a href='https://beian.miit.gov.cn' target="_blank">{Lang.fetch('home.icp')}</a></span>
					<ui:Divider direction="vertical"></ui:Divider>
					<span>{Lang.fetch('home.copyright')}</span>
				</div>
		</div>
	}

}


<style type="scss" scoped>
.container{
	> .header{
		display: flex;
		justify-content: right;
		align-items: center;
		height: 80px;
		padding: 0 60px;
	}

	.t-but{
		border-radius: 122px;
	}

	.icon-t{
		margin-right: 6px;
		> svg{
			width:14px;
			height: 14px;
		}
	}

	> .wrap{
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: calc(100vh - 61px);
		min-height: 600px;
		margin-top: -100px;

		> .logo{
			display: flex;
			justify-content: center;
			margin-bottom: 20px;
			> img{
				width: 220px;
				animation: rotate 10s linear infinite;
			}
		}

		> .title{
			display: flex;
			margin: 22px 0;
			align-items: center;
			justify-content: space-between;
			>h1{
				text-align: center;
				margin: 0;
				padding: 0;
				width: auto;
				> .beta{
					color: red;
					font-size: 11px;
					vertical-align: super;
					margin-left: 8px;
					font-weight: normal;
				}
			}
		}

		> .content{
			display: flex;
			justify-content: center;
			background-color: #fff;
			>div{
				max-width: 700px;
				padding: 30px;
				border: solid 2px rgb(2, 238, 246);
				border-radius: 12px;

				>.info{
					text-align: center;
					font-size: 14px;
				}
			}
		}

	}

	> .footer{
		width: 100%;
		border-top: 1px solid #ccc;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 60px;
		color: #999;
		font-size: 14px;

		a{
			color: #999;
			text-decoration: none;
		}
	}
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

</style>

<style>
	body{
		padding: 0;
		margin: 0;
		box-sizing: border-box;
	}
</style>