var jobName = "MeetingFilter";

var _ = require( "underscore" );

Parse.Cloud.job( jobName, function( request, response )
{	
	var _meetings = [];
	//
	var _startJob = function( )
	{
		_fetchMeetings( );
	}
	//
	var _fetchMeetings = function( )
	{
		console.log( jobName+"._fetchMeetings");
		//
		var _query = new Parse.Query( "Meeting" );
			_query.include( "meeting_hour" );
			_query.include( "meeting_minute" );
			_query.include( "meeting_period" );
			_query.limit( 1000 );
			_query.find(
			{
				success: function( r )
				{
					console.log( jobName+"._fetchMeetings.success");
					for( var i=0;i<r.length;i++)
					{
						_meetings.push( r[i] );
					}
					_filter( );
				},
				error: function( e )
				{
					console.log( jobName+"._fetchMeetings.error."+JSON.stringify( e ) );
					//
					response.error( );
				}
			});
	}
	//
	var _filter = function( )
	{
		console.log( jobName+"._filter");
		//
		for( var i=0; i<_meetings.length; i++ )
		{
			var _meeting = _meetings[ i ];
			//
			var minutes = _meeting.get( "meeting_hour").get("value")*60;
				minutes += _meeting.get( "meeting_minute" ).get( "value" );
				minutes += ( _meeting.get( "meeting_period" ).get( "name" ) == "pm" ) ? ( 12 * 60 ) : 0;
				//
			_meeting.set( "timestamp", Number( minutes ) );
		}
		_save( );
	}
	//
	var _save = function( )
	{
		console.log( jobName+"._save");
		//
		Parse.Cloud.useMasterKey( );
		Parse.Object.saveAll( _meetings, 
		{
			success: function( r )
			{
				console.log( jobName+"._save.success" );
				//
				_finishJob( );
			},
			error: function( e )
			{
				console.log( jobName+"._save.error."+JSON.stringify( e ) );
				//
				response.error( );
			}
		});
	}
	//
	var _finishJob = function( )
	{
		console.log( jobName+"._finishJob");
		//
		response.success( );
	}
	//
	_startJob( );
	//
});