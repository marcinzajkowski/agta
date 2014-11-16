AGTA.ViewMap = Parse.View.extend
({
	el: "#ViewMap",
	initialize: function( )
	{
		Logger.log( "AGTA.ViewMap.initialize" );
		
		AGTA.modelDispatcher.on( AGTA.modelDispatcher.FIND_SUCCESS, this.findSuccess, this );
		AGTA.modelDispatcher.on( AGTA.modelDispatcher.NEARBY_SUCCESS, this.nearbySuccess, this );
		AGTA.modelDispatcher.on( AGTA.modelDispatcher.DIRECT_DRIVING, this.directDriving, this );
		AGTA.modelDispatcher.on( AGTA.modelDispatcher.DIRECT_WALKING, this.directWalking, this );
		AGTA.modelDispatcher.on( AGTA.modelDispatcher.DETECT_SUCCESS, this.detectSuccess, this );
		AGTA.modelDispatcher.on( AGTA.modelDispatcher.SAVE_MEETING_SUCCESS, this.saveMeetingSuccess, this );
		
		this.render( );
	},
	saveMeetingSuccess: function( e )
	{
		Logger.log( "AGTA.ViewMap.saveMeetingSuccess", e );
		
		this.postSuccessHandler
		(
			e.get("geo_lat"),
			e.get("geo_lng")
		);
	},
	detectSuccess: function( e )
	{
		Logger.log( "AGTA.ViewMap.detectSuccess", e );
		
		this.findSuccessHandler
		(
			e.coords.latitude,
			e.coords.longitude
		);
	},
	clearMap: function( e )// clears map content for new find
	{
		Logger.log( "AGTA.clearMap", this.nearby );
		
		AGTA.directionsDisplay.setMap( null );
		
		if( this.nearby )
		{
			while( this.nearby.length )
			{
				var obj = this.nearby.pop( );
					Logger.log( "AGTA.clearMap.obj",obj );
					obj.marker.setMap( null );
			}
		}
		if( AGTA.youAreHere )
		{
			AGTA.youAreHere.setMap( null );
			delete AGTA.youAreHere;
		}
		if( AGTA.fromLatLng )
		{
			delete AGTA.fromLatLng;
		}
		if( AGTA.newMeetingLatLng )
		{
			delete AGTA.newMeetingLatLng;
		}
		if( AGTA.newMeetingMark )
		{
			AGTA.newMeetingMark.setMap( null );
			delete AGTA.newMeetingMark;
		}
	},
	directWalking: function( e )
	{
		Logger.log( "AGTA.ViewMap.directWalking" );
		
		this.direct( AGTA.modelDispatcher.DIRECT_WALKING );
	},
	directDriving: function( e )
	{
		Logger.log( "AGTA.ViewMap.directDriving" );
		
		this.direct( AGTA.modelDispatcher.DIRECT_DRIVING );
	},
	direct: function( e )
	{
		Logger.log( "AGTA.ViewMap.direct", e );
		
		var direction_type;
		
		AGTA.directionsDisplay.setMap( AGTA.GoogleMap );
		
		if( AGTA.modelDispatcher.DIRECT_DRIVING == e )
		{
			direction_type = google.maps.TravelMode["DRIVING"];
		}
		if( AGTA.modelDispatcher.DIRECT_WALKING == e )
		{
			direction_type = google.maps.TravelMode["WALKING"];
		}

		var travel = {
			origin: 			AGTA.fromLatLng,
			destination: 		AGTA.toLatLng,
			travelMode: 		direction_type
		}
		
		AGTA.directionsService.route
		(
			travel, 
			function( result, status )
			{
				if ( status == google.maps.DirectionsStatus.OK ) 
				{
					AGTA.directionsDisplay.setDirections( result );
					
					Logger.log( "AGTA.ViewMap.status.OK", result );
					
					AGTA.modelDispatcher.trigger( AGTA.modelDispatcher.DIRECT_SUCCESS );
				}
				else
				{
					AGTA.modelDispatcher.trigger( AGTA.modelDispatcher.DIRECT_ERROR );
				}
			}
		);
	},
	nearbySuccess: function( e )
	{
		Logger.log( "AGTA.ViewMap.nearbySuccess", e );
		
		if( !this.nearby )
		{
			this.nearby = [ ];
		}
		
		for( var i=0; i<e.length; i++ )
		{
			this.nearby.push( { model: e[ i ] } );
		}
		
		TweenMax.delayedCall( 3, this.dropNearbyMarker, null, this );
	},
	dropNearbyMarker: function( e )
	{
		Logger.log( "AGTA.ViewMap.dropNearbyMarker", this.nearby );
		
		for( var i=0; i< this.nearby.length; i++ )
		{
			this.nearby[ i ].marker = new google.maps.Marker
			({
				animation: 		google.maps.Animation.DROP,
				position: 		new google.maps.LatLng
								(
									this.nearby[ i ].model.get( "geo_lat" ),
									this.nearby[ i ].model.get( "geo_lng" )
								),
				map: 			AGTA.GoogleMap,
				title: 			"Nearby meeting.",
				icon: 			AGTA.modelUtility.fetchClassProperty( "marker-triangle", "background-image" ),
				customInfo: 	this.nearby[ i ].model // store object in marker for click
			});
			
			google.maps.event.addListener( this.nearby[ i ].marker, 'click', function( b ) 
			{
				AGTA.modelDispatcher.trigger( AGTA.modelDispatcher.NEARBY_DETAILS, this.customInfo );

				AGTA.toLatLng = b.latLng;
				
				AGTA.GoogleMap.panTo( b.latLng );
			});
		}
	},
	findSuccess: function( e )
	{
		Logger.log( "AGTA.ViewMap.findSuccess", e );
		
		this.findSuccessHandler
		( 
			e.results[ 0 ].geometry.location.lat, 
			e.results[ 0 ].geometry.location.lng 
		)
	},
	findSuccessHandler: function( latitude, longitude )
	{
		Logger.log( "AGTA.ViewMap.findSuccessHandler", latitude, longitude );
		
		this.clearMap( );
		
		AGTA.fromLatLng = new google.maps.LatLng
		(
			latitude, 
			longitude
		)
		
		AGTA.GoogleMap.panTo
		(
			AGTA.fromLatLng
		);
		
		AGTA.GoogleMap.setZoom( AGTA.config.get( "ZoomedMapZoom" ) );

		TweenMax.delayedCall( 2, this.dropFromMarker, null, this );
	},
	postSuccessHandler: function( latitude, longitude )
	{
		Logger.log( "AGTA.ViewMap.dropFromMarker" );
		
		this.clearMap( );
		
		AGTA.newMeetingLatLng = new google.maps.LatLng
		(
			latitude, 
			longitude
		)

		AGTA.newMeetingMark = new google.maps.Marker
		({
			animation: 	google.maps.Animation.DROP,
			position: 	AGTA.newMeetingLatLng,
			map: 		AGTA.GoogleMap,
			title: 		"Your new meeting location.",
			icon: 		AGTA.modelUtility.fetchClassProperty( "marker-triangle", "background-image" )
		});
		
		google.maps.event.addListener( AGTA.newMeetingMark, 'click', function( b ) 
		{
			AGTA.modelDispatcher.trigger( AGTA.modelDispatcher.NEW_MEETING_LOC );
		
			AGTA.GoogleMap.panTo( b.latLng );
		});
		
		AGTA.GoogleMap.panTo( AGTA.newMeetingLatLng );
		
		AGTA.GoogleMap.setZoom( AGTA.config.get( "ZoomedMapZoom" ) );
	},
	dropFromMarker: function( )
	{
		Logger.log( "AGTA.ViewMap.dropFromMarker" );

		AGTA.youAreHere = new google.maps.Marker
		({
			animation: 	google.maps.Animation.DROP,
			position: 	AGTA.fromLatLng,
			map: 		AGTA.GoogleMap,
			title: 		"You are here.",
			icon: 		AGTA.modelUtility.fetchClassProperty( "marker-round", "background-image" )
		});
		
		google.maps.event.addListener( AGTA.youAreHere, 'click', function( b ) 
		{
			AGTA.modelDispatcher.trigger( AGTA.modelDispatcher.YOU_ARE_HERE );
		
			AGTA.GoogleMap.panTo( b.latLng );
		});
	},
	render: function( r )
	{
		Logger.log( "AGTA.ViewMap.render" );
		
		var op = {
			zoom: AGTA.config.get("DefaultMapZoom"),
			center: new google.maps.LatLng
			( 
				AGTA.config.get("DefaultGeoPoint").latitude, 
				AGTA.config.get("DefaultGeoPoint").longitude 
			),
			zoomControlOptions: 
			{
				style: google.maps.ZoomControlStyle.SMALL,
				position: google.maps.ControlPosition.RIGHT_CENTER
			}
		};
		
		AGTA.GoogleMap = new google.maps.Map( this.el, op );
		AGTA.directionsDisplay = new google.maps.DirectionsRenderer
		( 
			{
				suppressMarkers: true,
				//draggable: true,
				panel: $( ".GoogleDirections" )[ 0 ],
				//preserveViewport: true
			}
		);
		
		AGTA.directionsService = new google.maps.DirectionsService( );
	}
});