// startup vars
var trappHeight = 950,
    trappWidth = 1102,
    trimages = [],
    trloader,
    backBranch,
    topShields,
    newt,
    background = new createjs.Container();


// wrapper
window.TRViewer = {};

//trloader
(function(){

    var allData, mapItems, dataload, srcItems;

    function Loader() {

    }

    Loader.prototype.loadData = function() {

        var storygroupid = document.getElementById("canvasPhylogeneticTree").getAttribute("data-haplogroup-id");

        $.getJSON('https://api.moffpart.com/api/1/results/getHaplogroup?q={"storygroupid":"'+ storygroupid +'"}&c=c2TreeData&callback=?', function(ret) {

            mapItems = ret[0].mapItems;
            srcItems = ret[0].srcItems;



            var manifest = [
                {src:srcItems.newt, id:"image1"},
                {src:srcItems.backBranch, id:"image2"},
                {src:srcItems.topShields, id:"image3"}
            ];

            trloader = new createjs.LoadQueue(false);
            trloader.addEventListener("fileload", handleFileLoad);
            trloader.addEventListener("complete", handleComplete);
            trloader.loadManifest(manifest);

            function handleFileLoad(event) {
                trimages.push(event.item);
            }

            function handleComplete(event) {

                if (event.currentTarget._numItemsLoaded === 3){

                    parseData();
                }
            }
        });

        // preloader graphics
        var prossElement = document.createElement('div'),
            dialogElement = document.createElement('div'),
            spinElement = document.createElement('div'),
            paraElement = document.createElement('p'),
            textItem = document.createTextNode("Loading treeItems…");

        prossElement.setAttribute('id', "Processing");
        prossElement.setAttribute('Style', "height:" + trappHeight + "px; width:" + trappWidth + "px;");
        dialogElement.setAttribute('class','dialog');
        spinElement.setAttribute('class','spinner-container');

        paraElement.appendChild(textItem);
        dialogElement.appendChild(paraElement);
        dialogElement.appendChild(spinElement);
        prossElement.appendChild(dialogElement);
        document.getElementById("canvasPhylogeneticTree").appendChild(prossElement);
        $('#Processing').show();
    };

    function parseData() {

        newt = new createjs.Bitmap(trimages[0].src);
        backBranch = new createjs.Bitmap(trimages[1].src);
        topShields = new createjs.Bitmap(trimages[2].src);

        background.addChild(backBranch);
        background.addChild(newt);
        background.addChild(topShields);

        dataload = true;
    }

    Loader.prototype.loadStatus = function() {

        return dataload
    };

    Loader.prototype.returnData = function() {

        allData = {
            mapItems:mapItems
        };
        return allData
    };

    TRViewer.Loader = Loader;

})();

// artboard
(function(){

    // data
    var keyItems, interactionObject;

    // zoom params
    var zoomRatio, xReg, yReg, xpos, ypos;

    // draw


    function Artboard(){

        interactionObject = {
            state:"inactive",
            data:"Nil"
        };

    }

    Artboard.prototype.dataLoad = function (data){

        zoomRatio = data.mapItems.zoomInit;
        xReg = data.mapItems.xReg;
        yReg = data.mapItems.yReg;



        //newt = trloader.getResult("image1");
    };

    Artboard.prototype.zoom = function (user){

        zoomRatio = user.zoomValue;
        xpos = user.mapX;
        ypos = user.mapY;
        xReg = user.xReg;
        yReg = user.yReg;
    };

    Artboard.prototype.background = function (displayObject){

        // area to add stuff ----->



        // <------ area to add stuff

        displayObject.updateCache("source-overlay");
    };

    Artboard.prototype.redraw = function (displayObject){

        // area to add stuff ----->

        background.x = xpos + trappWidth/2;
        background.y = ypos + trappHeight/2;
        background.regX = xReg + trappWidth/2;
        background.regY = yReg + trappHeight/2;
        background.scaleX = background.scaleY = zoomRatio;
        displayObject.addChild(background);



        // <------ area to add stuff
    };

    Artboard.prototype.eventlayer = function (displayObject){

        // area to add stuff ----->

        // <------ area to add stuff

        displayObject.updateCache("source-overlay");
    };

    Artboard.prototype.interaction = function(){

        return interactionObject
    };

    Artboard.prototype.resetInteraction = function(){

        interactionObject.state = 0;
        interactionObject.data = "Nil";
    };

    TRViewer.Artboard = Artboard;

})();

// dashboard
(function(){

    var user, zoomSliderY = 140, zoomInit;

    function Dashboard() {

        user = {
            zoomValue:1,
            mapX:0,
            mapY:0,
            xReg:0,
            yReg:0
        };
    }

    Dashboard.prototype.controlData = function(data) {

        zoomInit = user.zoomValue = data.mapItems.zoomInit;
        user.xReg = data.mapItems.xReg;
        user.yReg = data.mapItems.yReg;
    };

    Dashboard.prototype.background = function(displayObject) {

        // area to add stuff ----->

        var sliderContainer = new createjs.Container();
        displayObject.addChild(sliderContainer);

        var sliderShape = new createjs.Shape();
        sliderShape.graphics.setStrokeStyle(1).beginStroke("#FFF").drawRect(trappWidth - 54,25,38,218);
        sliderShape.graphics.beginStroke("#BBB").beginFill("#FFF").drawRect(trappWidth - 58,21,46,226);
        sliderShape.alpha = 0.5;
        sliderContainer.addChild(sliderShape);

        var zoomText = new createjs.Text("zoom","13px Petrona","#444");
        zoomText.x = trappWidth -50;
        zoomText.y = 24;
        sliderContainer.addChild(zoomText);

        var zoomSliderbase = new createjs.Shape();
        zoomSliderbase.graphics.beginFill("#A6A6A6").drawRoundRect(trappWidth - 40,40,9,200,9);
        zoomSliderbase.graphics.beginLinearGradientFill(["#CCC","#FFF"], [0,.3], trappWidth - 40, 40, trappWidth - 20, 40).drawRoundRect(trappWidth - 38,42,5,196,9);
        sliderContainer.addChild(zoomSliderbase);

        // <------ area to add stuff

        displayObject.updateCache("source-overlay");
    };

    Dashboard.prototype.redraw = function(displayObject) {

        // area to add stuff ----->

        var sliderContainer = new createjs.Container();
        displayObject.addChild(sliderContainer);

        // zoom slider
        var zoomSlider = new createjs.Container();
        zoomSlider.x = 0.5;
        zoomSlider.y = 0.5;
        sliderContainer.addChild(zoomSlider);

        var zoomSliderGrip = new createjs.Shape();
        zoomSliderGrip.graphics.beginLinearGradientFill(["#575756","#878787"], [0,.8], trappWidth - 24, zoomSliderY-20, trappWidth - 44, zoomSliderY).drawCircle(trappWidth - 35.5,zoomSliderY,10);
        zoomSliderGrip.shadow = new createjs.Shadow("#aaa", 1, 1, 3);
        zoomSlider.addChild(zoomSliderGrip);

        var lowLimit = 52,
            highLimit = 228;

        zoomSlider.on("pressmove", function(evt) {
            if (evt.stageY > lowLimit && evt.stageY < highLimit) {

                zoomSliderY = evt.stageY;
                user.zoomValue = evt.stageY/140*zoomInit;

            }
        });

        // <------ area to add stuff
    };

    Dashboard.prototype.eventlayer = function (displayObject){

        // area to add stuff ----->

        // pan base
        var panSliderbase = new createjs.Shape();
        //panSliderbase.graphics.beginFill("#A6A6A6");
        //panSliderbase.graphics.drawRect(0,0,6958,3430);
        panSliderbase.regX = user.xReg;
        panSliderbase.regY = user.yReg;
        panSliderbase.hitArea = new createjs.Shape(new createjs.Graphics().beginFill("#E78038").drawRect(-1000,-1000,10890,10035));
        //panSliderbase.alpha = 0.5;
        displayObject.addChild(panSliderbase);

        var xdif, ydif, o;

        panSliderbase.on("mousedown", function(evt) {

            o = evt.target;
            o.offset = {x:o.x-evt.stageX, y:o.y-evt.stageY};

        });

        panSliderbase.on("pressmove", function(evt) {

            user.mapX = evt.stageX + o.offset.x;
            user.mapY = evt.stageY + o.offset.y;
            panSliderbase.x = evt.stageX + o.offset.x;
            panSliderbase.y = evt.stageY + o.offset.y;
            //user.xReg = evt.stageX + o.offset.x;
            //user.yReg = evt.stageY+ o.offset.y;

        });

        // <------ area to add stuff

        displayObject.updateCache("source-overlay");

    };

    Dashboard.prototype.userFeedback = function() {

        return user;
    };

    TRViewer.Dashboard = Dashboard;

})();


// renderer
(function(){

    var stats, canvas, stage, view, control, highlight,
        artboard, artboardBackground, artboardRedraw, artboardEventArea,
        dashboardRedraw, dashboardBackground, dashboardEventArea,
        highlightBackground, highlightRedraw, highlightEventArea,
        loader, loadStatus;

    TRViewer.loadInit = function(){

        //stats = new Stats();
        //$('.block').prepend(stats.domElement);

        // prepare the view
        view = new TRViewer.Artboard(trappWidth,trappHeight);

        // prepare the dashboard
        control = new TRViewer.Dashboard();

        // trloader init
        loader = new TRViewer.Loader();
        loadStatus = false;
        loader.loadData();

        TweenMax.ticker.addEventListener("tick", loadRequest);
    };

    function init() {

        // prepare our canvas
        canvas = document.createElement( 'canvas' );
        canvas.width = trappWidth;
        canvas.height = trappHeight;
        document.getElementById("canvasPhylogeneticTree").appendChild(canvas);

        stage = new createjs.Stage(canvas);
        stage.enableMouseOver(10);

        // artboard
        artboard = new createjs.Container();
        //artboard.y = 20;
        stage.addChild(artboard);

        artboardBackground = new createjs.Container();
        artboardBackground.cache(0, 0, trappWidth, trappHeight);
        artboard.addChild(artboardBackground);
        view.background(artboardBackground);

        artboardRedraw = new createjs.Container();
        artboard.addChild(artboardRedraw);

        artboardEventArea = new createjs.Container();
        artboardEventArea.cache(0, 0, trappWidth, trappHeight);
        artboard.addChild(artboardEventArea);
        view.eventlayer(artboardEventArea);

        // dashboard
        dashboardBackground = new createjs.Container();
        dashboardBackground.cache(0, 0, trappWidth, trappHeight);
        stage.addChild(dashboardBackground);
        control.background(dashboardBackground);

        dashboardEventArea = new createjs.Container();
        dashboardEventArea.cache(0, 0, trappWidth, trappHeight);
        stage.addChild(dashboardEventArea);
        control.eventlayer(dashboardEventArea);

        dashboardRedraw  = new createjs.Container();
        stage.addChild(dashboardRedraw);

        TweenMax.ticker.addEventListener("tick", frameRender);

    }

    function loadRequest(event) {

        var loadFinished = loader.loadStatus();
        if (loadFinished) {
            loadStatus = true;
            var data = loader.returnData();
            view.dataLoad(data);
            control.controlData(data);
            removeLoader()
        }
    }

    function removeLoader() {

        $('#Processing').remove();
        TweenMax.ticker.removeEventListener("tick", loadRequest);
        init();
    }

    function frameRender(event) {

        //stats.begin();

        artboardRedraw.removeAllChildren();
        dashboardRedraw.removeAllChildren();

        view.redraw(artboardRedraw);
        control.redraw(dashboardRedraw);

        var viewData = view.interaction();

        view.zoom(control.userFeedback());

        // update stage
        stage.update();

        //stats.end();
    }

})();

//Init
TRViewer.loadInit();

// utils

//sorts array by key
function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var
            x = a[key],
            y = b[key];
        return ((x > y) ? -1 : ((x < y) ? 1 : 0));
    });
}
