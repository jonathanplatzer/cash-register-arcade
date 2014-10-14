// // The update() method is called every frame
//         GameState.prototype.update = function() {
//             if (this.game.time.fps !== 0) {
//                 this.fpsText.setText(this.game.time.fps + ' FPS');
//                 this.accelerationText.setText(this.player.body.acceleration + 'acceleration');
//                 this.velocityText.setText(this.player.body.velocity + 'velocity');
//             }

//             // Collide the player with the ground
//             this.game.physics.arcade.collide(this.player, this.ground);

//             var onTheGround = this.player.body.touching.down;

//             if (this.leftInputIsActive()) {
//                 // If the LEFT key is down, set the player velocity to move left
//                 this.player.body.acceleration.x = -this.ACCELERATION;
//             } else if (this.rightInputIsActive()) {
//                 // If the RIGHT key is down, set the player velocity to move right
//                 this.player.body.acceleration.x = this.ACCELERATION;
//             } else {

//                 this.player.body.acceleration.x = 0;
//                 if (onTheGround) {
//                     this.canDoubleJump = true;
//                     this.player.body.velocity.x = -this.FORCE;
//                 } else {
//                     //this.player.body.velocity.x = 0;
//                 }

//             }

//             // Set a variable that is true when the player is touching the ground

//             if (this.upInputIsActive(5)) {
//                 if (this.canDoubleJump || onTheGround) {
//                     // Jump when the player is touching the ground or they can double jump
//                     this.player.body.velocity.y = this.JUMP_SPEED;

//                     // Disable ability to double jump if the player is jumping in the air
//                     if (!onTheGround) {
//                         this.canDoubleJump = false;
//                     }
//                 }
//             }
//         };
