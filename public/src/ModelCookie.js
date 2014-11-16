AGTA.ModelCookie = Parse.Object.extend( "ModelCookie",
{
	REMEMBER_ME: "rememberMe",
	USER_PASS: "userPass",
	USER_NAME: "userName",
	hasCookie: function( key )
	{
		return null != $.cookie( key );
	},
	getCookie: function( key )
	{
		Logger.log( "AGTA.ModelCookie.getCookie", key );
	
		var cookie = $.cookie( key );
	
		if( "true" == cookie )
		{
			return true;
		}
		
		if( "false" == cookie )
		{
			return false;
		}
		
		return cookie;
	},
	setCookie: function( key, value )
	{
		Logger.log( "AGTA.ModelCookie.setCookie", key, value );
		
		$.cookie( key, value, { expires: 7 } );
		
		return $.cookie( key ) == value;
	},
	unsetCookie: function( key )
	{
		$.removeCookie( key );
	}
});