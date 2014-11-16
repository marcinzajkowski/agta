var className = "Meeting";

Parse.Cloud.beforeSave( className, function( request, response )
{	
	if( !request.object.existed( ) )
	{
		request.object.set( "approved", false );
	}
	response.success( );
});