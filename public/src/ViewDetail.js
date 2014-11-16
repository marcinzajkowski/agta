// meeting detail page
AGTA.ViewDetail = Parse.View.extend
({
	el: "#ViewDetail",
	events:
	{
		"click button.cancel": "cancel",
		"click button.walking ": "walking",
		"click button.driving": "driving",
		"click button.edit": "edit",
		"click button.claim": "claim"
	},
	initialize: function( )
	{
		Logger.log( "AGTA.ViewDetail.initialize" );
		
		AGTA.modelDispatcher.on( AGTA.modelDispatcher.NEARBY_DETAILS, this.details, this );
	},
	details: function( e )
	{
		Logger.log( "AGTA.ViewDetail.nearbyDeatils", e );

		this.meeting = e;
		this.meeting_claimed = false;
		this.meeting_claimable = Parse.User.current( ) != null;
		
		if( this.meeting_claimable )
		{
			if( e.get( "ACL" ) )
			{
				// check if this user owns the ACL
				this.meeting_claimed = Boolean( e.get("ACL").permissionsById[ Parse.User.current( ).id ] );
			}
		}
		
		this.data = 
		{
			meeting_claimable:	this.meeting_claimable,
			meeting_claimed:	this.meeting_claimed,
			meeting_name: 		e.get( "meeting_name" ).toCapitalCase( ),
			meeting_type:		e.get( "meeting_type" ).get( "name" ).toCapitalCase( ),
			meeting_building: 	e.get( "meeting_building" ).toCapitalCase( ),
			meeting_address: 	e.get( "meeting_address" ).toCapitalCase( ),
			meeting_time: 		e.get( "meeting_day" ).get( "name" ).toCapitalCase( ) + " " + 
								e.get( "meeting_hour" ).get("value")+":"+
								e.get( "meeting_minute" ).get("name")+" "+
								e.get( "meeting_period" ).get("name").toUpperCase( )
		}
		
		this.render( );
		this.show( );
	},
	cancel: function( e )
	{
		e.preventDefault( );
		
		this.hide( );
		
		Logger.log( "AGTA.ViewDetail.cancel" );
	},
	claim: function( e )
	{
		Logger.log( "AGTA.ViewDetail.claim" );
		
		AGTA.currentMeeting = this.meeting;// used by claim page
		
		this.hide( );
		
		AGTA.modelDispatcher.trigger( AGTA.modelDispatcher.OPEN_SECTION, "claim" );
	},
	edit: function( e )
	{
		Logger.log( "AGTA.ViewDetail.edit" );
		
		AGTA.currentMeeting = this.meeting;// used by claim page
		
		this.hide( );
		
		AGTA.modelDispatcher.trigger( AGTA.modelDispatcher.OPEN_SECTION, "edit" );
	},
	driving: function( e )
	{
		Logger.log( "AGTA.ViewDetail.driving" );
	
		e.preventDefault( );
		
		AGTA.modelDispatcher.trigger( AGTA.modelDispatcher.DIRECT_DRIVING );
		
		this.hide( );
	},
	walking: function( e )
	{
		Logger.log( "AGTA.ViewDetail.walking" );
	
		e.preventDefault( );
		
		AGTA.modelDispatcher.trigger( AGTA.modelDispatcher.DIRECT_WALKING );
		
		this.hide( );
	},
	render: function( )
	{
		Logger.log( "AGTA.ViewDetail.render", this.data );
		
		this.template = _.template( $("#TemplateViewDetail").html( ), this.data );
		
		if( !$( this.el ).hasClass("display-none") )
		{
			$( this.el ).addClass("display-none")
		}
			
		$( this.el ).empty( );
		$( this.el ).append( this.template );
		
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