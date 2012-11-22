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
    name: "keen",
    type: "image",
    src: "data/sprites/keen.png"
}, {
    // Lollipop
    name: "lollipop",
    type: "image",
    src: "data/sprites/items/lollipop.png"
}, {
    // Soda
    name: "soda",
    type: "image",
    src: "data/sprites/items/soda.png"
}, {
    // Pizza
    name: "pizza",
    type: "image",
    src: "data/sprites/items/pizza.png"
}, {
    // Book
    name: "book",
    type: "image",
    src: "data/sprites/items/book.png"
}, {
    // Teddy Bear
    name: "teddy-bear",
    type: "image",
    src: "data/sprites/items/teddy-bear.png"
}, {
    // Raygun
    name: "raygun",
    type: "image",
    src: "data/sprites/items/raygun.png"
}, {
    // Pogo stick
    name: "pogo-stick",
    type: "image",
    src: "data/sprites/items/pogo-stick.png"
}, {
    // Raygun bullet
    name: "bullet",
    type: "image",
    src: "data/sprites/bullet.png"
}, {
	// game font
    name: "32x32_font",
    type: "image",
    src: "data/sprites/32x32_font.png"
},
// audio resources
{
    name: "collect",
    type: "audio",
    src: "data/audio/",
    channel: 2
}, {
    name: "jump",
    type: "audio",
    src: "data/audio/",
    channel: 1
}, {
    name: "fall",
    type: "audio",
    src: "data/audio/",
    channel: 1
}, {
    name: "land",
    type: "audio",
    src: "data/audio/",
    channel: 2
}, {
    name: "head-bump",
    type: "audio",
    src: "data/audio/",
    channel: 1
}, {
    name: "raygun-collect",
    type: "audio",
    src: "data/audio/",
    channel: 1
}, {
    name: "shoot",
    type: "audio",
    src: "data/audio/",
    channel: 1
}, {
    name: "shoot-wall",
    type: "audio",
    src: "data/audio/",
    channel: 1
}, {
    name: "shoot-empty",
    type: "audio",
    src: "data/audio/",
    channel: 1
}, {
    name: "joystick",
    type: "audio",
    src: "data/audio/",
    channel: 1
}, {
    name: "title_screen",
    type: "image",
    src: "data/GUI/title_screen.png"
}, {
    name: "pat-pat",
    type: "image",
    src: "data/sprites/enemies/pat-pat.png"
}, {
    name: "yorp",
    type: "image",
    src: "data/sprites/enemies/yorp.png"
}, {
    name: "yorp-cry",
    type: "audio",
    src: "data/audio/"
}, {
    name: "yorp-die",
    type: "audio",
    src: "data/audio/"
}];



var jsApp = {
	/* ---
		Initialize the jsApp
		---			*/
	onload: function() {

		// init the video
		if (!me.video.init('jsapp', 320, 200, true, 'auto')) {
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

        // set the "Play/Ingame" Screen Object
        me.state.set(me.state.MENU, new TitleScreen());
     
        // set the "Play/Ingame" Screen Object
        me.state.set(me.state.PLAY, new PlayScreen());
     
        // set a global fading transition for the screen
        me.state.transition("fade", "#FFFFFF", 250);
     
        // add our player entity in the entity pool
        me.entityPool.add("mainPlayer", PlayerEntity);

        // Collectable Entities
        me.entityPool.add("lollipop", LollipopEntity);
        me.entityPool.add("soda", SodaEntity);
        me.entityPool.add("pizza", PizzaEntity);
        me.entityPool.add("book", BookEntity);
        me.entityPool.add("teddy-bear", TeddyBearEntity);
        
        me.entityPool.add("raygun", RaygunEntity);
        me.entityPool.add("pogo", PogoEntity);

        // Enemy Entities
        me.entityPool.add("pat-pat", PatPatEntity);
        me.entityPool.add("yorp", YorpEntity);
     
        // enable the keyboard
        me.input.bindKey(me.input.KEY.LEFT, "left");
        me.input.bindKey(me.input.KEY.RIGHT, "right");

        me.input.bindKey(me.input.KEY.X, "jump", true);
        me.input.bindKey(me.input.KEY.CTRL, "jump", true);

        me.input.bindKey(me.input.KEY.Z, "pogo", true);
        me.input.bindKey(me.input.KEY.ALT, "pogo", true);
        me.input.bindKey(me.input.KEY.SPACE, "fire", true);

        me.input.bindKey(me.input.KEY.C, "c", false);
        me.input.bindKey(me.input.KEY.T, "t", false);
        // me.input.bindKey(me.input.KEY.SPACE, "space");
     
        // display the menu title
        me.state.change(me.state.MENU);
    }

}; // end jsApp

/* The in game stuff */
var PlayScreen = me.ScreenObject.extend({
    
    init: function(){
        this.parent(true);
    },

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
    },

    update: function(){
        // console.log('update');
        var ctx = me.video.getScreenCanvas().getContext('2d');
        ctx.imageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;
        ctx.mozImageSmoothingEnabled = false;
    }
 
});

// Bootstrap :)
window.onReady(function() {
	jsApp.onload();
});