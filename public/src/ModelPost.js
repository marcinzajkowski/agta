AGTA.ModelPost = Parse.Object.extend( "ModelPost",
{	
	initialize: function( )
	{
		Logger.log( "AGTA.ModelPost.initialize" );
		
		AGTA.modelDispatcher.on( AGTA.modelDispatcher.FETCH_POST_DATA, this.fetchData, this );
		AGTA.modelDispatcher.on( AGTA.modelDispatcher.SAVE_POST_REQUEST, this.saveRequest, this );
		AGTA.modelDispatcher.on( AGTA.modelDispatcher.POST_FIND_SUCCESS, this.saveData, this );
		
		AGTA.postData = 
		{ 
			NEW_GROUP:		"NEW_"+new Date( ).getTime( ),
			EXPIRE_NEVER:	"EXPIRES_"+new Date( ).getTime( )
		};
		
		this.fetchList = 
		[
			{ class:"MeetingType", 			localName: "meeting_type", ascending: "order" },
			{ class:"StreetDirection", 		localName: "street_direction", ascending: "name" },
			{ class:"StreetType", 			localName: "street_type", ascending: "name" },
			{ class:"MeetingDay",			localName: "meeting_day", ascending: "order" },
			{ class:"MeetingHour",			localName: "meeting_hour", ascending: "order" },
			{ class:"MeetingMinute",		localName: "meeting_minute", ascending: "order" },
			{ class:"MeetingPeriod",		localName: "meeting_period", descending: "order" },
			{ class:"MeetingAssociation",	localName: "meeting_association", descending: "name" },
			{ class:"MeetingProvince",		localName: "meeting_province", descending: "order" }
		];
	},
	saveRequest: function( e )
	{
		Logger.log( "AGTA.ModelPost.saveRequest", e );
		
		this.toSave = AGTA.modelUtility.convertFormArrayToKeyPair( e );
		
		Logger.log( "AGTA.ModelPost.saveRequest.toSave", JSON.toString( this.toSave ) );
	},
	saveData: function( e )
	{
		Logger.log( "AGTA.ModelPost.saveData", e );

		this.saveMeeting( e );
	},	
	saveMeeting: function( e )
	{
			this.meeting = new AGTA.Meeting( );
			this.meeting.set( "ACL", 					AGTA.modelUtility.meetingACL( ) );
			this.meeting.set( "geo_lat", 				e.results[0].geometry.location.lat );
			this.meeting.set( "geo_lng", 				e.results[0].geometry.location.lng );
			this.meeting.set( "meeting_address", 		e.results[0].formatted_address.toLowerCase( ) );
			this.meeting.set( "meeting_building",		this.toSave.meeting_building.toLowerCase( ) );
			this.meeting.set( "meeting_name", 			this.toSave.meeting_name.toLowerCase( ) );
			this.meeting.set( "meeting_day", 			AGTA.modelUtility.makePointer( "MeetingDay", this.toSave.meeting_day ) );
			this.meeting.set( "meeting_hour", 			AGTA.modelUtility.makePointer( "MeetingHour", this.toSave.meeting_hour ) );
			this.meeting.set( "meeting_minute", 		AGTA.modelUtility.makePointer( "MeetingMinute", this.toSave.meeting_minute ) );
			this.meeting.set( "meeting_period", 		AGTA.modelUtility.makePointer( "MeetingPeriod", this.toSave.meeting_period ) );
			this.meeting.set( "meeting_type", 			AGTA.modelUtility.makePointer( "MeetingType", this.toSave.meeting_type ) );
			this.meeting.set( "submitter", 				Parse.User.current( ) );
			this.meeting.save( null,
			{
				success: function( r )
				{
					Logger.log( "AGTA.ModelPost.saveData.meeting.success", r );
					
					AGTA.modelDispatcher.trigger( AGTA.modelDispatcher.SAVE_MEETING_SUCCESS, r );
				},
				error: function( e )
				{
					Logger.log( "AGTA.ModelPost.saveData.meeting.error", e );
					
					AGTA.modelDispatcher.trigger( AGTA.modelDispatcher.SAVE_MEETING_ERROR );
				}
			});
	},
	fetchData: function( )
	{
		if( this.fetchList.length )
		{
			var _this = this;
			var fetch = this.fetchList.pop( );
			
			Logger.log( "AGTA.ModelPost.fetchPostData: "+fetch.class );
			
			var query = new Parse.Query(  fetch.class );
				if( fetch.ascending )
				{
					query.ascending( fetch.ascending );
				}
				if( fetch.descending )
				{
					query.ascending( fetch.descending );
				}
				query.find
				({
					success: function( r )
					{
						AGTA.postData[ fetch.localName ] = r;
						
						_this.fetchData( );
					},
					error: function( e )
					{
						AGTA.modelDispatcher.trigger( AGTA.modelDispatcher.FETCH_POST_ERROR, fetch.class );
					}
				});
		}
		else
		{
			AGTA.modelDispatcher.trigger( AGTA.modelDispatcher.FETCH_POST_SUCCESS );
			AGTA.modelDispatcher.trigger( AGTA.modelDispatcher.PRELOAD_HIDE );
			
			Logger.log( "AGTA.ModelPost.fetchData.AGTA.modelDispatcher.FETCH_POST_SUCCESS" );
		}
	}
});