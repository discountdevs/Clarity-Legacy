var Clarity = function () {
    this.start_time = performance.now();

    this.universalSpeed = false;
    this.alert_errors = false;
    this.log_info = true;
    this.tile_size = 16;
    this.limit_viewport = false;
    this.jump_switch = 0;
    this.allowSpecialJump = true;
    this.deathmsgs = false;
    this.checkpoint = false;

    this.selectedTile = 2;
    this.isDrawing = false;
    this.isErasing = false;

    
    this.coinList = [];
    this.coinCount = 0;

    this.viewport = {
      x: 200,
      y: 200
    };
  
    this.camera = {
      x: 0,
      y: 0
    };

    this.mouse = {
      x: 0,
      y: 0
    }
  
    this.key = {
      left: false,
      right: false,
      up: false
    };
  
    this.current_lobby = {};
  
    this.player = {
  
      loc: {
        x: 0,
        y: 0
      },
  
      vel: {
        x: 0,
        y: 0
      },
  
      can_jump: true
    };

    this.cam = {
        loc: {
            x: 0,
            y: 0
        }
    }

    this.viewportControls = {
        up: false,
        down: false,
        left: false,
        right: false
    }
  
    window.onkeydown = this.keydown.bind(this);
    window.onkeyup = this.keyup.bind(this);
  };
  
  Clarity.prototype.handleLobby = function (players) {
    this.current_lobby = players;
  }
  
  Clarity.prototype.error = function (message) {
  
    if (this.alert_errors) alert(message);
    if (this.log_info) console.log(message);
  };
  
  Clarity.prototype.log = function (message) {
  
    if (this.log_info) console.log(message);
  };
  
  Clarity.prototype.set_viewport = function (x, y) {
  
    this.viewport.x = x;
    this.viewport.y = y;
  };
  
  Clarity.prototype.keydown = function (e) {
  
    var _this = this;
  
    switch (e.keyCode) {
      case 37:
        _this.key.left = true;
        break;
      case 38:
        _this.key.up = true;
        break;
      case 39:
        _this.key.right = true;
        break;
      case 87:
        _this.viewportControls.up = true;
        break;
      case 83:
        _this.viewportControls.down = true;
        break;
      case 65:
        _this.viewportControls.left = true;
        break;
      case 68:
        _this.viewportControls.right = true;
        break;  
    }
  };
  
  Clarity.prototype.keyup = function (e) {
  
    var _this = this;
  
    switch (e.keyCode) {
      case 37:
        _this.key.left = false;
        break;
      case 38:
        _this.key.up = false;
        break;
      case 39:
        _this.key.right = false;
        break;
      case 87:
        _this.viewportControls.up = false;
        break;
      case 83:
        _this.viewportControls.down = false;
        break;
      case 65:
        _this.viewportControls.left = false;
        break;
      case 68:
        _this.viewportControls.right = false;
        break;  
    }
  };
  
  Clarity.prototype.load_map = function (map) {
    var oldCamera = this.camera;
    if (typeof map === 'undefined'
      || typeof map.data === 'undefined'
      || typeof map.keys === 'undefined') {
  
      this.error('Error: Invalid map data!');
  
      return false;
    }
  
  
    this.current_map = map;
  
    this.current_map.background = map.background || '#222';
    this.current_map.gravity = map.gravity || { x: 0, y: 0.3 };
  
    var _this = this;
  
    this.current_map.width = 0;
    this.current_map.height = 0;
  
  
    var spawnfound = false;
    var spawnx;
    var spawny;
    map.keys.forEach(function (key) {
  
      map.data.forEach(function (row, y) {
  
        _this.current_map.height = Math.max(_this.current_map.height, y);
        
        Array.prototype.forEach.call(row, function (tile, x) {
          if (tile == 20 || tile.id == 20){
            spawnfound = true;
            spawnx = x;
            spawny = y;
          }
          
          if (tile == 25 || tile.id == 25){
            this.coinList.push([spawnx, spawny])
          }
          
          _this.current_map.width = Math.max(_this.current_map.width, x);
  
          if (tile == key.id)
            _this.current_map.data[y][x] = key;
        });
      });
    });
  
    if (!this.checkpoint){
      if (!spawnfound) {
        this.current_map.player.x = 1
        this.current_map.player.y = 1
      } else {
        this.current_map.player.x = spawnx;
        this.current_map.player.y = spawny;
      }
    }
  
  
    this.current_map.width_p = this.current_map.width * this.tile_size;
    this.current_map.height_p = this.current_map.height * this.tile_size;
  
    this.player.loc.x = map.player.x * this.tile_size || 0;
    this.player.loc.y = map.player.y * this.tile_size || 0;
    this.player.colour = map.player.colour || '#000';
  
    this.player.vel = {
      x: 0,
      y: 0
    };
  
    this.log('Successfully loaded map data.');
    this.start_time = performance.now();
    return true;
  };
  
  
  Clarity.prototype.get_tile = function (x, y) {
  
    return (this.current_map.data[y] && this.current_map.data[y][x]) ? this.current_map.data[y][x] : 0;
  };
  
  Clarity.prototype.draw_tile = function (x, y, tile, context) {
  
    if (!tile || !tile.colour) return;
    if(!tile.img){
      // console.log("no image!")
        context.fillStyle = tile.colour;
    context.fillRect(
      x,
      y,
      this.tile_size,
      this.tile_size
    );
    } else {
      ctx.drawImage(tile.img, x, y, this.tile_size, this.tile_size);
    }
    
  
    // context.fillStyle = tile.colour;
    // context.fillRect(
    //   x,
    //   y,
    //   this.tile_size,
    //   this.tile_size
    // );
  };
  
  Clarity.prototype.draw_map = function (context, fore) {
    for (var y = 0; y < this.current_map.data.length; y++) {
  
      for (var x = 0; x < this.current_map.data[y].length; x++) {
  
        if ((!fore && !this.current_map.data[y][x].fore) || (fore && this.current_map.data[y][x].fore)) {
  
          var t_x = (x * this.tile_size) - this.camera.x;
          var t_y = (y * this.tile_size) - this.camera.y;
  
          if (t_x < -this.tile_size
            || t_y < -this.tile_size
            || t_x > this.viewport.x
            || t_y > this.viewport.y) continue;
  
          this.draw_tile(
            t_x,
            t_y,
            this.current_map.data[y][x],
            context
          );
        }
      }
    }
  
    if (!fore) this.draw_map(context, true);
  };
  
  Clarity.prototype.move_player = function () {
  
    var tX = this.player.loc.x + this.player.vel.x;
    var tY = this.player.loc.y + this.player.vel.y;
  
    var offset = Math.round((this.tile_size / 2) - 1);
  
    var tile = this.get_tile(
      Math.round(this.player.loc.x / this.tile_size),
      Math.round(this.player.loc.y / this.tile_size)
    );
  
    // if (tile.boost && !this.universalSpeed) {
    //   this.current_map.movement_speed.left = 1;
    //   this.current_map.movement_speed.right = 1;
    // } else if(!this.universalSpeed) {
    //   this.current_map.movement_speed =  { jump: 6, left: 0.3, right: 0.3 };
    // } else if(this.universalSpeed){
    //   this.current_map.movement_speed =  { jump: 10, left: 10, right: 10 };
    // }
  
    
    
    if (tile.gravity) {
  
      this.player.vel.x += tile.gravity.x;
      this.player.vel.y += tile.gravity.y;
  
    } else {
  
      this.player.vel.x += this.current_map.gravity.x;
      this.player.vel.y += this.current_map.gravity.y;
    }
  
    if (tile.friction) {
      this.player.vel.x *= tile.friction.x;
      this.player.vel.y *= tile.friction.y;
      this.current_map.vel_limit.x = 15.8;
    } else if (this.detectBelow(17)){
      this.player.vel.x *= 1.10;
      this.current_map.vel_limit.x = 12;
    }
  
  
  
    var t_y_up = Math.floor(tY / this.tile_size);
    var t_y_down = Math.ceil(tY / this.tile_size);
    var y_near1 = Math.round((this.player.loc.y - offset) / this.tile_size);
    var y_near2 = Math.round((this.player.loc.y + offset) / this.tile_size);
  
    var t_x_left = Math.floor(tX / this.tile_size);
    var t_x_right = Math.ceil(tX / this.tile_size);
    var x_near1 = Math.round((this.player.loc.x - offset) / this.tile_size);
    var x_near2 = Math.round((this.player.loc.x + offset) / this.tile_size);
  
    var top1 = this.get_tile(x_near1, t_y_up);
    var top2 = this.get_tile(x_near2, t_y_up);
    var bottom1 = this.get_tile(x_near1, t_y_down);
    var bottom2 = this.get_tile(x_near2, t_y_down);
    var left1 = this.get_tile(t_x_left, y_near1);
    var left2 = this.get_tile(t_x_left, y_near2);
    var right1 = this.get_tile(t_x_right, y_near1);
    var right2 = this.get_tile(t_x_right, y_near2);
  
  
    if (this.detectSides(18).result){
      // make player fall slowly
      this.player.vel.y *= 0.8;
    }
  
    if (tile.jump && this.jump_switch > 15) {
  
      this.player.can_jump = true;
  
      this.jump_switch = 0;
  
    } else this.jump_switch++;
  
    if (this.detectSides(18).result && this.jump_switch > 15) {
      this.player.can_jump = true;
  
      this.jump_switch = 0;
    } else this.jump_switch++;
  
    this.player.vel.x = Math.min(Math.max(this.player.vel.x, -this.current_map.vel_limit.x), this.current_map.vel_limit.x);
    this.player.vel.y = Math.min(Math.max(this.player.vel.y, -this.current_map.vel_limit.y), this.current_map.vel_limit.y);
  
    this.player.loc.x += this.player.vel.x;
    this.player.loc.y += this.player.vel.y;
  
    this.player.vel.x *= .9;
  
    if (left1.solid || left2.solid || right1.solid || right2.solid) {
  
      /* fix overlap */
  
      while (this.get_tile(Math.floor(this.player.loc.x / this.tile_size), y_near1).solid
        || this.get_tile(Math.floor(this.player.loc.x / this.tile_size), y_near2).solid)
        this.player.loc.x += 0.1;
  
      while (this.get_tile(Math.ceil(this.player.loc.x / this.tile_size), y_near1).solid
        || this.get_tile(Math.ceil(this.player.loc.x / this.tile_size), y_near2).solid)
        this.player.loc.x -= 0.1;
  
      /* tile bounce */
  
      var bounce = 0;
  
      if (left1.solid && left1.bounce > bounce) bounce = left1.bounce;
      if (left2.solid && left2.bounce > bounce) bounce = left2.bounce;
      if (right1.solid && right1.bounce > bounce) bounce = right1.bounce;
      if (right2.solid && right2.bounce > bounce) bounce = right2.bounce;
  
      this.player.vel.x *= -bounce || 0;
  
    }
  
    if (top1.solid || top2.solid || bottom1.solid || bottom2.solid) {
  
      /* fix overlap */
  
      while (this.get_tile(x_near1, Math.floor(this.player.loc.y / this.tile_size)).solid
        || this.get_tile(x_near2, Math.floor(this.player.loc.y / this.tile_size)).solid)
        this.player.loc.y += 0.1;
  
      while (this.get_tile(x_near1, Math.ceil(this.player.loc.y / this.tile_size)).solid
        || this.get_tile(x_near2, Math.ceil(this.player.loc.y / this.tile_size)).solid)
        this.player.loc.y -= 0.1;
  
      /* tile bounce */
  
      var bounce = 0;
  
      if (top1.solid && top1.bounce > bounce) bounce = top1.bounce;
      if (top2.solid && top2.bounce > bounce) bounce = top2.bounce;
      if (bottom1.solid && bottom1.bounce > bounce) bounce = bottom1.bounce;
      if (bottom2.solid && bottom2.bounce > bounce) bounce = bottom2.bounce;
  
      this.player.vel.y *= -bounce || 0;
  
      if ((bottom1.solid || bottom2.solid) && !tile.jump) {
  
        this.player.on_floor = true;
        this.player.can_jump = true;
      }
  
    }
  
    // adjust camera
  


    var c_x = Math.round(this.cam.loc.x - this.viewport.x / 2);
    var c_y = Math.round(this.cam.loc.y - this.viewport.y / 2);
    var x_dif = Math.abs(c_x - this.camera.x);
    var y_dif = Math.abs(c_y - this.camera.y);
  
    if (x_dif > 5) {
  
      var mag = Math.round(Math.max(1, x_dif * 0.1));
  
      if (c_x != this.camera.x) {
  
        this.camera.x += c_x > this.camera.x ? mag : -mag;
  
        if (this.limit_viewport) {
  
          this.camera.x =
            Math.min(
              this.current_map.width_p - this.viewport.x + this.tile_size,
              this.camera.x
            );
  
          this.camera.x =
            Math.max(
              0,
              this.camera.x
            );
        }
      }
    }
  
    if (y_dif > 5) {
  
      var mag = Math.round(Math.max(1, y_dif * 0.1));
  
      if (c_y != this.camera.y) {
  
        this.camera.y += c_y > this.camera.y ? mag : -mag;
  
        if (this.limit_viewport) {
  
          this.camera.y =
            Math.min(
              this.current_map.height_p - this.viewport.y + this.tile_size,
              this.camera.y
            );
  
          this.camera.y =
            Math.max(
              0,
              this.camera.y
            );
        }
      }
    }
  
    if (this.last_tile != tile.id && tile.script) {
  
      eval(this.current_map.scripts[tile.script]);
    }
  
    this.last_tile = tile.id;
  
  };

  Clarity.prototype.handle_draw = function () {
    if (this.isDrawing){
      // This is where the canvas interaction is processed.
      let x = this.mouse.x;
      let y = this.mouse.y;
    
      var worldX = this.screenToWorldSpace(x, this.camera.x);
      var worldY = this.screenToWorldSpace(y, this.camera.y);

      if (this.isNegative(worldX) || this.isNegative(worldY)){
        return; // Don't let the user place blocks outside the array
      }
      if (worldY > this.current_map.data.length-1 || worldX > this.current_map.data[0].length-1){
        return; // Don't let the user place blocks outside the array
      }

      this.current_map.data[worldY][worldX] = this.current_map.keys[this.selectedTile]; // Selection
    } else if (this.isErasing){
      // This is where the canvas interaction is processed.
      let x = this.mouse.x;
      let y = this.mouse.y;
    
      var worldX = this.screenToWorldSpace(x, this.camera.x);
      var worldY = this.screenToWorldSpace(y, this.camera.y);

      if (this.isNegative(worldX) || this.isNegative(worldY)){
        return; // Don't let the user place blocks outside the array
      }
      if (worldY > this.current_map.data.length-1 || worldX > this.current_map.data[0].length-1){
        return; // Don't let the user place blocks outside the array
      }

      this.current_map.data[worldY][worldX] = this.current_map.keys[1]; // Air
    }
  }
  
  Clarity.prototype.update_player = function () {
    
    this.handle_draw();
  
  
    if (this.key.left) {
      if (this.player.vel.x > -this.current_map.vel_limit.x)
        this.player.vel.x -= this.current_map.movement_speed.left;
    }
  
  // 1. If the player presses the up arrow, then check if they can jump.
  // 2. If the player can jump, then check if they're touching a wall.
  // 3. If they are, then check if they are jumping off a wall to the right or left.
  // 4. If they are, then change the player's velocity to be able to jump off the wall.
  // 5. If they are not, then simply change the player's velocity to be able to jump.
  // 6. If the player can't jump, then do nothing. 
    if (this.key.up) {
  
      if (this.player.can_jump && this.player.vel.y > -this.current_map.vel_limit.y ) {
        if (this.detectSides(18).result && !this.isGroundSolid()){
  
          if(this.allowSpecialJump){
            this.allowSpecialJump = false;
  
            if(this.detectSides(18).side == "left"){
              // Bump player off wall to the right using velocity
              this.player.vel.x += this.current_map.movement_speed.jump;
            } else {
              // Same thing, but to the left
              this.player.vel.x -= this.current_map.movement_speed.jump;
            }
            this.player.vel.y -= this.current_map.movement_speed.jump;
    
          }
        } else {
            if (this.isInside(3) || this.isInside(12)|| this.isInside(14)|| this.isInside(15)){
              
              if(this.allowSpecialJump){
                this.allowSpecialJump = false;
  
                this.player.vel.y -= this.current_map.movement_speed.jump;
              }
            } else {
              this.player.vel.y -= this.current_map.movement_speed.jump;
            }
            
        }
        
        this.player.can_jump = false;
      }
    } else {
      this.allowSpecialJump = true;
    }
  
  
  
    if (this.key.right) {
  
      if (this.player.vel.x < this.current_map.vel_limit.x)
        this.player.vel.x += this.current_map.movement_speed.left;
    }


    // Update the viewport

    var moveSpeed = 5*(this.tile_size*0.1);

    if (this.viewportControls.up) {
      this.cam.loc.y -= moveSpeed;
    }

    if (this.viewportControls.down) {
      this.cam.loc.y += moveSpeed;
    }

    if (this.viewportControls.left) {
      this.cam.loc.x -= moveSpeed;
    }

    if (this.viewportControls.right) {
      this.cam.loc.x += moveSpeed;
    }

    // this.update_position();
    this.move_player();
  };

  Clarity.prototype.update_mouse = function (canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    this.mouse.x = evt.clientX - rect.left;
    this.mouse.y = evt.clientY - rect.top;
  };
  
  Clarity.prototype.draw_player = function (context) {
  
    


    context.fillStyle = this.player.colour;
  
    context.beginPath();
  
    context.arc(
      this.player.loc.x + this.tile_size / 2 - this.camera.x,
      this.player.loc.y + this.tile_size / 2 - this.camera.y,
      this.tile_size / 2 - 1,
      0,
      Math.PI * 2
    );
  
    context.fill();

  };
  
  Clarity.prototype.draw_other_player = function (context, x, y, username) {
    context.fillStyle = "#FFFFFF";
    context.font = "10px Arial";
  
    // Draw the player's username above their player
    context.fillText(
      username,
      x + this.tile_size / 2 - this.camera.x,
      y + this.tile_size / 2 - this.camera.y - 10
    );
    context.fillStyle = "#FF9900";
    context.beginPath();
  
    context.arc(
      x + this.tile_size / 2 - this.camera.x,
      y + this.tile_size / 2 - this.camera.y,
      this.tile_size / 2 - 1,
      0,
      Math.PI * 2
    );
  
    context.fill();
  
  }
  
  Clarity.prototype.update = function () {
    this.update_player();
  };
  
  Clarity.prototype.draw = function (context) {
    this.draw_map(context, false);
    var _this = this;
    for (const username in _this.current_lobby) {
      if (username != signedin()){
        var pos = _this.current_lobby[username];
        _this.draw_other_player(context, pos.x, pos.y, username);
      }
    }
    this.draw_player(context);
  
  };
  
  const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
  
  Clarity.prototype.detectBelow = function (id){
    var map = this.current_map.data;
    var playerX = Math.round(this.player.loc.x/16);
    var playerY = Math.round(this.player.loc.y/16);
  
    if (playerY >= map.length-1 || playerX >= map.length){
      return false;
    } else if (playerY < 0 || playerX < 0){
      return false;
    }
  
  
    var tile = map[playerY+1][playerX];
  
    return tile.id == id;
  }
  
  Clarity.prototype.detectSides = function (id){
    var map = this.current_map.data;
    var playerX = Math.round(this.player.loc.x/16);
    var playerY = Math.round(this.player.loc.y/16);
  
    if (playerY >= map.length-1 || playerX >= map.length-1){
      return false;
    }
    if (playerY <= 1 || playerX <= 1){
      return false;
    }
  
    if (playerX+1 > map.length-1){
      return false;
    }
    if (playerX-1 < 1){
      return false;
    }
  
    var tileA = map[playerY][playerX+1];
    var tileB = map[playerY][playerX-1];
  
  
  
    var isDetected = false;
    var sideDetected;
    if (tileA.id == id){
      sideDetected = "right";
      isDetected = true;
    } else if (tileB.id == id){
      sideDetected = "left";
      isDetected = true;
    }
  
    var unroundX = this.player.loc.x/16;
    
    if (sideDetected == "right"){
      if (Math.round(unroundX + 0.6) == playerX + 1 && isDetected){
        return {result: true, side: "right"};
      } else {
        return {result: false, side: null};
      }
    } else {
      if (Math.round(unroundX - 0.6) == playerX - 1 && isDetected){
        return {result: true, side: "left"};
      } else {
        return {result: false, side: null};
      }
    }
    
  
  }

  Clarity.prototype.screenToWorldSpace = function (coord, cameraAxis){
    return (Math.floor((coord - this.tile_size * 2 + Math.trunc(cameraAxis))/this.tile_size) + 2)
  }
  
  Clarity.prototype.cameraToWorldSpace = function (coord, cameraAxis){
    return ((coord - this.tile_size * 2 + cameraAxis)/this.tile_size + 2)
  }

  Clarity.prototype.worldToScreenSpace = function (coord, cameraAxis){
    return coord + this.tile_size / 2 - cameraAxis;
  }

  Clarity.prototype.isNegative = function (num) {
    if (Math.sign(num) === -1) {
      return true;
    }
    return false;
  }

  Clarity.prototype.onClick = function (e){
    if (e.button === 0) {
      this.isDrawing = true;
    } else if (e.button === 2) {
      this.isErasing = true;
    }
  }

  Clarity.prototype.onReleaseClick = function (e){
    if (e.button === 0) {
      this.isDrawing = false;
    } else if (e.button === 2) {
      this.isErasing = false;
    }
  }
  
  Clarity.prototype.isInside = function (id){
    var map = this.current_map.data;
    var playerX = Math.round(this.player.loc.x/16);
    var playerY = Math.round(this.player.loc.y/16);
    if (playerY >= map.length || playerX >= map.length){
      return false;
    } else if (playerY < 0 || playerX < 0){
      return false;
    }
  
    var tile = map[playerY][playerX];
  
    return tile.id == id
  }
  
  Clarity.prototype.getBelow = function (){
    var map = this.current_map.data;
    var playerX = Math.round(this.player.loc.x/16);
    var playerY = Math.round(this.player.loc.y/16);
  
    if (playerY >= map.length-1 || playerX >= map.length){
      return false;
    } else if (playerY < 0 || playerX < 0){
      return false;
    }
  
    var tile = map[playerY+1][playerX];
  
    return tile;
  }
  
  Clarity.prototype.isGroundSolid = function (){
    return this.getBelow().solid;
  }


  // this.tile_size -= Math.floor(scrollAmount*0.8);