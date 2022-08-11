/**从时间戳转换成日期时间
 * @param {Object} value
 */
const dateStr = function(timeStamp, fmt="Y-m-d") {
	let chr = '', stmp = '',astr = [];
	(!timeStamp) && (timeStamp = (new Date()).getTime());
	if (timeStamp.toString().length <= 10) {
		timeStamp = timeStamp * 1000;
	}
	let dt = new Date(timeStamp);
	for (let i = 0; i < fmt.length; i++) {
		chr = fmt.charAt(i);
		switch (chr) {
			case "Y":
				stmp = dt.getFullYear();
				astr.push(stmp.toString());
				break;
			case "y":
				stmp = dt.getFullYear();
				astr.push(stmp.toString().substr(2, 2));
				break;
			case "m":
				stmp = dt.getMonth() + 1;
				astr.push((stmp > 9)? stmp.toString():'0'+stmp.toString());
				break;
			case "d":
				stmp = dt.getDate();
				astr.push((stmp > 9)? stmp.toString():'0'+stmp.toString());
				break;
			case "h":
				stmp = dt.getHours();
				astr.push((stmp > 9)? stmp.toString():'0'+stmp.toString());
				break;
			case "i":
				stmp = dt.getMinutes();
				astr.push((stmp > 9)? stmp.toString():'0'+stmp.toString());
				break;
			case "s":
				stmp = dt.getSeconds();
				astr.push((stmp > 9)? stmp.toString():'0'+stmp.toString());
				break;
			default:
				astr.push(chr);
		}
	}
	return astr.join("");
};

const priceStr = function(price) {
    var fPrice = price / 100.00;
    fPrice = fPrice.toFixed(2);
    return fPrice;
}

export default {
    dateStr, priceStr
};
