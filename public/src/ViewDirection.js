// about page
AGTA.ViewDirection = Parse.View.extend
({
	el: "#ViewDirection",
	events:
	{
		"click button.back": "back",
		"click button.toggle": "toggle",
		"click button.close": "hide",
		"click .ViewDirection": "clear",
		"mousewheel .ViewDirection": "clear",
		"mousewheel .GoogleDirections": "clear"
	},
	isOpen: true,
	initialize: function( )
	{
		AGTA.modelDispatcher.on( AGTA.modelDispatcher.DIRECT_SUCCESS, this.direct, this );
		AGTA.modelDispatcher.on( AGTA.modelDispatcher.NEARBY_DETAILS, this.nearby, this );
		
		this.render( );
	},
	nearby: function( )
	{
		this.hide( );
	},
	direct: function( )
	{
		Logger.log( "AGTA.ViewDirection.direct" );
		
		this.show( );
		
		TweenMax.delayedCall( AGTA.config.get( "HideDirectionsDelay" ), this.toggle, null, this );
	},
	render: function( html )
	{
		Logger.log( "AGTA.ViewDirection.render" );

		this.template = _.template( $("#TemplateViewDirection").html( ) );
		
		if( !$( this.el ).hasClass("display-none") )
		{
			$( this.el ).addClass("display-none")
		}
		
		$( this.el ).empty( );
		$( this.el ).append( this.template );
		
		this.toggleHeight = $( this.el ).find( ".controls" ).outerHeight( );
		this.sectionHeight 	= $( this.el ).outerHeight( );
		this.defBottom = 0 - this.sectionHeight;
		
		this.togBottom = this.defBottom + this.toggleHeight;
		
		$( this.el ).on( "DOMSubtreeModified", function( )
		{
			Logger.log( "AGTA.ViewDirection.render.DOMSubtreeModified" );
			
			$( this ).find( ".adp-marker:first" ).attr( "src", AGTA.modelUtility.fetchClassProperty( "marker-round", "background-image" ) ).addClass( "marker" );
			$( this ).find( ".adp-marker:last" ).attr( "src", AGTA.modelUtility.fetchClassProperty( "marker-triangle", "background-image" ) ).addClass( "marker" );
		})
		
		$( this.el ).find( ".toggle").toggleClass( ".direction-open" );
		
		TweenMax.to( this.el, 0, { css: { bottom: this.defBottom } } );
		
		return this;
	},
	back: function( )
	{
		this.hide( );
		
		AGTA.modelDispatcher.trigger( AGTA.modelDispatcher.OPEN_SECTION, AGTA.viewMenu.FIND );
	},
	clear: function( callback  )
	{
		Logger.log("AGTA.ViewDirection.clear");
		
		TweenMax.killDelayedCallsTo( this.toggle );
	},
	toggle: function( callback  )
	{
		Logger.log("AGTA.ViewDirection.toggle");
		
		TweenMax.killDelayedCallsTo( this.toggle );
		
		if( this.isOpen )
		{
			TweenMax.to( this.el, AGTA.config.get("SectionOpenSpeed"), 
			{ 
				css:{ bottom: this.togBottom },
				onComplete: function( )
				{
					$( this.el ).find( ".GoogleDirections").addClass( "display-none" );
					$( this.el ).css( "bottom", 0 );
				},
				onCompleteScope: this
			} );
			this.isOpen = false;
		}else{
			$( this.el ).find( ".GoogleDirections").removeClass( "display-none" );
			$( this.el ).css( "bottom", this.togBottom );
			TweenMax.to( this.el, AGTA.config.get("SectionOpenSpeed"), 
			{ 
				css:{ bottom: 0 }
			} );
			this.isOpen = true;
		}
		
		$( this.el ).find( ".toggle").toggleClass( ".direction-open" );
		$( this.el ).find( ".toggle").toggleClass( ".direction-close" );
		
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