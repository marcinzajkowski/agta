// login page for user registration
AGTA.ViewContact = Parse.View.extend
({
	el: "#ViewContact",
	events:
	{
		"click button.cancel": "cancel",
		"click button.submit ": "submit"
	},
	initialize: function( )
	{
		Logger.log( "AGTA.ViewContact.initialize" );
		
		AGTA.modelDispatcher.on( AGTA.modelDispatcher.LOGIN_CHANGE, this.loginChange, this );

		this.render( );
	},
	loginChange: function( )
	{
		this.render( );
	},
	cancel: function( e )
	{
		e.preventDefault( );
		
		this.hide( );
		
		Logger.log( "AGTA.ViewContact.cancel" );
	},
	submit: function( e )
	{
		Logger.log( "AGTA.ViewContact.submit" );
		
		var isValid = $( this.el ).find( "form" )[ 0 ].checkValidity( );

		if( isValid )
		{
			this.sendFormData( );
		}
		
		Logger.log( "AGTA.ViewContact.submit", e, isValid );
	},
	sendFormData: function( )
	{
		var formData = $( this.el ).find( "form" ).serializeArray( );
		
		AGTA.modelDispatcher.trigger( AGTA.modelDispatcher.SUBMIT_CONTACT_DATA, formData );
		
		this.hide( );
	},
	render: function( html )
	{
		Logger.log( "AGTA.ViewContact.render" );

		this.template = _.template( $("#TemplateViewContact").html( ) );
		
		$( this.el ).empty( );
		$( this.el ).append( this.template );
		
		if( !$( this.el ).hasClass("display-none") )
		{
			$( this.el ).addClass("display-none")
		}
		
		if( Parse.User.current( ) )
		{
			$( this.el ).find( ".email" ).val( Parse.User.current( ).get( "username" ) );
		}

		this.sectionHeight 	= $( this.el ).outerHeight( );
		this.defBottom 		= 0 - this.sectionHeight;
		
		TweenMax.to( this.el, 0, { css:{ bottom: this.defBottom } } );
		
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
				this.render( );
			},
			onCompleteScope: this
		} );
	}
});