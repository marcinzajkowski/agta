// login page for user registration
AGTA.ViewLogin = Parse.View.extend
({
	el: "#ViewLogin",
	events:
	{
		"click button.cancel": "cancel",
		"click button.submit ": "submit",
		"click .remember-holder": "remember"
	},
	initialize: function( )
	{
		Logger.log( "AGTA.ViewLogin.initialize" );
		
		AGTA.modelDispatcher.on( AGTA.modelDispatcher.LOGIN_CHANGE, this.loginChange, this );

		this.render( );
	},
	loginChange: function( )
	{
		Logger.log( "AGTA.ViewLogin.loginChange" );
		
		this.hide( );
	},
	cancel: function( e )
	{
		e.preventDefault( );
		
		this.hide( );
		
		Logger.log( "AGTA.ViewLogin.cancel" );
	},
	remember: function( e )
	{
		$( this.$el ).find( "input.remember-check" ).click( );
		
		this.remember = $( this.$el ).find( "input.remember-check" ).prop( "checked" );
		
		AGTA.modelCookie.setCookie( AGTA.modelCookie.REMEMBER_ME, this.remember );
		
		if( !this.remember )
		{
			AGTA.modelCookie.unsetCookie( AGTA.modelCookie.USER_NAME );
			AGTA.modelCookie.unsetCookie( AGTA.modelCookie.USER_PASS );
		}
	},
	submit: function( e )
	{
		e.preventDefault( );
		
		var username = $( this.el ).find( 'input.email' ).val( );
		var password = $( this.el ).find( 'input.password' ).val( );
		
		if( AGTA.modelCookie.getCookie( AGTA.modelCookie.REMEMBER_ME ) )
		{
			AGTA.modelCookie.setCookie( AGTA.modelCookie.USER_NAME, username );
			AGTA.modelCookie.setCookie( AGTA.modelCookie.USER_PASS, password );
		}
		
		AGTA.modelDispatcher.trigger( AGTA.modelDispatcher.LOGIN_USER, username, password );
		
		Logger.log( "AGTA.ViewLogin.submit", username, password );
	},
	prefillCookie: function( )
	{
		if( AGTA.modelCookie.hasCookie( AGTA.modelCookie.REMEMBER_ME ) )
		{
			$( this.el ).find( '.remember' ).prop( "checked", AGTA.modelCookie.getCookie( AGTA.modelCookie.REMEMBER_ME ) );
		}
		
		if( AGTA.modelCookie.hasCookie( AGTA.modelCookie.USER_NAME ) )
		{
			$( this.el ).find( '.email' ).val( AGTA.modelCookie.getCookie( AGTA.modelCookie.USER_NAME ) );
		}
		
		if( AGTA.modelCookie.hasCookie( AGTA.modelCookie.USER_PASS ) )
		{
			$( this.el ).find( '.password' ).val( AGTA.modelCookie.getCookie( AGTA.modelCookie.USER_PASS ) );
		}
	},
	render: function( html )
	{
		Logger.log( "AGTA.ViewLogin.render" );

		this.template = _.template( $("#TemplateViewLogin").html( ) );
		
		if( !$( this.el ).hasClass("display-none") )
		{
			$( this.el ).addClass("display-none")
		}
			
		$( this.el ).empty( );
		$( this.el ).append( this.template );
		$( this.el ).find( ".email" ).focus( );
		
		this.sectionHeight 	= $( this.el ).outerHeight( );
		this.defBottom = 0 - this.sectionHeight;
		
		TweenMax.to( this.el, 0, { css:{ bottom: this.defBottom } } );
		
		this.prefillCookie( );
		
		return this;
	},
	show: function( callback )
	{
		$( this.el ).removeClass("display-none");
		TweenMax.to( this.el, AGTA.config.get("SectionOpenSpeed"), 
		{ 
			css:{ bottom: 0 }
		} );
	},
	hide: function( callback )
	{
		TweenMax.to( this.el, AGTA.config.get("SectionOpenSpeed"), 
		{ 
			css:{ bottom: this.defBottom },
			onComplete: function( )
			{
				$( this.el ).addClass("display-none");
			},
			onCompleteScope: this
		} );
	}
});