// Loads up templates and initializes classes
AGTA.Initialize = Parse.Object.extend( "Initialize",
{
	initialize: function( )
	{
		Parse.$ = jQuery;
		
			AGTA.Group				= Parse.Object.extend( "Group" );
			AGTA.Meeting			= Parse.Object.extend( "Meeting" );
			AGTA.Contact			= Parse.Object.extend( "Contact" );
		
			AGTA.modelUtility		= new AGTA.ModelUtility( );
			AGTA.modelDispatcher 	= new AGTA.ModelDispatcher( );
			AGTA.modelContact		= new AGTA.ModelContact( );
			AGTA.modelFind			= new AGTA.ModelFind( );
			AGTA.modelPost			= new AGTA.ModelPost( );
			AGTA.modelCookie		= new AGTA.ModelCookie( );
			AGTA.modelLogin			= new AGTA.ModelLogin( );
			AGTA.viewManager		= new AGTA.ViewManager( );
			AGTA.viewAGTA			= new AGTA.ViewAGTA( );
			AGTA.viewAbout			= new AGTA.ViewAbout( );
			AGTA.viewMenu			= new AGTA.ViewMenu( );
			AGTA.viewDirection		= new AGTA.ViewDirection( );
			AGTA.viewMap			= new AGTA.ViewMap( );
			AGTA.viewLogin			= new AGTA.ViewLogin( );
			AGTA.viewDetail			= new AGTA.ViewDetail( );
			AGTA.viewFind			= new AGTA.ViewFind( );
			AGTA.viewPost			= new AGTA.ViewPost( );
			AGTA.viewContact		= new AGTA.ViewContact( );
			AGTA.viewNotify			= new AGTA.ViewNotify( );
			AGTA.viewPreload		= new AGTA.ViewPreload( );
			AGTA.viewEdit			= new AGTA.ViewEdit( );

		Logger.log( "AGTA.Initialize" );
	}
});