var jobName = "ImportedMeetingProcess";

var _ = require( "underscore" );

Parse.Cloud.job( jobName, function( request, response )
{	
	var config = null;
	var imported = null;
	var newMeetings = [ ];
	var toSave = [ ];
	var datas = [ ];
	var fetcht = [
		"User",
		"MeetingDay",
		"MeetingHour",
		"MeetingMinute",
		"MeetingPeriod",
		"MeetingType",
		"ImportedMeetings"
	]
	//
	var Meeting = Parse.Object.extend( "Meeting" );
	//
	var _startJob = function( )
	{
		_getConfig( );
	}
	//
	var _getConfig = function( )
	{
		console.log( jobName+"._getConfig");
		Parse.Cloud.useMasterKey( );
		//
		var _config = Parse.Config.get( ).then
		(
			function( r )
			{
				config = r;
				//
				_fetchDatas( ); 
			}
		);
	};
	
	var _fetchDatas = function( )
	{
		if( fetcht.length )
		{
			var tname = fetcht.pop( );
			var query = new Parse.Query( tname );
				query.limit( 1000 );
				query.find(
				{
					success: function( r )
					{
						console.log( jobName+"._fetchDatas."+tname+".success."+r.length );
						datas[ tname ] = r;
						_fetchDatas( );
					},
					error: function( e )
					{
						console.log( jobName+"._fetchDatas."+tname+".error."+JSON.stringify( e ) );
					}
				});
		}
		else
		{
			_processMeetings( );
		}
	}
	//
	var _find = function( table, column, value )
	{
		for( var i=0; i<datas[ table ].length; i++ )
		{
			if( datas[ table ][ i ].get( column ) == value )
			{
				return datas[ table ][ i ];
			}
		}
	}
	//
	var _processMeetings = function( )
	{
		console.log( jobName+"._processMeetings");
		//
		var _acl = new Parse.ACL( );
			_acl.setPublicReadAccess( true );
			_acl.setPublicWriteAccess( false );
			_acl.setWriteAccess( datas.User[ 0 ].id, true );
			//
		for( var i=0; i<datas.ImportedMeetings.length; i++ )
		{
			var imported = datas.ImportedMeetings[ i ];
			var meeting = new Meeting( );
			var itype = imported.get( "Type" );
			//
			var __time = imported.get( "Time" ).replace(":"," ").split(" ");
				//
				meeting.set( "meeting_name", imported.get( "Name" ).toLowerCase( ) );
				//
				if( itype.indexOf( "Either" ) > -1 )
				{
					meeting.set( "meeting_type", _find( "MeetingType", "name", "open or closed" ) )
				}
				//
				if( itype.indexOf( "Open" ) > -1 && itype.indexOf( "Either" ) <= -1 )
				{
					meeting.set( "meeting_type", _find( "MeetingType", "name", "open" ) )
				}
				//
				if( itype.indexOf( "Closed" ) > -1 && itype.indexOf( "Either" ) <= -1 )
				{
					meeting.set( "meeting_type", _find( "MeetingType", "name", "closed" ) )
				}
				//
				meeting.set( "meeting_building", imported.get( "Facility" ).toLowerCase( ) );
				meeting.set( "meeting_day", _find( "MeetingDay", "name", imported.get( "days" ).toLowerCase( ) ) );
				meeting.set( "meeting_hour", _find( "MeetingHour", "value", __time[ 0 ] ) );
				meeting.set( "meeting_minute", _find( "MeetingMinute", "name", __time[ 1 ] ) );
				meeting.set( "meeting_period", _find( "MeetingPeriod", "name", __time[ 2 ].toLowerCase( ) ) );
				meeting.set( "meeting_address", String( imported.get( "Street" )+" "+imported.get( "cityTown" )+" "+"Ontario" ).toLowerCase( ) );
				//
				meeting.set( "submitter", datas.User[ 0 ] );
				meeting.set( "imported", true );
				meeting.set( "ACL", _acl );
				//
			newMeetings.push( meeting );
		}
		console.log( jobName+"._processMeetings "+newMeetings.length );
		//
		_googleLookup( );
	}
	//
	var _googleLookup = function( )
	{
		var url = config.get( "GoogleSearchURL" );
		var key = config.get( "GoogleAPIKey" );
		
		//console.log( jobName +"."+ url );
		//console.log( jobName +"."+ key );
		if( newMeetings.length )
		{
			var newMeeting = newMeetings.pop( );
			var adr = newMeeting.get( "meeting_address" );

			Parse.Cloud.httpRequest
			({
				url: url,
				params:
				{
                    address : adr,
                    key: key
                },
				success: function( r ) 
				{
					//console.log( jobName+"._googleLookup."+JSON.stringify( r ) );

					try
					{
						newMeeting.set( "geo_lat", r.data.results[ 0 ].geometry.location.lat );
					}
					catch( e )
					{
						console.log( jobName+"._googleLookup.error geo_lat"+JSON.stringify( e ) );
					}
					
					try
					{
						newMeeting.set( "geo_lng", r.data.results[ 0 ].geometry.location.lng );
					}
					catch( e )
					{
						console.log( jobName+"._googleLookup.error geo_lng"+JSON.stringify( e ) );
					}
					
					try
					{
						newMeeting.set( "meeting_address", r.data.results[ 0 ].formatted_address.toLowerCase( ) );
					}
					catch( e )
					{
						console.log( jobName+"._googleLookup.error meeting_address"+JSON.stringify( e ) );
					}
					
					toSave.push( newMeeting );
					
					_googleLookup( );
				},
				error: function( e ) 
				{
					console.log( jobName+"._processMeetings.success."+JSON.stringify( e ) );
					
					response.error( );
				}
			});
		}else{
			_saveAll( );
		}
	}
	//
	var _saveAll = function( )
	{
		Parse.Cloud.useMasterKey( );
		//
		Parse.Object.saveAll( toSave,
		{
			success: function( r )
			{
				console.log( jobName+"._processMeetings.success."+JSON.stringify( r ) );
				//
				_finishJob( );
			},
			error: function( e )
			{
				console.log( jobName+"._processMeetings.error."+JSON.stringify( e ) );
				//
				response.error( );
			}
		});
	}
	//
	var _finishJob = function( )
	{
		console.log( jobName+"._googleLookup");
		//
		response.success( );
	}
	//
	_startJob( );
	//
});