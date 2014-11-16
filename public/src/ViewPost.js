// search page for location
AGTA.ViewPost = Parse.View.extend
({
	el: "#ViewPost",
	events:
	{
		"click button.cancel": "cancel",
		"click button.submit ": "submit"
	},
	initialize: function( )
	{
		Logger.log( "AGTA.ViewPost.initialize" );
		
		AGTA.modelDispatcher.trigger( AGTA.modelDispatcher.FETCH_POST_DATA );
		AGTA.modelDispatcher.on( AGTA.modelDispatcher.FETCH_POST_SUCCESS, this.render, this );
		AGTA.modelDispatcher.on( AGTA.modelDispatcher.SAVE_MEETING_SUCCESS, this.render, this );
	},
	focused: function( e )
	{
		Logger.log( "AGTA.focused.", e, e.currentTarget.className );
	},
	cancel: function( e )
	{
		e.preventDefault( );
		
		this.hide( );
		
		Logger.log( "AGTA.ViewPost.cancel" );
	},
	submit: function( e )
	{
		e.preventDefault( );
	
		var theForm = $( this.el ).find( "form" )[ 0 ];
		var isValid = theForm.checkValidity( );
		var fFields = $( this.el ).find( "form" ).find( "input, select" );
		
		for( var i = 0; i < fFields.length; i++ )
		{
			var field = fFields[ i ];
			
			if( $( field ).attr( "required" ) && !field.checkValidity( ) )
			{
				AGTA.modelDispatcher.trigger( AGTA.modelDispatcher.INVALID_FORM_FIELD, field.validationMessage );
				
				TweenMax.from( $( field ), 2*AGTA.config.get("SectionOpenSpeed"), { css:{ "border-color":"#ff0000" } } );

				$( field ).focus( );
				
				$( this.el ).find( ".forms" ).animate
				({
					scrollTop: field.offsetTop-field.clientHeight
				}, AGTA.config.get("SectionOpenSpeed")*1000 );
				
				break;
			}
		}
		
		if( isValid )
		{
			this.sendFormData( );
		}
		
		Logger.log( "AGTA.ViewPost.submit", e, isValid );
	},
	sendFormData: function( )
	{
		var formData = $( this.el ).find( "form" ).serializeArray( );
		
		Logger.log( "AGTA.ViewPost.sendFormData", $( this.el ).find( "form" ), formData );
		
		AGTA.modelDispatcher.trigger( AGTA.modelDispatcher.SAVE_POST_REQUEST, formData );
		
		this.hide( );
	},
	render: function( )
	{
		Logger.log( "AGTA.ViewPost.render" );
		
		this.template = _.template( $("#TemplateViewPost").html( ), AGTA.postData );
		
		if( !$( this.el ).hasClass("display-none") )
		{
			$( this.el ).addClass("display-none");
		}
			
		$( this.el ).empty( );
		$( this.el ).append( this.template );
		$( this.el ).find(  ".street" ).focus( );
		
		//$( this.el ).find( ".group" ).hide( );
		//$( this.el ).find( ".group_name" ).attr( "required", null );
		//$( this.el ).find( ".contact_name" ).attr( "required", null );
		//$( this.el ).find( ".contact_email" ).attr( "required", null );
		//$( this.el ).find( ".contact_phone" ).attr( "required", null );
		//$( this.el ).find( ".meeting_expires_day" ).attr( "required", null );
		//$( this.el ).find( ".meeting_expires_month" ).attr( "required", null );
		//$( this.el ).find( ".meeting_expires_year" ).attr( "required", null );
		//$( this.el ).find( ".expire" ).hide( );
		
		this.sectionHeight 	= $( this.el ).outerHeight( );
		this.defBottom = 0 - this.sectionHeight;
		
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
				$( this.el ).addClass("display-none");
			},
			onCompleteScope: this
		} );
	}
});