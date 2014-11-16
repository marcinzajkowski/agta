// about page
AGTA.ViewAbout = Parse.View.extend
({
	el: "#ViewAbout",
	events:
	{
		"click button.cancel": "cancel",
	},
	initialize: function( )
	{
		this.render( );
	},
	render: function( html )
	{
		Logger.log( "AGTA.ViewAbout.render" );

		this.template = _.template( $("#TemplateViewAbout").html( ), { message: AGTA.config.get( "AboutCopy" ) } );
		
		$( this.el ).empty( );
		$( this.el ).append( this.template );
		
		if( !$( this.el ).hasClass("display-none") )
		{
			$( this.el ).addClass("display-none")
		}
		
		this.sectionHeight 	= $( this.el ).outerHeight( );
		this.defBottom = 0 - this.sectionHeight;
		
		TweenMax.to( this.el, 0, { css:{ bottom: this.defBottom } } );
		
		return this;
	},
	cancel: function( )
	{
		this.hide( );
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