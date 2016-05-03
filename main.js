window.addEventListener("load",function() {

    var lvl1 = null;


    var Q = Quintus({ development: true, imagePath: "img/" })
        .include("Sprites, Anim, Scenes, Input, 2D, Touch, UI")
        .setup(document.getElementById('gameCanvas'))
        .controls()
        .touch();

    Q.animations('player', {
        run_right: { frames: [0,1,2,3,4,5,6,7,8,9,10,11], rate: 1/12 }, 
        run_left: { frames: [12,13,14,15,16,17,18,19,20,21,22,23], rate: 1/12 },
        stand_right: { frames: [5,5], rate: 1/2 },
        stand_left: { frames: [12,12], rate: 1/2 }
    });    

    Q.Sprite.extend("Player",{
        init: function(p) {
            this._super(p, { sheet: "player", sprite: "player", x: 410, y: 90 });
            this.add('2d, platformerControls, animation');
    
            this.on("hit.sprite",function(collision) {
                if(collision.obj.isA("Tower")) {
                    Q.stageScene("endGame", 1, { label: "You Won!" });
                    this.destroy();
                }
            }); 
        },
        step: function(dt) {
            if(this.p.vx > 0) {
                this.play("run_right");
            } 
            else if(this.p.vx < 0) {
                this.play("run_left");
            } else {
                this.play("stand_right");
            }
        }
    });

    Q.Sprite.extend("Tower", {
        init: function(p) {
            this._super(p, { sheet: 'tower' });
        }
    });

    Q.Sprite.extend("Enemy", {
        init: function(p) {
            this._super(p, { sheet: 'enemy', vx: 100 });
            this.add('2d, aiBounce');
    
            this.on("bump.left, bump.right, bump.bottom", function(collision) {
                if(collision.obj.isA("Player")) {
                    Q.stageScene("endGame", 1, { label: "You Died" }); 
                    collision.obj.destroy();
                }
            });

            this.on("bump.top", function(collision) {
                if(collision.obj.isA("Player")) {
                    this.destroy();
                    collision.obj.p.vy = -300;
                }
            });
        }
    });

    Q.scene("splashscreen", function(stage) {
        var label = stage.insert(new Q.UI.Text({ x: Q.width/2, y: Q.height/2, label: "JUMP & RUN" }));
    });

    var viewport = null;
    Q.scene("level1", function(stage) {
        stage.collisionLayer(new Q.TileLayer({ dataAsset: stage.options.dataAsset, sheet: 'tiles' }));
        var player = stage.insert(new Q.Player());
        viewport = stage.add("viewport").follow(player); 

        stage.insert(new Q.Enemy({ x: 700, y: 0 }));
        stage.insert(new Q.Enemy({ x: 800, y: 0 }));
        stage.insert(new Q.Enemy({ x: 900, y: 0 }));
  
        stage.insert(new Q.Tower({ x: 180, y: 58 }));
    });


    Q.scene("level2", function(stage) {
        stage.collisionLayer(new Q.TileLayer({ dataAsset: stage.options.dataAsset, sheet: 'tiles' }));
        var player = stage.insert(new Q.Player());
        stage.add("viewport").follow(player);

        stage.insert(new Q.Enemy({ x: 700, y: 0 }));
        stage.insert(new Q.Enemy({ x: 800, y: 0 }));
  
        stage.insert(new Q.Tower({ x: 180, y: 50 }));
    });


    Q.scene('hud', function(stage) {
        var label = stage.insert(new Q.UI.Text({ x: 45, y: 20, label: "SCORE: 0", size: 14 }));
    });

    // Q.scene('stopSound', function(stage) {
    //     var button = stage.insert(new Q.UI.Button({ x: 720, y: 320, fill: "#CCCCCC", label: "stop musik"})); 
    //     button.on("click",function(){
    //         Q.audio.stop();
    //     });
    // }); 

    Q.scene('endGame',function(stage) {
        var box = stage.insert(new Q.UI.Container({ x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0.5)" }));
  
        var button = box.insert(new Q.UI.Button({ x: 0, y: 0, fill: "#CCCCCC", label: "Play Again" }));
        button.className = 'canvasButton';

        var label = box.insert(new Q.UI.Text({ x: 10, y: -10 - button.p.h, label: stage.options.label }));

        lvl1.viewport.scale = 2;

        button.on("click",function() {
            Q.clearStages();
            Q.stageScene('level1', 0, { dataAsset: "level1.json" });
        });
        box.fit(20);
    });

    Q.load(["sprites.png", "sprites.json", "level1.json", "level2.json", "tiles.png", "fighter.png", "fighter.json"], function() {
        Q.sheet( "tiles", "tiles.png", { tilew: 32, tileh: 32 });

        Q.compileSheets("fighter.png", "fighter.json");
        Q.compileSheets("sprites.png", "sprites.json");
        

        // Q.stageScene("splashscreen", 6);
        lvl1 = Q.stageScene("level1", 0 , { dataAsset: "level1.json"});
        Q.stageScene("hud", 1);
        // Q.stageScene("stopSound", 2);
        // Q.audio.play('music.mp3', { loop: true });
    });

});
