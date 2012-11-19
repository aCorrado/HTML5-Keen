/*!
 * 
 *  HTML5 Keen
 *  https://github.com/JoeAnzalone/HTML5-Keen
 *  By Joe Anzalone & Steven Anzalone
 *  Uses the melonJS game engine (http://www.melonjs.org)
 *
 **/

// Resources
var g_resources = [{
    name: "main",
    type: "image",
    src: "data/tilesets/main.png"
}, {
    name: "level_1",
    type: "tmx",
    src: "data/levels/level_1.tmx"
}, {
    name: "keen_walk_right",
    type: "image",
    src: "data/sprites/keen_walk_right.png"
}, {
	// the spinning coin spritesheet
    name: "spinning_coin_gold",
    type: "image",
    src: "data/sprites/spinning_coin_gold.png"
}, {
    // Lollipop
    name: "lollipop",
    type: "image",
    src: "data/sprites/items/lollipop.png"
},

// Enemty entity
{
    name: "wheelie_right",
    type: "image",
    src: "data/sprites/wheelie_right.png"
}, {
	// game font
    name: "32x32_font",
    type: "image",
    src: "data/sprites/32x32_font.png"
},
// audio resources
{
    name: "cling",
    type: "audio",
    src: "data/audio/",
    channel: 2
}, {
    name: "collect",
    type: "audio",
    src: "data/audio/",
    channel: 2
}, {
    name: "stomp",
    type: "audio",
    src: "data/audio/",
    channel: 1
}, {
    name: "jump",
    type: "audio",
    src: "data/audio/",
    channel: 1
}, {
    name: "land",
    type: "audio",
    src: "data/audio/",
    channel: 1
}, {
    name: "title_screen",
    type: "image",
    src: "data/GUI/title_screen.png"
}];


var jsApp = {
	/* ---
		Initialize the jsApp
		---			*/
	onload: function() {
		
		// init the video
		if (!me.video.init('jsapp', 320, 200, true, 'auto'))
		{
			alert("Sorry but your browser does not support html 5 canvas.");
         return;
		}

		// initialize the "audio"
		me.audio.init("mp3,ogg");
		
		// set all resources to be loaded
		me.loader.onload = this.loaded.bind(this);
		
		// set all resources to be loaded
		me.loader.preload(g_resources);

		// load everything & display a loading screen
		me.state.change(me.state.LOADING);

		// me.debug.renderHitBox = true;

        

	},
	
    /* ---------------------
    callback when everything is loaded
    ------------------------ */
    loaded: function() {

        var ctx = me.video.getScreenCanvas().getContext('2d');
        ctx.imageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;
        ctx.mozImageSmoothingEnabled = false;

        // set the "Play/Ingame" Screen Object
        me.state.set(me.state.MENU, new TitleScreen());
     
        // set the "Play/Ingame" Screen Object
        me.state.set(me.state.PLAY, new PlayScreen());
     
        // set a global fading transition for the screen
        me.state.transition("fade", "#FFFFFF", 250);
     
        // add our player entity in the entity pool
        me.entityPool.add("mainPlayer", PlayerEntity);

        // me.entityPool.add("KeenCollectableEntity", KeenCollectableEntity);
        me.entityPool.add("LollipopEntity", LollipopEntity);

        me.entityPool.add("EnemyEntity", EnemyEntity);
     
        // enable the keyboard
        me.input.bindKey(me.input.KEY.LEFT, "left");
        me.input.bindKey(me.input.KEY.RIGHT, "right");
        me.input.bindKey(me.input.KEY.X, "jump", true);
     
        // display the menu title
        me.state.change(me.state.MENU);
    }

}; // end jsApp

/* The in game stuff */
var PlayScreen = me.ScreenObject.extend({
 
    onResetEvent: function() {

        // load a level
        me.levelDirector.loadLevel("level_1");
 		
 		/*context.drawImage(this.title, 0, 0);
        this.font.draw(context, "LEVEL ONE", 20, 240);*/

        // add a default HUD to the game mngr
        me.game.addHUD(0, 430, 640, 60);
 
        // add a new HUD item
        me.game.HUD.addItem("score", new ScoreObject(620, 10));
 
        // make sure everyhting is in the right order
        me.game.sort();
 
    },
 
    /* ---
    Action to perform when game is finished (state change)
    --- */
    onDestroyEvent: function() {

         // remove the HUD
    	me.game.disableHUD();
 
    	// stop the current audio track
    	me.audio.stopTrack();
    }
 
});

// Bootstrap :)
window.onReady(function() {
	jsApp.onload();
});