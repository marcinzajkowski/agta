AGTA.ModelContact = Parse.Object.extend( "ModelContact",
{	
	initialize: function( )
	{
		AGTA.modelDispatcher.on( AGTA.modelDispatcher.SUBMIT_CONTACT_DATA, this.contact, this );
	},
	contact: function( e )
	{
		Logger.log( "AGTA.ModelContact.contact", e );
		
		var data = AGTA.modelUtility.convertFormArrayToKeyPair( e );
		var contact = new AGTA.Contact( );
			contact.set( "contact_email", data.contact_email );
			contact.set( "contact_message", data.contact_message );
			if( Parse.User.current( ) )
			{
				contact.set( "submitter", Parse.User.current( ) ); 
			}
			contact.save(null, {
				success: function( r )
				{
					Logger.log( "AGTA.ModelContact.contact.save.success" );
					
					AGTA.modelDispatcher.trigger( AGTA.modelDispatcher.SUBMIT_CONTACT_SUCCESS );
				},
				error: function( e )
				{
					Logger.log( "AGTA.ModelContact.contact.save.error" );
					
					AGTA.modelDispatcher.trigger( AGTA.modelDispatcher.SUBMIT_CONTACT_ERROR );
				}
			});
	}
});