// search page for location
AGTA.ViewFind = Parse.View.extend
({
	el: "#ViewFind",
	events:
	{
		"click button.cancel": "cancel",
		"click button.submit ": "submit",
		"click button.detect ": "detect"
	},
	initialize: function( )
	{
		Logger.log( "AGTA.ViewFind.initialize" );
		
		AGTA.modelDispatcher.on( AGTA.modelDispatcher.FIND_SUCCESS, this.findSuccess, this );
		AGTA.modelDispatcher.on( AGTA.modelDispatcher.DETECT_SUCCESS, this.detectSuccess, this );
		AGTA.modelDispatcher.on( AGTA.modelDispatcher.DETECT_ERROR, this.detectError, this );
		AGTA.modelDispatcher.on( AGTA.modelDispatcher.FETCH_POST_SUCCESS, this.render, this );
	},
	detectSuccess: function( e )
	{
		$( this.el ).find( ".preload-holder" ).toggleClass( "round-preload" );
		
		this.hide( );
	},
	findSuccess: function( e )
	{
		$( this.el ).find( ".preload-holder" ).toggleClass( "round-preload" );
		
		this.hide( );
	},
	detect: function( e )
	{
		AGTA.modelDispatcher.trigger( AGTA.modelDispatcher.AUTO_DETECT );
		
		$( this.el ).find( ".preload-holder" ).toggleClass( "round-preload" );
	
		e.preventDefault( );
	},
	cancel: function( e )
	{
		e.preventDefault( );
		
		this.hide( );
		
		Logger.log( "AGTA.ViewFind.cancel" );
	},
	submit: function( e )
	{
		e.preventDefault( );
	
		var _strt = $( this.el ).find( ".street" ).val( );
		var _city = $( this.el ).find( ".city" ).val( );
		var _prov = $( $( this.el ).find( ".state " ) ).find( "option:selected" ).html( );
		var _loct = _strt+", "+_city+", "+_prov;
		
		AGTA.modelDispatcher.trigger( AGTA.modelDispatcher.FIND_LOCATION, _loct );
		
		Logger.log( "AGTA.ViewFind.submit" );
	},
	render: function( html )
	{
		Logger.log( "AGTA.ViewFind.render" );

		this.template = _.template( $("#TemplateViewFind").html( ), AGTA.postData );
		
		if( !$( this.el ).hasClass("display-none") )
		{
			$( this.el ).addClass("display-none")
		}
			
		$( this.el ).empty( );
		$( this.el ).append( this.template );
		$( this.el ).find(  ".street" ).focus( );
		
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