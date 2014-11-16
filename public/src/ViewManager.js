// delegates events to show and hide sections
AGTA.ViewManager = Parse.View.extend
({
	initialize: function( )
	{
		AGTA.modelDispatcher.on( AGTA.modelDispatcher.OPEN_SECTION, this.openSection, this );
		AGTA.modelDispatcher.on( AGTA.modelDispatcher.MAKE_NOTIFY, this.makeNotify, this );
		AGTA.modelDispatcher.on( AGTA.modelDispatcher.LOGIN_CHANGE, this.loginChange, this );
		AGTA.modelDispatcher.on( AGTA.modelDispatcher.LOGIN_FAILED, this.loginFailed, this );
		AGTA.modelDispatcher.on( AGTA.modelDispatcher.AUTO_DETECT, this.autoDetect, this );
		AGTA.modelDispatcher.on( AGTA.modelDispatcher.DETECT_SUCCESS, this.detectSuccess, this );
		AGTA.modelDispatcher.on( AGTA.modelDispatcher.DETECT_ERROR, this.detectError, this );
		AGTA.modelDispatcher.on( AGTA.modelDispatcher.FIND_SUCCESS, this.findSuccess, this );
		AGTA.modelDispatcher.on( AGTA.modelDispatcher.FIND_ERROR, this.findError, this );
		AGTA.modelDispatcher.on( AGTA.modelDispatcher.NEARBY_SUCCESS, this.nearbySuccess, this );
		AGTA.modelDispatcher.on( AGTA.modelDispatcher.NEARBY_ERROR, this.nearbyError, this );
		AGTA.modelDispatcher.on( AGTA.modelDispatcher.NEARBY_NONE, this.nearbyNone, this );
		AGTA.modelDispatcher.on( AGTA.modelDispatcher.DIRECT_SUCCESS, this.directSuccess, this );
		AGTA.modelDispatcher.on( AGTA.modelDispatcher.DIRECT_ERROR, this.directError, this );
		AGTA.modelDispatcher.on( AGTA.modelDispatcher.YOU_ARE_HERE, this.youAreHere, this );
		AGTA.modelDispatcher.on( AGTA.modelDispatcher.FETCH_POST_ERROR, this.fetchPostError, this );
		AGTA.modelDispatcher.on( AGTA.modelDispatcher.FETCH_POST_SUCCESS, this.fetchPostSuccess, this );
		AGTA.modelDispatcher.on( AGTA.modelDispatcher.SAVE_GROUP_SUCCESS, this.saveGroupSuccess, this );
		AGTA.modelDispatcher.on( AGTA.modelDispatcher.SAVE_GROUP_ERROR, this.saveGroupError, this );
		AGTA.modelDispatcher.on( AGTA.modelDispatcher.SAVE_MEETING_SUCCESS, this.saveMeetingSuccess, this );
		AGTA.modelDispatcher.on( AGTA.modelDispatcher.SAVE_MEETING_ERROR, this.saveMeetingError, this );
		AGTA.modelDispatcher.on( AGTA.modelDispatcher.NEW_MEETING_LOC, this.newMeetingLoc, this );
		AGTA.modelDispatcher.on( AGTA.modelDispatcher.SUBMIT_CONTACT_SUCCESS, this.submitContactSuccess, this );
		AGTA.modelDispatcher.on( AGTA.modelDispatcher.SUBMIT_CONTACT_ERROR, this.submitContactError, this );
		AGTA.modelDispatcher.on( AGTA.modelDispatcher.LOGIN_TO_POST, this.loginToPost, this );
		AGTA.modelDispatcher.on( AGTA.modelDispatcher.INVALID_FORM_FIELD, this.invalidForm, this );
	},
	invalidForm: function( e, f )
	{
		this.makeNotify( AGTA.viewNotify.INVALID_FORM_FIELD, e, f );
	},
	loginToPost: function( e )
	{
		this.makeNotify( AGTA.viewNotify.LOGIN_TO_POST, e );
	},
	submitContactSuccess: function( e )
	{
		this.makeNotify( AGTA.viewNotify.SUBMIT_CONTACT_SUCCESS, e );
	},
	submitContactError: function( e )
	{
		this.makeNotify( AGTA.viewNotify.SUBMIT_CONTACT_ERROR, e );
	},
	newMeetingLoc: function( e )
	{
		this.makeNotify( AGTA.viewNotify.NEW_MEETING_LOC, e );
	},
	saveGroupSuccess: function( e )
	{
		this.makeNotify( AGTA.viewNotify.SAVE_GROUP_SUCCESS, e );
	},
	saveGroupError: function( e )
	{
		this.makeNotify( AGTA.viewNotify.SAVE_GROUP_ERROR, e );
	},
	saveMeetingSuccess: function( e )
	{
		this.makeNotify( AGTA.viewNotify.SAVE_MEETING_SUCCESS, e );
	},
	saveMeetingError: function( e )
	{
		this.makeNotify( AGTA.viewNotify.SAVE_MEETING_ERROR, e );
	},
	fetchPostError: function( e )
	{
		this.makeNotify( AGTA.viewNotify.FETCH_POST_ERROR, e );
	},
	fetchPostSuccess: function( e )
	{
		this.makeNotify( AGTA.viewNotify.FETCH_POST_SUCCESS );
	},
	youAreHere: function( e )
	{
		this.makeNotify( AGTA.viewNotify.YOU_ARE_HERE );
	},
	directSuccess: function( e )
	{
		this.makeNotify( AGTA.viewNotify.DIRECT_SUCCESS );
	},
	directError: function( e )
	{
		this.makeNotify( AGTA.viewNotify.DIRECT_ERROR );
	},
	nearbyNone: function( e )
	{
		this.makeNotify( AGTA.viewNotify.NEARBY_NONE );
	},
	nearbySuccess: function( e )
	{
		this.makeNotify( AGTA.viewNotify.NEARBY_SUCCESS );
	},
	nearbyError: function( e )
	{
		this.makeNotify( AGTA.viewNotify.NEARBY_ERROR );
	},
	findSuccess: function( e )
	{
		this.makeNotify( AGTA.viewNotify.FIND_SUCCESS );
	},
	findError: function( e )
	{
		this.makeNotify( AGTA.viewNotify.FIND_ERROR );
	},
	detectSuccess: function( e )
	{
		this.makeNotify( AGTA.viewNotify.DETECT_SUCCESS );
	},
	detectError: function( e )
	{
		this.makeNotify( AGTA.viewNotify.DETECT_ERROR );
	},
	autoDetect: function( e )
	{
		this.makeNotify( AGTA.viewNotify.AUTO_DETECT );
	},
	loginFailed: function( e )
	{
		this.makeNotify( AGTA.viewNotify.LOGIN_FAILED );
	},
	loginChange: function( e )
	{
		if( Parse.User.current( ) )
		{
			this.makeNotify( AGTA.viewNotify.LOGIN_SUCCESS );
		}else{
			this.makeNotify( AGTA.viewNotify.LOGOUT_SUCCESS );
		}
	},
	makeNotify: function( type, message )
	{
		AGTA.viewNotify.notify( type, message );
	},
	openSection: function( e )
	{
		Logger.log( "AGTA.ViewManager", e );

		if( "login" == e )
		{
			AGTA.viewLogin.show( ); return;
		}
		
		if( "contact" == e )
		{
			AGTA.viewContact.show( ); return;
		}
		
		if( "about" == e )
		{
			AGTA.viewAbout.show( ); return;
		}
		
		if( "find" == e )
		{
			AGTA.viewFind.show( ); return;
		}
		
		if( "post" == e )
		{
			AGTA.viewPost.show( ); return;
		}
		
		if( "edit" == e )
		{
			AGTA.viewEdit.show( ); return;
		}
		
		if( "claim" == e )
		{
			AGTA.viewClaim.show( ); return;
		}
		
		Logger.log( "AGTA.ViewManager.unset section "+ e );
	}
});