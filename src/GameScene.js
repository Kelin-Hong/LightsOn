/**
 * Created by kelin on 14-8-12.
 */
var layers = {};
var FAIL_UI_SIZE = cc.size(292, 277);
var SCORE = 0;
var OFFSET_X = 4,
    OFFSET_Y = 32,
    ROW = COL = 9,
    BLOCK_W = 32,
    BLOCK_H = 32,
    BLOCK_XREGION = 33,
    BLOCK_YREGION = 33,
    BLOCK1_RECT = cc.rect(0, 0, BLOCK_W, BLOCK_H),
    BLOCK2_RECT = cc.rect(BLOCK_W, 0, BLOCK_W, BLOCK_H);
var around_x = [0, 0, 1, 0, -1], around_y = [0, 1, 0, -1, 0];
var GameLayer = cc.Layer.extend({
    scoreLabel: null,
    desLabel: null,
    block_tex: null,
    score: 0,
    active_blocks: null,
    titleLable: null,
    timeLabel: null,
    time: 30,
    ctor: function () {
        this._super();
        this.active_blocks = [];
        for (var r = 0; r < ROW; r++) {
            this.active_blocks.push([]);
            for (var c = 0; c < COL; c++) {
                this.active_blocks[r][c] = false;
            }
        }
        var bgScore = new cc.Sprite(res.bg_score);
        bgScore.setAnchorPoint(cc.p(1, 1));
        bgScore.setPosition(cc.p(cc.winSize.width - 5, cc.winSize.height - 5));
        this.addChild(bgScore);
        this.scoreLabel = cc.LabelTTF.create("0", "Arial", 15);
        this.scoreLabel.setAnchorPoint(cc.p(1, 1));
        this.scoreLabel.setPosition(cc.winSize.width - bgScore.width / 4 + 3, cc.winSize.height - bgScore.height / 2 - 2);
        this.addChild(this.scoreLabel);
        this.timeLabel = cc.LabelTTF.create("30", "Arial", 15);
        this.timeLabel.setAnchorPoint(cc.p(0.5, 1));
        this.timeLabel.setPosition(cc.winSize.width - bgScore.width / 4 * 3 + 2, cc.winSize.height - bgScore.height / 2 - 2);
        this.addChild(this.timeLabel);
        this.desLabel = cc.LabelTTF.create("SB指数测试", "Arial", 30);
        this.desLabel.setAnchorPoint(cc.p(0, 1));
        this.desLabel.setPosition(cc.p(12, cc.winSize.height - 10));
        this.addChild(this.desLabel);
        this.titleLable = cc.LabelTTF.create("30秒益智,找规律得最多黄卡片", "Arial", 12);
//        this.titleLable = cc.LabelTTF.create("find rule get more yellow cards!", "Arial", 12);
        this.titleLable.setAnchorPoint(cc.p(0, 0));
        this.titleLable.setPosition(cc.p(12, cc.winSize.height - bgScore.height + 10));
        this.addChild(this.titleLable);

        var deszhLable = cc.LabelTTF.create("点击翻动卡片，30秒内找出规律获取尽可能多\n的黄色卡片！分享可以获取翻动策略哦！", "Arial", 15);
        deszhLable.setAnchorPoint(cc.p(0, 0));
        deszhLable.setPosition(cc.p(12, 10));
        this.addChild(deszhLable);
        this.blocks = new cc.Layer();
        this.blocks.setAnchorPoint(cc.p(0, 0));
        OFFSET_X = (cc.winSize.width - 9 * BLOCK_XREGION) / 2;
        OFFSET_Y = cc.winSize.height - 9 * BLOCK_YREGION - bgScore.height - 10;
        this.blocks.setPosition(cc.p(OFFSET_X, OFFSET_Y));

        this.addChild(this.blocks);

        this.batch = new cc.SpriteBatchNode(res.block, 81);
        this.block_tex = this.batch.texture;
        var ox = x = y = 0, block, tex = this.batch.texture;
        for (var r = 0; r < ROW; r++) {
            y = BLOCK_YREGION * r;
            for (var c = 0; c < COL; c++) {
                x = BLOCK_XREGION * c;
                block = new cc.Sprite(tex, BLOCK2_RECT);
                block.attr({
                    anchorX: 0,
                    anchorY: 0,
                    x: x,
                    y: y,
                    width: BLOCK_W,
                    height: BLOCK_H
                });
                this.batch.addChild(block);
            }

        }
        this.blocks.addChild(this.batch);
//        this.blocks.bake();
        this.randomBlocks();
        this.schedule(this.step)
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ALL_AT_ONCE,
            onTouchesBegan: function (touches, event) {
                var touch = touches[0];
                var pos = touch.getLocation();
                var target = event.getCurrentTarget();


                pos.y -= OFFSET_Y;
                var r = Math.floor(pos.y / BLOCK_YREGION);
                pos.x -= OFFSET_X;
                var c = Math.floor(pos.x / BLOCK_XREGION);
                for (var i = 0; i < 5; i++) {
                    c = Math.floor(pos.x / BLOCK_XREGION) + around_x[i];
                    r = Math.floor(pos.y / BLOCK_YREGION) + around_y[i];
                    if (c >= 0 && r >= 0 && c < COL && r < ROW) {
                        target.activateBlock(r, c);
                    }
                }
            }
        }, this);
    },
    step: function (dt) {
        this.time -= dt;
//        SCORE = layers.game.score;
        if (this.time <= 0) {
            this.unschedule(this.step);
            layers.game.removeFromParent();
            //gameScene.addChild(layers.ad);
            gameScene.addChild(layers.result, 100);
        }
        var string = this.time.toFixed(1);
        this.timeLabel.setString(string);
    },
    randomBlocks: function () {
        var nb = Math.round(cc.random0To1() * 43) + 7, r, c;
        for (var i = 0; i < nb; i++) {
            r = Math.floor(cc.random0To1() * 9);
            c = Math.floor(cc.random0To1() * 9);
            this.activateBlock(r, c);
        }
    },

    activateBlock: function (r, c) {
        if (!this.active_blocks[r][c]) {
            var block = new cc.Sprite(this.block_tex, BLOCK1_RECT);
            block.attr({
                anchorX: 0,
                anchorY: 0,
                x: BLOCK_XREGION * c,
                y: BLOCK_YREGION * r,
                width: BLOCK_W,
                height: BLOCK_H
            });
            this.blocks.addChild(block, 2);
            this.active_blocks[r][c] = true;
            this.score++;
            this.scoreLabel.setString(this.score + "");
            SCORE=this.score;
            return true;
        } else {
            var block = new cc.Sprite(this.block_tex, BLOCK2_RECT);
            block.attr({
                anchorX: 0,
                anchorY: 0,
                x: BLOCK_XREGION * c,
                y: BLOCK_YREGION * r,
                width: BLOCK_W,
                height: BLOCK_H
            });

            this.blocks.addChild(block, 2);
            this.active_blocks[r][c] = false;
            this.score--;
            SCORE=this.score;
            this.scoreLabel.setString(this.score + "");
            return true;
        }
        return false;
    }
});
var ADUI = cc.Layer.extend({
    ctor: function () {
        this._super();
        var spriteNormal = new cc.Sprite(res.ad3);
        var button = cc.MenuItemSprite.create(spriteNormal, null, null, function () {
            //location.href = "http://s.click.taobao.com/t?e=m%3D2%26s%3DaTGOcB5I%2B%2BgcQipKwQzePOeEDrYVVa64K7Vc7tFgwiFRAdhuF14FMdM%2B03m3Miqclovu%2FCElQOty8%2Bbev%2Fkb%2FHk7L6D0ScP2DJRmYi2JQkzGSLYTWACJsHO57C5lEv7EoN9VT49nZyyoiC3%2Bl1xAQMIThG%2FzS7WjoDXLZgGh%2FjY%3D#mp.weixin.qq.com";
        }, this);

        var menuAd1 = cc.Menu.create(button);
        menuAd1.setPosition(cc.winSize.width / 2, button.height / 2);

        this.addChild(menuAd1);
//        var spriteNormal2 = new cc.Sprite(res.ad2);
//        var button2 = cc.MenuItemSprite.create(spriteNormal2, null, null, function () {
//
//            location.href = "http://s.click.taobao.com/t?e=m%3D2%26s%3DJmIU2OOxILAcQipKwQzePOeEDrYVVa64K7Vc7tFgwiFRAdhuF14FMQ21jExKqCZP79%2FTFaMDK6Ry8%2Bbev%2Fkb%2FHk7L6D0ScP2ydyv7UOfADX9x%2FGuFW%2BpRrtstuyVMHvdHiRf3rrkFW%2FBaoglbMAJbOishmjSCAZu2RvcjGI%2F%2Bvs%3D#mp.weixin.qq.com";
//        }, this);
//
//        var menuAd2 = cc.Menu.create(button2);
//        menuAd2.setPosition(cc.winSize.width / 2, cc.winSize.height - button2.height / 2);

        //this.addChild(menuAd1);
//        this.addChild(menuAd2);
    }


})
;
var ShareUI = cc.LayerColor.extend({
    ctor: function () {
        this._super(cc.color(0, 0, 0, 188), cc.winSize.width, cc.winSize.height);

        var arrow = new cc.Sprite(res.arrow);
        arrow.anchorX = 1;
        arrow.anchorY = 1;
        arrow.x = cc.winSize.width - 15;
        arrow.y = cc.winSize.height - 5;
        this.addChild(arrow);

        var label = new cc.LabelTTF("请点击右上角的菜单按钮\n再点\"分享到朋友圈\"\n让好友们挑战你的SB指数！", "宋体", 20, cc.size(cc.winSize.width * 0.7, 250), cc.TEXT_ALIGNMENT_CENTER);
        label.x = cc.winSize.width / 2;
        label.y = cc.winSize.height - 100;
        label.anchorY = 1;
        this.addChild(label);
    },
    onEnter: function () {
        this._super();
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: function (touch, event) {
                layers.shareUI.removeFromParent();
            }
        }, this);
    }
});

var ResultUI = cc.Layer.extend({
    activate: false,
    win: false,
    winPanel: null,
    losePanel: null,
    ctor: function (win) {
        this._super();

        this.win = win;
        if (win) {
            this.winPanel = new cc.Sprite(res.succeed);
            this.winPanel.x = cc.winSize.width / 2;
            this.winPanel.anchorY = 0.2;
            this.winPanel.y = cc.winSize.height / 2;
            this.addChild(this.winPanel);
        }
        else {
            this.losePanel = new cc.Sprite(res.failed);
            this.losePanel.x = cc.winSize.width / 2;
            this.losePanel.anchorY = 0.2;
            this.losePanel.y = cc.winSize.height / 2 ;
            this.addChild(this.losePanel);
        }

        var notify = new cc.Sprite(res.notify);
        notify.anchorX = notify.anchorY = 0;
        notify.x = cc.winSize.width / 2 - FAIL_UI_SIZE.width / 2;
        notify.y = cc.winSize.height / 2 - FAIL_UI_SIZE.height / 2 ;
        this.addChild(notify);

        var replay = new cc.Sprite(res.replay);
        replay.anchorX = 1;
        replay.anchorY = 0;
        replay.x = cc.winSize.width / 2 + FAIL_UI_SIZE.width / 2;
        replay.y = cc.winSize.height / 2 - FAIL_UI_SIZE.height / 2 ;
        this.addChild(replay);

//        var more = new cc.Sprite(res.more);
//        more.anchorY = 0;
//        more.x = cc.winSize.width/2;
//        more.y = 0;
//        this.addChild(more);
    },
    onEnter: function () {
        this._super();
        var miny = cc.winSize.height / 2 - FAIL_UI_SIZE.height / 2;

//        var step = layers.game.step, percent;
//        if (step < 4) percent = 99;
//        else if (step < 10) percent = Math.round(95 + 4 * (10-step)/6);
//        else if (step < 20) percent = Math.round(85 + 10 * (20-step)/10);
//        else percent = 95 - step/2;
        var percent = 90;
        if (this.win) {
            this.winPanel.removeAllChildren();

            var w = this.winPanel.width, h = this.winPanel.height;
            var label = new cc.LabelTTF("继续刷屏！\n" + "你让超哥滚了" + "100米！\n打败" + percent + "%朋友圈的人！\n你能超过我吗？", "宋体", 20);
            label.x = w / 2;
            label.y = h / 4;
            label.textAlign = cc.LabelTTF.TEXT_ALIGNMENT_CENTER;
            //label.boundingWidth = w;
            label.width = w;
            label.color = cc.color(0, 0, 0);
            this.winPanel.addChild(label);
        }
        else {
            this.losePanel.removeAllChildren();
            var w = this.losePanel.width, h = this.losePanel.height;
            label = new cc.LabelTTF("一共翻得到了" + SCORE + "张黄色卡片\n" + "SB指数是" + (70 - SCORE) + " 据说翻不到70\n张以上的都是S..，你敢公布\n你玩了几次才这个分吗？", "宋体", 20);
            label.x = w / 2;
            label.y = h / 4 + 5;
            label.textAlign = cc.LabelTTF.TEXT_ALIGNMENT_CENTER;
            //label.boundingWidth = w;
            label.width = w;
            label.color = cc.color(0, 0, 0);
            this.losePanel.addChild(label, 10);
        }

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget();
                if (!target.activate) return;
                var pos = touch.getLocation();
                if (pos.y > miny && pos.y < miny + 60) {
                    if (pos.x > cc.winSize.width / 2) {
                        //layers.game.initGame();
                        layers.game = new GameLayer();
                        layers.result.removeFromParent();
                        //layers.ad.removeFromParent();
                        gameScene.addChild(layers.game);
                        //target.win ? layers.winUI.removeFromParent() : layers.loseUI.removeFromParent();
                    }
                    else {

                        gameScene.addChild(layers.shareUI, 100);

                    }
                }
            }
        }, this);

        this.activate = true;
    },
    onExit: function () {
        this._super();
        this.activate = false;
    }
});


var GameScene = cc.Scene.extend({
    onEnter: function () {
//        if(!this.isWeiXin()&&cc.sys.isMobile){
//            location.href = "http://s.click.taobao.com/t?e=m%3D2%26s%3DC5k4xXRHPGYcQipKwQzePOeEDrYVVa64K7Vc7tFgwiFRAdhuF14FMRGCPazdHKuc79%2FTFaMDK6Ry8%2Bbev%2Fkb%2FHk7L6D0ScP2DJRmYi2JQkzGSLYTWACJsHO57C5lEv7EoN9VT49nZyyoiC3%2Bl1xAQMIThG%2FzS7WjoDXLZgGh%2FjY%3D";
////            location.href = "http://s.click.taobao.com/t?e=m%3D2%26s%3DaTGOcB5I%2B%2BgcQipKwQzePOeEDrYVVa64K7Vc7tFgwiFRAdhuF14FMdM%2B03m3Miqclovu%2FCElQOty8%2Bbev%2Fkb%2FHk7L6D0ScP2DJRmYi2JQkzGSLYTWACJsHO57C5lEv7EoN9VT49nZyyoiC3%2Bl1xAQMIThG%2FzS7WjoDXLZgGh%2FjY%3D";
////                             http://s.click.taobao.com/t?e=m%3D2%26s%3Dw7bu5PbbehocQipKwQzePOeEDrYVVa64K7Vc7tFgwiFRAdhuF14FMcHHXOcBLSP4xq3IhSJN6GRy8%2Bbev%2Fkb%2FHk7L6D0ScP2DJRmYi2JQkzGSLYTWACJsHO57C5lEv7EoN9VT49nZyyoiC3%2Bl1xAQMIThG%2FzS7WjoDXLZgGh%2FjY%3D
//            return;
//        }
        this._super();
        var bg = new cc.Sprite(res.bg);
        bg.attr({
            anchorX: 0.5,
            anchorY: 0.5,
            x: cc.winSize.width / 2,
            y: cc.winSize.height / 2
        });
        this.addChild(bg);
        layers.game = new GameLayer();
//        var scroll_card = cc.ScrollView.create(cc.size(cc.winSize.width, 300), layers.game);
//        scroll_card.setContentSize(cc.size(cc.winSize.width,1200));
//        scroll_card.setPosition(cc.p(0,0));
//        //scroll_card.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
////        scroll_card.setVisible(true);
//        scroll_card.setBounceable(false);
//        scroll_card.setDirection(1);
//        scroll_card.setPosition(cc.p(0, 0));
////        scroll_card.setContentOffset(cc.p(150,0) , false);
//        scroll_card.setContentOffset(0,300-1200);
//        this.addChild(scroll_card);
        this.addChild(layers.game);
        layers.shareUI = new ShareUI();
        layers.result = new ResultUI(false);
        //layers.ad = new ADUI();
    },
    isWeiXin:function(){
        var ua = navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == "micromessenger") {
            return true;
        } else {
            return false;
        }
    }
});
var gameScene = null;


