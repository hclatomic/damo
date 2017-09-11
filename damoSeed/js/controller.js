//======================================================================
function controller_home() {

	console.log('in controller_home');

	damo.dm.captainAge = calculateAgeOfCaptain();

}
//======================================================================
function controller_page1() {

	console.log('in controller_page1');
	

}
//======================================================================
function controller_page2() {

	console.log('in controller_page2');
	

}
//======================================================================
function controller_shopCart() {

	console.log('in controller_shopCart');
	
	var total 	= 0.0;
	var arr 	= damo.dm.user.shoppingCart.list;
	for(var i=0;i<arr.length;i++) {
		total += arr[i].price;
	}
	damo.dm.user.shoppingCart.total=total+' &euro;';
}



