// meeting detail page
AGTA.ViewPreload = Parse.View.extend
({
	el: "#ViewPreload",
	initialize: function( )
	{
		Logger.log( "AGTA.ViewPreload.initialize" );
		
		AGTA.modelDispatcher.on( AGTA.modelDispatcher.PRELOAD_HIDE, this.hide, this );
		AGTA.modelDispatcher.on( AGTA.modelDispatcher.PRELOAD_SHOW, this.show, this );
		
		this.render( );
	},
	render: function( )
	{
		Logger.log( "AGTA.ViewPreload.render", this.data );
		
		this.template = _.template( $("#TemplateViewPreload").html( ), this.data );
		
		$( this.el ).empty( );
		$( this.el ).append( this.template );
		$( this.el ).find( ".preload-holder" ).addClass( "round-preload" );
		
		this.sectionHeight 	= $( this.el ).outerHeight( );
		this.defBottom = 0 - this.sectionHeight;

		return this;
	},
	show: function( callback )
	{
		Logger.log( "AGTA.ViewPreload.show" );
		
		$( this.el ).removeClass("display-none");
		$( this.el ).find( ".preload-holder" ).addClass( "round-preload" );
	},
	hide: function( callback )
	{
		Logger.log( "AGTA.ViewPreload.hide" );
	
		$( this.el ).addClass("display-none");
		$( this.el ).find( ".preload-holder" ).removeClass( "round-preload" );
	}
});