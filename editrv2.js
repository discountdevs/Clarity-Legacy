function init() {
    createHiDPICanvas = function() {
        let cv = document.createElement("canvas");
        cv.width = window.innerWidth;
        cv.height = window.innerHeight;
        cv.style.width = window.innerWidth + "px";
        cv.style.height = window.innerHeight + "px";
        cv.id = "editrCanvas";
        return cv;
    }

    readjustCanvas = function() {
        // TODO: write function
    }
    
    //Create canvas with the device resolution.
    var canvas = createHiDPICanvas();
        ctx    = canvas.getContext('2d');

    document.body.appendChild(canvas);

    window.game = new Clarity();
    game.set_viewport(canvas.width, canvas.height);
    game.load_map(window.map);

    // User controls the viewport with WASD. Viewport shouldn't be limited.
    game.limit_viewport = false;

    canvas.addEventListener('mousemove', function(evt) {
        game.update_mouse(canvas, evt);
    }, false);

    canvas.addEventListener('mousedown', function(evt) {
        game.onClick(evt);
    });

    canvas.addEventListener('mouseup', function(evt) {
        game.onReleaseClick(evt);
    });

    

    var Loop = function() {

        ctx.fillStyle = '#111';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        game.update();
        game.draw(ctx);
        
        // window.requestAnimFrame(Loop);

    };

    var interval = setInterval(Loop, 16.7);
}

init();