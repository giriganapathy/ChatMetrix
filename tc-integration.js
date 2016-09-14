// JavaScript source code
var request = require("request");
var url = "https://api-verizon-dev.touchcommerce.com";
var cookieInfo = "";
var createSession = function (fnCallback) {
	//Setting up proxy.
	//"proxy": "http://tpaproxy.verizon.com:80",
    var options = {        
		"url": url + "/j_spring_security_check",
		"method": "POST",
		"headers": {
			"Content-Type": "application/json"
		},
		"form" : {
			"j_username": "vz-wireline-reporting-api-01",
			"j_password": "9sPKD53MiAfZ",
			"submit" : "Login"
		}
	}	
	request(options, function (err, response, body) {
		if (err) {
			var errr = {
				"description": "Response data is empty!",
				"data": err.toString()
			};
			if (null != fnCallback && typeof fnCallback == "function") {
				fnCallback(errr, null);
			}
			return;
		}

		var cookieArr = [];
		if (null != response.headers) {
			cookieArr = response.headers["set-cookie"]
			if (null == cookieArr) {
				cookieArr = response.headers["Set-cookie"]
				if (null == cookieArr) {
					var err = {
						"description": "Cookie info is missing!"
					};
					if (null != fnCallback && typeof fnCallback == "function") {
						fnCallback(err, null);
						return;
					}
				}
			}
		}
		
		for (var idx = 0; idx < cookieArr.length; idx++) {
             cookieInfo = cookieInfo + cookieArr[idx];
		}
		
		if (null != fnCallback && typeof fnCallback == "function") {
			fnCallback(null, { "result": true });
		}		
	});
    //ends here...
};

var destroySession = function (fnCallback) {
	//Setting up proxy.
	//"proxy": "http://proxy.ebiz.verizon.com:80",
	var options = {		
		"url": url + "/logout",
		"method": "GET",
		"headers": {
			"Content-Type": "application/json",
			"Cookie": cookieInfo
		},
		"mimetypes": {
			json: ["application/json", "application/json;charset=utf-8"]
		}
	}
	request(options, function (err, response, body) {
		if (err) {
			var errr = {
				"description": "Response data is empty!",
				"data": err.toString()
			};
			if (null != fnCallback && typeof fnCallback == "function") {
				fnCallback(errr, null);
			}
			return;
		}
		cookieInfo = "";
		if (null != fnCallback && typeof fnCallback == "function") {
			fnCallback(null, { "result": true });
		}
	});
};

var chatSummary = function (fnCallback) {
	
	//Setting up proxy.
	//"proxy": "http://proxy.ebiz.verizon.com:80",
	var options = {		
		"url": url + "/v3/metric/realtime?category=engagement&dimension=summary&site=10004593",
		"method": "GET",
		"headers": {
			"Content-Type": "application/json",
			"Cookie": cookieInfo
		},
		"mimetypes": {
			json: ["application/json", "application/json;charset=utf-8"]
		}
	};
	request(options, function (err, response, body) {
		if (err) {
			var errr = {
				"description": "Response data is empty!",
				"data": err.toString()
			};
			if (null != fnCallback && typeof fnCallback == "function") {
				fnCallback(errr, null);
				return;
			}
			if (null != fnCallback && typeof fnCallback == "function") {
				fnCallback(null, { "result": true });
			}
		}
		var parsedData = JSON.parse(body);
		if (null != fnCallback && typeof fnCallback == "function") {
			fnCallback(null, parsedData);
		}
	});
};
module.exports.createSession = createSession;
module.exports.destroySession = destroySession;
module.exports.chatSummary = chatSummary;