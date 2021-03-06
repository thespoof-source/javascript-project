<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.5.1/gsap.min.js" integrity="sha512-IQLehpLoVS4fNzl7IfH8Iowfm5+RiMGtHykgZJl9AWMgqx0AmJ6cRWcB+GaGVtIsnC4voMfm8f2vwtY+6oPjpQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script> 
    <script>
const canvas = document.querySelector('canvas');
const c =canvas.getContext('2d');
canvas.width=innerWidth;
canvas.height=innerHeight;
//create class for player
class Player{
    //constructr every time innitiated for new version of player
    //inside thhe constructor pass the all four argumentwhch we declare down
    constructor(x,y,radius,color) {
        this.x=x;
        this.y=y;

        this.radius=radius;
        this.color=color;
    }
    //draw functio using canvas function
    draw(){
c.beginPath();
//c.arc(x: Int ,y: Int,r:Int,statrting angle:Float,ending angle:drawCounterClockwise:Bool(false));
  c.arc(this.x,this.y,this.radius,0,Math.PI*2,false)  ;
  c.fillStyle= this.color;
  c.fill();
}
}
class Projectile {
    constructor(x,y,radius,color,velocity){

        this.x = x;
        this.y=y;
        this.radius=radius;
        this.color=color;
        this.velocity=velocity;
    }
    draw(){
c.beginPath();
//c.arc(x: Int ,y: Int,r:Int,statrting angle:Float,ending angle:drawCounterClockwise:Bool(false));
  c.arc(this.x,this.y,this.radius,0,Math.PI*2,false)  ;
  c.fillStyle= this.color;
  c.fill();
}
update(){
  this.draw();
  this.x = this.x + this.velocity.x;
  this.y = this.y + this.velocity.y;

}

}
class Enemy {
    constructor(x,y,radius,color,velocity){

        this.x = x;
        this.y=y;
        this.radius=radius;
        this.color=color;
        this.velocity=velocity;
    }
    draw(){
c.beginPath();
//c.arc(x: Int ,y: Int,r:Int,statrting angle:Float,ending angle:drawCounterClockwise:Bool(false));
  c.arc(this.x,this.y,this.radius,0,Math.PI*2,false)  ;
  c.fillStyle= this.color;
  c.fill();
}
update(){
  this.draw();
  this.x = this.x + this.velocity.x;
  this.y = this.y + this.velocity.y;

}

}
class Particle {
    constructor(x,y,radius,color,velocity){

        this.x = x;
        this.y=y;
        this.radius=radius;
        this.color=color;
        this.velocity=velocity;
        this.alpha=1;
    }
    draw(){
      c.save();
      c.globalAlpha= this.alpha;
c.beginPath();
//c.arc(x: Int ,y: Int,r:Int,statrting angle:Float,ending angle:drawCounterClockwise:Bool(false));
  c.arc(this.x,this.y,this.radius,0,Math.PI*2,false)  ;
  c.fillStyle= this.color;
  c.fill();
  c.restore();
}
update(){
  this.draw();
  this.x = this.x + this.velocity.x;
  this.y = this.y + this.velocity.y;
  this.alpha -= 0.01;

}
}


const x = canvas.width/2;
const y = canvas.height/2;


const player = new Player(x, y,10,'white');


const projectiles = [];
const enemies = [];
const particles = [];
function spawnEnemies(){
setInterval(()=>{
   const radius=Math.random() * (30 -4) * 4;
   let x;
   let y;
   if(Math.random() < 0.5){
  x = Math.random() < 0.5 ? 0 - radius:canvas.width + radius;
y=Math.random() * canvas.height;
  
  }
  else {
     x = Math.random() * canvas.width;
y= Math.random()< 0.5 ? 0 - radius:canvas.height+ radius;
  }
  const color = 'hsl(${ Math.random() * 360}, 50%,50%)';
  
  const angle = Math.atan2(canvas.height/2 -y,canvas.width/2  - x);
  const velocity ={
    x:Math.cos(angle) ,
    y:Math.sin(angle) 
  }

  enemies.push(new Enemy(x,y,radius,color,velocity));
},1000);
}


let animationId

function animate() {
  animationId= requestAnimationFrame(animate);
  c.fillStyle ='rgba(0,0,0,0.1)';
  c.fillRect(0,0,canvas.width,canvas.height);
  player.draw();
  //remove object from teh screen that why we also select index
  particles.forEach((particle,index) => {
    if(particle.alpha <= 0){
      particles.splice(index,1);
    }
    else {

    particle.update();
  }
  })
  projectiles.forEach((projectile,index) => {
    projectile.update();
    // remove fro, edges of screen
    if(projectile.x - projectile.radius < 0 || projectile.x -projectile. radius > canvas.width || projectile.y + projectile.radius < 0 || projectile.y - projectile.radius > canvas.height ){
 setTimeout(() => {
  //enemies.splice(index,1);
  projectiles.splice(index,1);
    },0)
    }
  })
  enemies.forEach((enemy, index) => {
enemy.update();

const dist = Math.hypot(player.x - enemy.x, player.y -enemy.y);
//end game
 if(dist - enemy.radius - player.radius < 1){
cancelAnimationFrame(animationId);
 }

projectiles.forEach((projectile ,projectileIndex) => {
  //hypot is used for distance let a to h
  const dist = Math.hypot(projectile.x - enemy.x, projectile.y -enemy.y);
  //object touch when it shot the enemies then after that they are invisible or removed from the screen
  //when projectiles touch enemy
  if(dist - enemy.radius - projectile.radius < 1){
    //create explosion
    for(let i=0;i<enemy.radius * 2;i++){
      particles.push(new Particle(projectile.x,projectile.y,Math.random() * 2,enemy.color,
        {
          x: (Math.random() - 0.5) *(Math.random() * 8),
         y: (Math.random() - 0.5) *(Math.random() * 8)
       }
       )
      )

    }
    if(enemy.radius - 10> 10){
gsap.to(enemy,{
  radius:enemy.radius -10
})
 setTimeout(() => {
  //enemies.splice(index,1);
  projectiles.splice(projectileIndex,1);
    },0)
    }
    else {
      setTimeout(() => {
  enemies.splice(index,1);
  projectiles.splice(projectileIndex,1);
    },0)
    }
    
 
  }
})


  })
//projectile.draw();
//projectile.update();

}
//console.log(player);
//want to clcik on screen for addevent listener ,what event want to listen for

window.addEventListener('click',(event)=>{

  const angle =  Math.atan2(event.clientY - canvas.height/2,event.clientX - canvas.width/2);
  const velocity = {
    x:Math.cos(angle) * 4,
    y:Math.sin(angle) * 4
  }
 projectiles.push(new Projectile(canvas.width/2,canvas.height/2,5,'blue',velocity));
  
})
animate();
spawnEnemies();
    </script>
