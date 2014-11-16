// popup floater with timeout hide delay
AGTA.ViewNotify = Parse.View.extend
({
	LOGIN_SUCCESS:"vn.loginSuccess",
	LOGIN_FAILED:"vn.loginFailed",
	LOGOUT_SUCCESS:"vn.logoutSuccess",
	AUTO_DETECT:"vn.autoDetect",
	DETECT_SUCCESS:"vn.detectSuccess",
	DETECT_ERROR:"vn.detectError",
	FIND_SUCCESS:"vn.findSuccess",
	FIND_ERROR:"vn.findError",
	NEARBY_SUCCESS:"vn.nearbySuccess",
	NEARBY_ERROR:"vn.nearbyError",
	NEARBY_NONE:"vn.nearbyNone",
	DIRECT_SUCCESS:"vn.directSuccess",
	DIRECT_ERROR:"vn.directError",
	YOU_ARE_HERE:"vn.youAreHere",
	FETCH_POST_ERROR:"vn.fetchPostError",
	FETCH_POST_SUCCESS:"vn.fetchPostSuccess",
	POST_FIND_SUCCESS:"vn.postFindSuccess",
	SAVE_GROUP_SUCCESS:"vn.saveGroupSuccess",
	SAVE_GROUP_ERROR:"vn.saveGroupError",
	SAVE_MEETING_SUCCESS:"vn.saveMeetingSuccess",
	SAVE_MEETING_ERROR:"vn.saveMeetingError",
	NEW_MEETING_LOC:"vn.newMeetingLoc",
	SUBMIT_CONTACT_SUCCESS:"vn.submitContactSuccess",
	SUBMIT_CONTACT_ERROR:"vn.submitContactError",
	LOGIN_TO_POST:"vn.loginToPost",
	INVALID_FORM_FIELD:"vn.invalidFormField",
	el: "#ViewNotify",
	initialize: function( )
	{
		Logger.log( "AGTA.ViewNotify.initialize" );
	},
	notify: function( type, mess )
	{
		Logger.log( "AGTA.ViewNotify.notify", type, mess );
		
		if( this.DIRECT_SUCCESS == type )
		{
			this.message = "Directions found successfully.";
		}
		if( this.DIRECT_ERROR == type )
		{
			this.message = "Unable to fetch directions.";
		}
		if( this.LOGIN_SUCCESS == type )
		{
			this.message = "You have logged in as "+Parse.User.current( ).get( "username" );
		}
		if( this.LOGOUT_SUCCESS == type )
		{
			this.message = "You have logged out.";
		}
		if( this.AUTO_DETECT == type )
		{
			this.message = "Attempting to fetch your location.";
		}
		if( this.DETECT_SUCCESS == type )
		{
			this.message = "Successfully fetched your location.";
		}
		if( this.DETECT_ERROR == type )
		{
			this.message = "Unable to access device location.";
		}
		if( this.FIND_SUCCESS == type )
		{
			this.message = "Location found.";
		}
		if( this.FIND_ERROR == type )
		{
			this.message = "Unable to find provided location.";
		}
		if( this.NEARBY_SUCCESS == type )
		{
			this.message = "Successfully found nearby meetings.";
		}
		if( this.NEARBY_NONE == type )
		{
			this.message = "Unable to find nearby meetings.";
		}
		if( this.NEARBY_ERROR == type )
		{
			this.message = "An error has occurred. Please try again.";
		}
		if( this.YOU_ARE_HERE == type )
		{
			this.message = "You are here.";
		}
		if( this.FETCH_POST_ERROR == type )
		{
			this.message = "Error loading app data: "+ mess;
		}
		if( this.FETCH_POST_SUCCESS == type )
		{
			this.message = "App loaded successfully."
		}
		if( this.SAVE_GROUP_SUCCESS == type )
		{
			this.message = "Successfully saved group information.";
		}
		if( this.SAVE_GROUP_ERROR == type )
		{
			this.message = "Error saving group information.";
		}
		if( this.SAVE_MEETING_SUCCESS == type )
		{
			this.message = "Successfully saved meeting information.";
		}
		if( this.SAVE_MEETING_ERROR == type )
		{
			this.message = "Error saving meeting information.";
		}
		if( this.NEW_MEETING_LOC == type )
		{
			this.message = "Your new meeting location.";
		}
		if( this.SUBMIT_CONTACT_SUCCESS == type )
		{
			this.message = "Your message has been sent.";
		}
		if( this.SUBMIT_CONTACT_ERROR == type )
		{
			this.message = "Error sending message.";
		}
		if( this.LOGIN_TO_POST == type )
		{
			this.message = "Please login/register to post.";
		}
		if( this.INVALID_FORM_FIELD == type )
		{
			this.message = mess;
		}
		
		if( !this.notifications )
		{
			this.notifications = [ ];
		}
		
		this.notifications.push( this.message );

		if( !this.rendering )
		{
			this.render( );
		}
		
	},
	render: function( )
	{
		Logger.log( "AGTA.ViewNotify.render" );
		
		this.rendering = true;
		
		var _this = this;
		
		this.template = _.template( $("#TemplateViewNotify").html( ), { message: this.notifications.pop( ) } );
		
		$( this.el ).empty( );
		$( this.el ).append( this.template );
		
		this.notifyHeight 	= $( this.el ).outerHeight( );
		this.notifyHeight 	+= parseFloat( $( this.el ).css( 'padding' ) );
		this.notifyHeight 	+= parseFloat( $( this.el ).css( 'padding' ) );
		
			$( this.el ).removeClass("display-none");
			$( this.el ).css( {top:-this.notifyHeight} );
			TweenMax.to( this.el, AGTA.config.get("SectionOpenSpeed"), { css:{ top:0 }} );
			TweenMax.to( this.el, AGTA.config.get("SectionOpenSpeed"), { css:{ top:-this.notifyHeight }, delay:3, onComplete:
				function( )
				{
					$( _this.el ).empty( );
					
					_this.rendering = false;
					
					$( this.el ).addClass("display-none");
					
					if( _this.notifications.length )
					{
						_this.render( );
					}
				}			
			});
							
		return this;
	}
});