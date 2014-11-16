// menu object for main navigation
AGTA.ViewMenu = Parse.View.extend
({
	el: "#ViewMenu",
	MENU:"menu",
	LOGIN:"login",
	LOGOUT:"logout",
	FIND:"find",
	POST:"post",
	CONTACT:"contact",
	ABOUT:"about",
	isOpen:false,
	events: 
	{
		"click .menu":		"clickMenu",
		"click .login":		"clickMenu",
		"click .logout":	"clickMenu",
		"click .find":		"clickMenu",
		"click .post":		"clickMenu",
		"click .about":		"clickMenu",
		"click .contact":	"clickMenu"
	},
	initialize: function( )
	{
		Logger.log( "AGTA.ViewMenu.initialize" );
		
		AGTA.modelDispatcher.on( AGTA.modelDispatcher.LOGIN_CHANGE, this.loginChange, this );
		AGTA.modelDispatcher.on( AGTA.modelDispatcher.FETCH_POST_ERROR, this.fetchPostError, this );
		
		this.render( );
	},
	fetchPostError: function( )
	{
		Logger.log( "AGTA.ViewMenu.fetchPostError" );
		
		$( this.el ).find( ".post a" ).toggleClass( "menu-inactive" );
	},
	loginChange: function( )
	{
		Logger.log( "AGTA.ViewMenu.loginChange" );
		
		this.render( );
	},
	render: function( )
	{
		this.template = _.template( $("#TemplateViewMenu").html( ) );
		
		$( this.el ).empty( );
		$( this.el ).append( this.template );
		
		Logger.log( "AGTA.ViewMenu.render" );
		
		var menuHeight = $( this.el ).outerHeight( );
		var itemHeight = parseFloat( $( this.el ).find( '.menu-header' ).css( 'height' ) );
		this.defBottom = itemHeight - menuHeight;
		this.isOpen = false;
		
		$( this.el ).find( ".menu-items" ).css( "display", "none" );
		
		return this;
	},
	toggle: function( callback )
	{
		Logger.log( "AGTA.ViewMenu.toggle" );

		if( this.isOpen )
		{
			TweenMax.to( $( this.el ), AGTA.config.get("SectionOpenSpeed"),
			{
				css:
				{
					bottom:this.defBottom,
				},
				onComplete: function( )
				{
					$( this.el ).find( ".menu-items" ).css( "display", "none" )
					$( this.el ).css( "bottom", 0 );
				},
				onCompleteScope: this
			});
			
			this.isOpen = false;
		}
		else
		{
			$( this.el ).find( ".menu-items" ).css( "display", "block" )
			$( this.el ).css( "bottom", this.defBottom );
			
			TweenMax.to( $( this.el ), AGTA.config.get("SectionOpenSpeed"),
			{
				css:
				{
					bottom:0
				}
			});
			
			this.isOpen = true;
		}
	},
	clickMenu: function( e )
	{
		e.preventDefault( );
		
		var menu = e.currentTarget.className;
		
		Logger.log( "AGTA.ViewMenu.clickMenu", e.currentTarget.className );
		
		this.toggle( );
		
		if( this.MENU == menu )
		{
			return;// close the menu do nothing
		}
		else
		{
			Logger.log( "AGTA.ViewMenu.clickMenu.trigger." + menu );
			
			if( this.LOGIN == menu )
			{
				AGTA.modelDispatcher.trigger( AGTA.modelDispatcher.OPEN_SECTION, this.LOGIN );
			}
			if( this.LOGOUT == menu )
			{
				AGTA.modelDispatcher.trigger( AGTA.modelDispatcher.LOGOUT_USER, this.LOGOUT );//no section!
			}
			if( this.FIND == menu )
			{
				AGTA.modelDispatcher.trigger( AGTA.modelDispatcher.OPEN_SECTION, this.FIND );
			}
			if( this.POST == menu )
			{
				if( !Parse.User.current( ) )
				{
					AGTA.modelDispatcher.trigger( AGTA.modelDispatcher.OPEN_SECTION, this.LOGIN );
					AGTA.modelDispatcher.trigger( AGTA.modelDispatcher.LOGIN_TO_POST );
				}else{
					AGTA.modelDispatcher.trigger( AGTA.modelDispatcher.OPEN_SECTION, this.POST );
				}
			}
			if( this.CONTACT == menu )
			{
				AGTA.modelDispatcher.trigger( AGTA.modelDispatcher.OPEN_SECTION, this.CONTACT );
			}
			if( this.ABOUT == menu )
			{
				AGTA.modelDispatcher.trigger( AGTA.modelDispatcher.OPEN_SECTION, this.ABOUT );
			}
		}
	}
});