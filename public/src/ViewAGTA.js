// creates el containers for application
AGTA.ViewAGTA = Parse.View.extend
({
	el: AGTA.div,
	initialize: function( )
	{
		Logger.log("AGTA.ViewAGTA.initialize");
		
		this.render( );
	},
	render: function( )
	{
		Logger.log("AGTA.ViewAGTA.render");
		
		$( this.el ).append( $("<div/>").attr({ id:"ViewMap" }) );
		$( this.el ).append( $("<div/>").attr({ id:"ViewMenu" }) );
		$( this.el ).append( $("<div/>").attr({ id:"ViewLogin" }) );
		$( this.el ).append( $("<div/>").attr({ id:"ViewContact" }) );
		$( this.el ).append( $("<div/>").attr({ id:"ViewNotify" }) );
		$( this.el ).append( $("<div/>").attr({ id:"ViewFind" }) );
		$( this.el ).append( $("<div/>").attr({ id:"ViewPost" }) );
		$( this.el ).append( $("<div/>").attr({ id:"ViewDetail" }) );
		$( this.el ).append( $("<div/>").attr({ id:"ViewDirection" }) );
		$( this.el ).append( $("<div/>").attr({ id:"ViewAbout" }) );
		$( this.el ).append( $("<div/>").attr({ id:"ViewEdit" }) );
		$( this.el ).append( $("<div/>").attr({ id:"ViewClaim" }) );
		$( this.el ).append( $("<div/>").attr({ id:"ViewPreload" }) );
		$( this.el ).append( $("<div/>").attr({ id:"ViewEdit" }) );
	}
});