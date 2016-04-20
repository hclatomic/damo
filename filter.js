$scp.$filter.numFilter = function(num) {
	num = parseFloat(num);
	return num.toFixed(2);
};
$scp.$filter.euroToDollar = function(num) {
	num = parseFloat(num*1.2);
	return num.toFixed(2);
};
