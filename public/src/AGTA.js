Logger.useDefaults( );

AGTA = { };
AGTA.div = "#ViewAGTA";

Parse.initialize
( 
	"teq91fTZpqE1EEpD23PL6hSKKzdsPD7bGzmNKSrR", 
	"q4myNueuHkGZXLeQuZWT4youRpwWOFQwQ4zT8tut" 
);

if( document.location.hostname.indexOf("localhost") < 0 )
{
	Logger.setLevel( Logger.OFF );
}

requirejs
(
	[
		"src/ModelFind",
		"src/ModelContact",
		"src/ModelPost",
		"src/ModelUtility",
		"src/ModelCookie",
		"src/ModelLogin",
		"src/ViewManager",
		"src/ModelDispatcher",
		"src/Initialize",
		"src/ViewAGTA",
		"src/ViewAbout",
		"src/ViewMenu",
		"src/ViewMap",
		"src/ViewDetail",
		"src/ViewLogin",
		"src/ViewFind",
		"src/ViewPost",
		"src/ViewContact",
		"src/ViewDirection",
		"src/ViewNotify",
		"src/ViewPreload",
		"src/ViewEdit"
	],
	function( )
	{
		Parse.Config.get( ).then
		(
			function( config )
			{
				AGTA.config = config;
				AGTA.initialize = new AGTA.Initialize( );
			}
		);
	}
);