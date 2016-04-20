setPromo = function(arr) {
	arrout =  [];
	var i;
	for(i=0;i<arr.length;i++) {
		if(arr[i].promotion) {
			arrout.push(arr[i]);
		}
	}
	return arrout;
}

$scp.$Damo("data.json",function() {

	//Get the form data ____________________________________
	$scp.getFormData = function() {
		console.log('The form data to be sent to the server:', $scp.$submitData);
	};

	//set the promotions ___________________________________
	$scp.promotion = setPromo($scp.$dm.books);
	$scp.$updateView().done(function() {

		//set action on change promotion _______________________
		$('input[id$="price"]').change(function() {
			console.log('-->change promotion price');
			$scp.$updateView();
		});
		$('select[id$="promotion"]').change(function() {
			console.log('-->change promotion status');
			$scp.promotion = setPromo($scp.$dm.books);
			$scp.$updateView();
		});
	});
	
	//set comment __________________________________________
	$scp.myComment = 'Hello World !';

});
