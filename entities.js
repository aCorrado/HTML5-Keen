/*------------------- 
A player entity
-------------------------------- */
var PlayerEntity = me.ObjectEntity.extend({
 
    /* -----
    constructor
    ------ */
 
    init: function(x, y, settings) {
        this.orientation = 'right';

        // call the constructor
        this.parent(x, y, settings);
 
        // set the default horizontal & vertical speed (accel vector)
        this.setVelocity(2.4, 15);
 
        // me.debug.renderHitBox = true;

        // adjust the bounding box
        this.updateColRect(2, 10, 3, 21);
        // x, w, y, h

        // me.game.viewport.setBounds(100, 100);

        // set the display to follow our position on both axis
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
 

        this.addAnimation ('stand_right', [0]);
        this.addAnimation ('walk_right', [1,2,3]);

        this.addAnimation ('stand_left', [6]);
        this.addAnimation ('walk_left', [7,8,9]);

        this.addAnimation ('jump_right', [12,13,14,15,16,17]);
        this.addAnimation ('jump_left', [18,19,20,21,22,23]);

        this.addAnimation ('fall_right', [17]);
        this.addAnimation ('fall_left', [23]);

    },
 
    /* -----
 
    update the player pos
 
    ------ */

    update: function() {

        // check for collision
        var collision = this.collisionMap.checkCollision(this.collisionBox, this.vel);
        if ( collision.y ) {
            if (collision.yprop.type != 'platform' && collision.y < 0) {
                me.audio.play("head-bump");
            }

            if (collision.y > 0 && !this.falling) {
                me.audio.play("land");
            }
        }
     
        if (me.input.isKeyPressed('left')) {
            // flip the sprite on horizontal axis
            // this.flipX(true);
            this.setCurrentAnimation('walk_left');
            // this.image = me.loader.getImage('keen_walk_left');

            // update the entity velocity
            this.vel.x -= this.accel.x * me.timer.tick;
            this.orientation = 'left';
        } else if (me.input.isKeyPressed('right')) {
            // unflip the sprite
            this.flipX(false);

            this.setCurrentAnimation('walk_right');
            // this.setCurrentAnimation('jump_left');

            // update the entity velocity
            this.vel.x += this.accel.x * me.timer.tick;
            this.orientation = 'right';
        } else {
            this.vel.x = 0;
            
            if ( this.orientation == 'left' ) {
                this.setCurrentAnimation('stand_left');
            } else {
                this.setCurrentAnimation('stand_right');
            }
            // this.setAnimationFrame(1);
            // this.animationpause = true;
            // me.setAnimationFrame(1);
            // console.log( me.AnimationSheet );

            // var animation = me.AnimationSheet(10, 10, );
            // animation.setAnimationFrame(1);

        }

    if (me.input.isKeyPressed('jump')) {

        if (!this.jumping && !this.falling) {


            // set current vel to the maximum defined value
            // gravity will then do the rest
            this.gravity = 0.15;

            this.vel.y = -4 * me.timer.tick;

            // set the jumping flag
            this.jumping = true;

            // play some audio
            me.audio.play("jump");


        }
    }
     
        
        // check & update player movement
        this.updateMovement();
     
        if ( this.vel.y !=0 ) {

            if ( this.orientation == 'left' ) {
                this.setCurrentAnimation("fall_left");
                // this.setAnimationFrame(0);
            } else {
                this.setCurrentAnimation('fall_right');
                // this.setAnimationFrame(0);
            }

        } else  {
            // this.setCurrentAnimation("walk");
        }


        // check for collision
        var res = me.game.collide(this);
        
        if (res) {
            if (res.obj.type == me.game.ENEMY_OBJECT) {
                this.flicker(45);
            }
        }

        // update animation if necessary
        if (this.vel.x!=0 || this.vel.y!=0) {
            // update objet animation
            this.parent(this);
            return true;
        }
        // else inform the engine we did not perform
        // any update (e.g. position, animation)
        return false;       
     
    }
 
});

/*----------------
 KeenCollectable entity
------------------------ */
var KeenCollectableEntity = me.CollectableEntity.extend({
    scoreValue: 0,
    sound: 'collect',
    niceName: 'Collectable',
    // extending the init function is not mandatory
    // unless you need to add some extra initialization
    init: function(x, y, settings) {
        // call the parent constructor
        this.parent(x, y, settings);

        // settings.image = "soda";
        // this.image = me.loader.getImage('soda');
    },
 
    // this function is called by the engine, when
    // an object is touched by something (here collected)
    onCollision : function () {
        // do something when collide
        me.audio.play( this.sound );

        // give some score
        me.game.HUD.updateItemValue("score", this.scoreValue);
        // console.log('Collected ' + this.niceName + ' worth ' + this.scoreValue + ' points');
        // make sure it cannot be collected "again"
        this.collidable = false;
        // remove it
        me.game.remove(this);
    }
 
});

/*----------------
 Lollipop entity
------------------------ */
var LollipopEntity = KeenCollectableEntity.extend({
    niceName: 'Lollipop',
    scoreValue: 100
});

/*----------------
 Soda entity
------------------------ */
var SodaEntity = KeenCollectableEntity.extend({
    niceName: 'Soda',
    scoreValue: 200
});

/*----------------
 Pizza entity
------------------------ */
var PizzaEntity = KeenCollectableEntity.extend({
    niceName: 'Pizza',
    scoreValue: 500
});

/*----------------
 Book entity
------------------------ */
var BookEntity = KeenCollectableEntity.extend({
    niceName: 'Book',
    scoreValue: 1000
});

/*----------------
 Teddy Bear entity
------------------------ */
var TeddyBearEntity = KeenCollectableEntity.extend({
    niceName: 'Teddy Bear',
    scoreValue: 5000
});

/*----------------
 Raygun entity
------------------------ */
var RaygunEntity = KeenCollectableEntity.extend({
    niceName: 'Raygun',
    sound: 'raygun-collect'
});

/* --------------------------
The enemy entity from the tutorial
------------------------ */
var WheelieEntity = me.ObjectEntity.extend({
    init: function(x, y, settings) {
        // define this here instead of tiled
        settings.image = "wheelie_right";
        settings.spritewidth = 64;
 
        // call the parent constructor
        this.parent(x, y, settings);
 
        this.startX = x;
        this.endX = x + settings.width - settings.spritewidth;
        // size of sprite
 
        // make him start from the right
        this.pos.x = x + settings.width - settings.spritewidth;
        this.walkLeft = true;
 
        // walking & jumping speed
        this.setVelocity(4, 6);
 
        // make it collidable
        this.collidable = true;
        // make it a enemy object
        this.type = me.game.ENEMY_OBJECT;
 
    },
 
    // call by the engine when colliding with another object
    // obj parameter corresponds to the other object (typically the player) touching this one
    onCollision: function(res, obj) {
 
        // res.y >0 means touched by something on the bottom
        // which mean at top position for this one
        if (this.alive && (res.y > 0) && obj.falling) {
            this.flicker(45);
        }
    },
 
    // manage the enemy movement
    update: function() {
        // do nothing if not visible
        if (!this.visible)
            return false;
 
        if (this.alive) {
            if (this.walkLeft && this.pos.x <= this.startX) {
                this.walkLeft = false;
            } else if (!this.walkLeft && this.pos.x >= this.endX) {
                this.walkLeft = true;
            }
            // make it walk
            this.flipX(this.walkLeft);
            this.vel.x += (this.walkLeft) ? -this.accel.x * me.timer.tick : this.accel.x * me.timer.tick;
                 
        } else {
            this.vel.x = 0;
        }
         
        // check and update movement
        this.updateMovement();
         
        // update animation if necessary
        if (this.vel.x!=0 || this.vel.y!=0) {
            // update objet animation
            this.parent(this);
            return true;
        }
        return false;
    }
});


/* --------------------------
An enemy Entity
------------------------ */
var EnemyEntity = me.ObjectEntity.extend({
   init: function(x, y, settings) {

        // call the parent constructor
        this.parent(x, y, settings);

        // make it collidable
        this.collidable = true;

        // make it a enemy object
        this.type = me.game.ENEMY_OBJECT;

    }
});


var PatPatEntity = EnemyEntity.extend({

});

/*--------------
A score HUD item
--------------------- */
 
var ScoreObject = me.HUD_Item.extend({
    init: function(x, y) {
        // call the parent constructor
        this.parent(x, y);
        // create a font
        this.font = new me.BitmapFont("32x32_font", 32);
    },
 
    // draw our score
    draw: function(context, x, y) {
        // this.font.draw(context, this.value, this.pos.x + x, this.pos.y + y);
        // console.log( this.pos.x + x + '::' + this.pos.y + y );
        this.font.draw(context, 'LOL', this.pos.x + x, this.pos.y + y);
        // this.font.draw(context, 'HAHA', 620, 100);

    }
 
});

/*----------------------
    A title screen
  ----------------------*/
var TitleScreen = me.ScreenObject.extend({
    // constructor
    init: function() {
        this.parent(true);
 
        // title screen image
        this.title = null;
 
        this.font = null;
        this.scrollerfont = null;
        this.scrollertween = null;
 
        this.scroller = "A SMALL STEP BY STEP TUTORIAL FOR GAME CREATION WITH MELONJS       ";
        this.scrollerpos = 600;
    },
 
    // reset function
    onResetEvent: function() {
        if (this.title == null) {
            // init stuff if not yet done
            this.title = me.loader.getImage("title_screen");
            // font to display the menu items
            this.font = new me.BitmapFont("32x32_font", 32);
            this.font.set("left");
 
            // set the scroller
            this.scrollerfont = new me.BitmapFont("32x32_font", 32);
            this.scrollerfont.set("left");
 
        }
 
        // reset to default value
        this.scrollerpos = 640;
 
        // a tween to animate the arrow
        this.scrollertween = new me.Tween(this).to({
            scrollerpos: -2200
        }, 10000).onComplete(this.scrollover.bind(this)).start();
 
        // enable the keyboard
        me.input.bindKey(me.input.KEY.ENTER, "enter", true);
 
        // play something
        // me.audio.play("cling");
 
    },
 
    // some callback for the tween objects
    scrollover: function() {
        // reset to default value
        this.scrollerpos = 640;
        this.scrollertween.to({
            scrollerpos: -2200
        }, 10000).onComplete(this.scrollover.bind(this)).start();
    },
 
    // update function
    update: function() {
        // enter pressed ?
        if (me.input.isKeyPressed('enter')) {
            me.state.change(me.state.PLAY);
        }
        return true;
    },
 
    // draw function
    draw: function(context) {
        context.drawImage(this.title, 0, 0);
 
        this.font.draw(context, "PRESS ENTER TO PLAY", 20, 240);
        this.scrollerfont.draw(context, this.scroller, this.scrollerpos, 440);
    },
 
    // destroy function
    onDestroyEvent: function() {
        me.input.unbindKey(me.input.KEY.ENTER);
 
        //just in case
        this.scrollertween.stop();
    }
 
});