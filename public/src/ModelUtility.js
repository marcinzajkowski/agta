AGTA.ModelUtility = Parse.Object.extend( "ModelUtility",
{	
	initialize: function( )
	{
		this.preventSubmitOnEnter( );
		this.extendStringFunctionCapitalize( );
	},
	makePointer: function( className, id )
	{
		var object = new Parse.Object( className );
			object.id = id;
		return object;
	},
	groupACL: function( )
	{
		var _acl = new Parse.ACL( );
			_acl.setPublicReadAccess( true );
			_acl.setPublicWriteAccess( false );
			_acl.setWriteAccess( Parse.User.current( ).id, true );
			
		return _acl;
	},
	meetingACL: function( )
	{
		var _acl = new Parse.ACL( );
			_acl.setPublicReadAccess( true );
			_acl.setPublicWriteAccess( false );
			_acl.setWriteAccess( Parse.User.current( ).id, true );
			
		return _acl;
	},
	convertFormArrayToKeyPair: function( array )
	{
		var ob = { };
		
			for( var i=0; i<array.length; i++ )
			{
				ob[ array[ i ].name ] = array[ i ].value;
			}
		
		return ob;
	},
	fetchClassProperty: function( className, propertyName )
	{
		var _i = $( "<div/>" ).addClass( className ).appendTo( $("body") ).css( "display", "none" );
		var _p = _i.css( propertyName );
			_i.remove( );
			
			if( "background-image" == propertyName )
			{
				_p = _p.split( "(" )[ 1 ].split( ")" )[ 0 ];// extract URL only
			}
			
		return _p;
	},
	extendStringFunctionCapitalize: function( )
	{
		String.prototype.toCapitalCase = function( )
		{
			var wd = this.split(" ");
			var rs = "";
			
			for( var i=0; i< wd.length; i++ )
			{
				if( wd[ i ].indexOf( "." ) > -1 && wd[ i ].length == 1 )
				{
					rs += wd[ i ].toUpperCase( ); // handle acronyms by capitalizing whole
				}else{
					rs += wd[ i ].charAt( 0 ).toUpperCase( ) + wd[ i ].slice( 1 ) + " ";
				}
			}
			return rs;
		}
	},
	preventSubmitOnEnter: function( )
	{
		Logger.log( "AGTA.ModelUtility.preventSubmitOnEnter" );
		
		$( window ).keydown
		(
			function( e )
			{
				if( e.keyCode == 13 ) 
				{
				  event.preventDefault( );
				  
				  return false;
				}
			}
		);
	}
});