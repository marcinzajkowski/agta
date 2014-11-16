AGTA.ModelLogin = Parse.Object.extend( "ModelLogin",
{	
	user: null,
	username: null,
	password: null,
	initialize: function( )
	{
		AGTA.modelDispatcher.on( AGTA.modelDispatcher.LOGIN_USER, this.checkUser, this );
		AGTA.modelDispatcher.on( AGTA.modelDispatcher.LOGOUT_USER, this.logoutUser, this );
		
		Logger.log( "AGTA.ModelLogin.initialize" );
	},
	loginDone: function( )
	{
		this.render( );
	},
	logoutUser: function( )
	{
		Parse.User.logOut( );
		
		this.loginChange( );
	},
	checkUser: function( username, password )
	{
		Logger.log( "AGTA.ModelLogin.checkUser" );
		
		if( null == Parse.User.current( ) )
		{
			this.username = username;
			this.password = password;
			this.trySignup( );
		}
	},
	trySignup: function( )
	{
		Logger.log( "AGTA.ModelLogin.tryLogin" );
		var _this = this;//carryscope
		this.user = new Parse.User( );
		this.user.set( "username", this.username );
		this.user.set( "password", this.password );
		this.user.signUp( null,
		{
			success: function( r ) 
			{
				Logger.log( "AGTA.ModelLogin.signUp.success", r );
				
				_this.loginPending( );
			},
			error: function( u, e )
			{
				Logger.log( "AGTA.ModelLogin.signUp.error", u, e );
				
				if( Parse.Error.USERNAME_TAKEN == e.code )
				{
					_this.loginUser( );
				}
			}
		});
	},
	loginPending: function( )
	{
		Logger.log( "AGTA.ModelLogin.loginPending" );
	},
	loginUser: function( )
	{
		var _this = this;//carryscope
		this.user.logIn
		({
			success: function( r ) 
			{
				Logger.log( "AGTA.ModelLogin.loginUser.success", r );
				
				_this.loginChange( );
			},
			error: function( u, e )
			{
				Logger.log( "AGTA.ModelLogin.loginUser.error", u, e );
				
				_this.loginFailed( );
			}
		});
	},
	loginFailed: function( )
	{
		Logger.log( "AGTA.ModelLogin.loginFailed" );
		AGTA.modelDispatcher.trigger( AGTA.modelDispatcher.LOGIN_FAILED );
	},
	loginChange: function( )
	{
		Logger.log( "AGTA.ModelLogin.loginChange" );
		AGTA.modelDispatcher.trigger( AGTA.modelDispatcher.LOGIN_CHANGE );
	}
});