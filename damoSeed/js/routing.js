//Define some routing __________________________________________________
damo.routing = {
	home : {
		url 		: 'home',
		template 	: 'index.html',
		controller  : 'controller_home',
		needLogin	: false
	},
	page1 : {
		url 		: 'page1',
		template 	: 'templates/page1.html',
		controller  : 'controller_page1',
		needLogin	: false
	},
	page2 : {
		url 		: 'page2',
		template 	: 'templates/page2.html',
		controller  : 'controller_page2',
		needLogin	: false
	}
}

