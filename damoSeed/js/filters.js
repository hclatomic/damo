//Define some filters ___________________________________________
damo.filter = {
	boldify : function(str) {
		return '<b>'+str+'</b>';
	},
	setPriceInEuro : function(price) {
		return parseFloat(price).toFixed(2)+' &euro;';
	}
}
