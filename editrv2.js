// Abandon hope, all ye who enter here

function init() {
    createHiDPICanvas = function () {
        let cv = document.createElement("canvas");
        cv.width = window.innerWidth;
        cv.height = window.innerHeight;
        cv.style.width = window.innerWidth + "px";
        cv.style.height = window.innerHeight + "px";
        cv.id = "editrCanvas";
        return cv;
    }

    readjustCanvas = function (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.width = window.innerWidth + "px";
        canvas.style.height = window.innerHeight + "px";
        game.set_viewport(canvas.width, canvas.height);
    }

    generateBlockSelectors = function () {
        var tileBar = document.querySelector("#tileSelectBar");
        var order = [2, 6, 1, 23, 24, 5, 4, 13, 17, 18, 9, 3, 12, 15, 14, 10, 11, 20, 16, 8];
        var keys = [];

        order.forEach(orderNum => {
            keys.push(window.map.keys[orderNum])
        })

        keys.forEach(tile => {
            if (tile.blockname) {
                if (tile.img) {
                    var base64img = tile.img.src;
                    var htmlImg = `
                    <img src="{src}" class="tileOption unselected" onmouseover="tooltip('{tilename}', this);" onclick="select({id}, this);" onmouseleave="untooltip(this);" id="selectBlock{id}">
                    `.replace("{src}", base64img).replace("{id}", tile.id).replace("{id}", tile.id).replace("{tilename}", tile.blockname);
                    tileBar.innerHTML = tileBar.innerHTML + htmlImg;
                } else {
                    return;
                }
            }
        });
    }

    //Create canvas with the device resolution.
    var canvas = createHiDPICanvas();
    ctx = canvas.getContext('2d');

    document.body.appendChild(canvas);

    generateBlockSelectors();

    window.game = new Clarity();
    game.set_viewport(canvas.width, canvas.height);
    game.load_map(window.map);

    // User controls the viewport with WASD. Viewport shan't be limited.
    game.limit_viewport = false;

    canvas.addEventListener('mousemove', function (evt) {
        game.update_mouse(canvas, evt);
    }, false);

    canvas.addEventListener('mousedown', function (evt) {
        game.onClick(evt);
    });

    canvas.addEventListener('mouseup', function (evt) {
        game.onReleaseClick(evt);
    });

    window.addEventListener('resize', function () {
        readjustCanvas(canvas);
    }, false);


    var Loop = function () {
        ctx.fillStyle = '#111';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // Draw the game
        game.update();
        game.draw(ctx);
    };

    window.renderInterval = setInterval(Loop, 16.7);
}

init();