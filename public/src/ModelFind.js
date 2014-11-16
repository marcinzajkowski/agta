AGTA.ModelFind = Parse.Object.extend( "ModelFind",
{	
	initialize: function( )
	{
		AGTA.modelDispatcher.on( AGTA.modelDispatcher.FIND_LOCATION, this.find, this );
		AGTA.modelDispatcher.on( AGTA.modelDispatcher.FIND_NEARBY, this.nearby, this );
		AGTA.modelDispatcher.on( AGTA.modelDispatcher.AUTO_DETECT, this.auto, this );
		AGTA.modelDispatcher.on( AGTA.modelDispatcher.SAVE_POST_REQUEST, this.post, this );
	},
	auto: function( )
	{
		Logger.log( "AGTA.ModelFind.auto" );
		
		if( navigator.geolocation ) 
		{
			var options = new Object( );
				options.enableHighAccuracy = true;
				
			navigator.geolocation.getCurrentPosition
			(
				function( position )
				{
					Logger.log( "AGTA.ModelFind.auto.success", position );
					
					AGTA.modelDispatcher.trigger( AGTA.modelDispatcher.DETECT_SUCCESS, position );
					AGTA.modelDispatcher.trigger( AGTA.modelDispatcher.FIND_NEARBY );
				},
				function( error )
				{
					Logger.log( "AGTA.ModelFind.auto.error", error );
					
					AGTA.modelDispatcher.trigger( AGTA.modelDispatcher.DETECT_ERROR );
				},
				options
			);
		}
		else
		{
			Logger.log( "AGTA.ModelFind.auto.error !navigator.geolocation" );
			
			AGTA.modelDispatcher.on( AGTA.modelDispatcher.DETECT_ERROR );
		}
	},
	nearby: function( distanceMiles )
	{
		Logger.log( "AGTA.ModelFind.nearby" );

		if( !distanceMiles )
		{
			distanceMiles = 2;
		}
		
		var degrees = 1/(60*distanceMiles);
		
		var geo_lat_from = AGTA.fromLatLng.lat( ) - degrees;
		var geo_lat_to = AGTA.fromLatLng.lat( ) + degrees;
		
		var geo_lng_from = AGTA.fromLatLng.lng( ) - degrees;
		var geo_lng_to = AGTA.fromLatLng.lng( ) + degrees;
		
		var query = new Parse.Query( "Meeting" );
			
			query.limit( 1000 );
			
			query.include("meeting_type");
			query.include("meeting_day");
			query.include("meeting_hour");
			query.include("meeting_minute");
			query.include("meeting_period");
			
			query.greaterThan ( "timestamp", ( new Date( ).getHours( )*60 ) + new Date( ).getMinutes( ) );
			
			query.equalTo( "meeting_day", _.find( AGTA.postData.meeting_day, function( model ){ return model.get( "index" ) == new Date( ).getDay( ); }) );

			query.find
			({
				success: function( r )
				{
					Logger.log( "AGTA.ModelFind.nearby.success" );
					
					if( !r.length )
					{
						AGTA.modelDispatcher.trigger( AGTA.modelDispatcher.NEARBY_NONE );
					}else{
						AGTA.modelDispatcher.trigger( AGTA.modelDispatcher.NEARBY_SUCCESS, r );
					}
				},
				error: function( e )
				{
					Logger.log( "AGTA.ModelFind.nearby.error" );
					AGTA.modelDispatcher.trigger( AGTA.modelDispatcher.NEARBY_ERROR );
				}
			});
	},
	find: function( location )
	{
		Logger.log( "AGTA.ModelFind.find", location );
		
		this.findAjax( location, this.findSuccess );
	},
	post: function( formData )
	{
		Logger.log( "AGTA.ModelFind.post", formData );
		
		var datas = AGTA.modelUtility.convertFormArrayToKeyPair( formData )
		var addrs = 
			datas.street_number+" "+
			datas.street_name+" "+
			( ( datas.street_type != "" ) ? $( "[value='"+datas.street_type+"']")[0].innerHTML.trim( ) : "" ) +" "+
			( ( datas.street_direction != "" ) ? $( "[value='"+datas.street_direction+"']")[0].innerHTML.trim( ) : "" )+" "+
			datas.city+" "+
			AGTA.config.get( "defaultProvince" )+" "+
			datas.postal;
			
			addrs = addrs.trim( );
			
		this.findAjax( addrs, this.postSuccess );
	},
	postSuccess: function( d )
	{
		AGTA.modelDispatcher.trigger( AGTA.modelDispatcher.POST_FIND_SUCCESS, d );
	},
	findSuccess: function( d )
	{
		AGTA.modelDispatcher.trigger( AGTA.modelDispatcher.FIND_SUCCESS, d );
		AGTA.modelDispatcher.trigger( AGTA.modelDispatcher.FIND_NEARBY );
	},
	findAjax: function( location, callback )
	{
		Logger.log( "AGTA.ModelFind.findAjax", location );
		
		$.ajax
		({ 
			url: AGTA.config.get("GoogleSearchURL") + "?address=" + location,
			success: function( d )
			{
				Logger.log( "AGTA.ModelFind.find.success", d );
				if( d.results.length <= 0 )
				{
					AGTA.modelDispatcher.trigger( AGTA.modelDispatcher.FIND_ERROR );
				}else{
					callback( d );
				}
			},
			error: function( e )
			{
				Logger.log( "AGTA.ModelFind.find.error", e );
				
				AGTA.modelDispatcher.trigger( AGTA.modelDispatcher.FIND_ERROR );
			}
		});
	}
});