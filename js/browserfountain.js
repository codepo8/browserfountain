/**
 * Browserfountain 
 * A canvas particle demo by Christian Heilmann @codepo8
 * Uses ImageParticle.js by Seb Lee Delisle and 
 * the requestAnimationFrame shim by Paul Irish
 */
(function(){

  var SCREEN_WIDTH = window.innerWidth,
  SCREEN_HEIGHT = window.innerHeight,
  HALF_WIDTH = window.innerWidth / 2,
  HALF_HEIGHT = window.innerHeight / 2,
  canvas = document.querySelector( 'canvas' ),
  context = canvas.getContext( '2d' ),
  oldhash = false,
  domelms = [],
  logo = false,
  running = true,
  mouseDown = false,
  visible = true,
  particles = [],
  MAX_PARTICLES = 350,
  minvelx = -15,
  blur = true,
  maxvelx = 15,
  minvely = -30,
  maxvely = -5,
  logosize = 0.8,
  rotate = true,
  gravity = 0.4,
  drag = 0.97,
  createnumber = 1,
  browsers = [ 'ie', 'firefox', 'opera', 'safari', 'chrome', 'K47uNg' ];
  browserimages = [];

  for( var i = 0, j = browsers.length; i < j; i++ ) {
    var img = new Image();
    img.src = 'img/'+browsers[i]+'.png';
    browserimages.push(img);
  }

  function init() {
    
    var currentloc = window.location.search.split('?')[1];
    if ( currentloc ) {
      parts = currentloc.split('%');
      MAX_PARTICLES = parts[0];
      createnumber = parts[1];
      minvelx = parts[2]; 
      maxvelx = parts[3];
      drag = parts[4];
      gravity = parts[5];
      logosize = parts[6];
      minvely = parts[7];
      maxvely = parts[8];
      rotate = parts[9] === 'true';
      blur = parts[10] === 'true';      
    }

    var form = ''+
      '<form>'+
        '<fieldset><legend>Logos</legend>'+
        '<div><label for="maxparticles">Amount of logos</label>'+
        '<input type="number" id="maxparticles" value="' + MAX_PARTICLES + 
        '" size="1"></div>'+
        '<div><label for="createnumber">How many at a time?</label>'+
        '<input type="number" id="createnumber" value="' + createnumber + 
        '" size="2"></div>'+
        '<div><input type="checkbox" id="rotate" '+(rotate ? 'checked' : '')+
        '><label for="rotate">Rotate logos</label></div>'+
        '<div><input type="checkbox" id="blur" '+(blur ? 'checked' : '')+'>'+
        '<label for="blur">Blur logos</label></div>'+
        '<div><label for="logosize">Logo size</label>'+
        '<input type="number" id="logosize" value="' + logosize + 
        '" step="0.1"></div></fieldset>'+
        '<fieldset><legend>Physics</legend>'+
        '<div><label for="gravity">Gravity</label>'+
        '<input type="number" id="gravity" value="' + gravity + 
        '" step="0.1"></div>'+
        '<div><label for="drag">Drag</label>'+
        '<input type="number" id="drag" value="'+drag+'" step="0.01"></div>'+
        '</fieldset>'+
        '<fieldset><legend>Speeds</legend>'+
        '<div>Horizontal: <label for="minvelx">From</label>'+
        '<input id="minvelx" value="' + minvelx + '" type="number">'+
        '<label for="maxvelx">to</label>'+
        '<input id="maxvelx" value="' + maxvelx + '" type="number"></div>'+
        '<div>Vertical: <label for="minvely">From</label>'+
        '<input id="minvely" value="' + minvely + '" type="number">'+
        '<label for="maxvely">to</label>'+
        '<input id="maxvely" value="' + maxvelx + '" type="number">'+
        '</div></fieldset>'+
        '<p>Click the HTML5 logo to create more.</p>'+
        '<p>Press "x" to toggle forms and texts</p>'+
        '<p>Press "p" to pause animation</p>'+
        '<p>Press "s" to capture a screenshot</p>'+

      '</form>';

    var container = document.querySelector( 'section' );
    container.innerHTML += form;

    logo = document.createElement( 'img' );
    logo.src = 'img/5logo.png';
    document.body.appendChild( canvas ); 
    canvas.width = SCREEN_WIDTH; 
    canvas.height = SCREEN_HEIGHT;
    requestAnimationFrame( loop,10 );

    logo.addEventListener( 'mousedown', function(e) {
      mouseDown = true;
    }, false );
    logo.addEventListener( 'mouseup', function(e) {
      mouseDown = false;
    }, false );

    document.querySelector( 'form' ).addEventListener( 'submit', function(e){
      getvalues();
      e.preventDefault();
    },false);
    cacheDOMelements();
  }

  function loop() {

    if ( running ) {
      makeParticle( mouseDown ? ( createnumber + 8 ) : createnumber );    
      context.fillStyle = blur ? "rgba(0,0,0,.5)" : "rgb(0,0,0)" ;
      context.fillRect(0,0, SCREEN_WIDTH, SCREEN_HEIGHT);
      for( var i = 0, j = particles.length; i < j; i++ ) {
        var particle = particles[i]; 
        particle.render( context ); 
        particle.update();
        if( particle.posY > SCREEN_HEIGHT-50 ) {
          particle.velY *= -0.9; 
          particle.posY = SCREEN_HEIGHT-50;
        }
      }
      while( particles.length > MAX_PARTICLES ) {
        particles.shift();
      } 
      context.drawImage( logo, HALF_WIDTH-100, SCREEN_HEIGHT-220 );
    }
    requestAnimationFrame( loop, 10 );

  }
  
  function cacheDOMelements() {

    var tocache = [ 'maxparticles', 'createnumber', 'minvelx', 
                    'maxvelx', 'drag', 'gravity', 'logosize', 
                    'minvely', 'maxvely', 'rotate', 'blur' ];
    for( var i = 0, j = tocache.length; i < j; i++ ) {
     var now = tocache[i];
     domelms[now] = document.querySelector( '#' + now ); 
    }

  }
  
  function getvalues() {

    MAX_PARTICLES = +domelms[ 'maxparticles' ].value;
    createnumber = +domelms[ 'createnumber' ].value;
    minvelx = +domelms[ 'minvelx' ].value;
    maxvelx = +domelms[ 'maxvelx' ].value;
    drag = +domelms[ 'drag' ].value;
    gravity = +domelms[ 'gravity' ].value;
    logosize = +domelms[ 'logosize' ].value;
    minvely = +domelms[ 'minvely' ].value;
    maxvely = +domelms[ 'maxvely' ].value;
    rotate = domelms[ 'rotate' ].checked;
    blur = domelms[ 'blur' ].checked;
    var hash = createhash();
    if(hash !== oldhash){
      history.pushState({}, 'current', 'index.html?' + hash );
      oldhash = hash;
    }
    
  }

  function createhash(){

    var hash = MAX_PARTICLES + '%' + createnumber + '%' + minvelx + 
               '%' + maxvelx + '%' + drag + '%' + gravity + '%' + logosize +
               '%' + minvely + '%' + maxvely + '%' + rotate + '%' + blur;
    return hash;           

  }

  function makeParticle( particleCount ) {

    getvalues();
    for( var i = 0, j = particleCount; i < j; i++ ) {
      var browser = parseInt( randomRange( 0, 5 ), 10 );
      var pic = browserimages[ browser ];
      var nyan = false;
      if ( parseInt( randomRange( 0, 30 ), 10 ) === 3 ) {
        pic = browserimages[5];
        nyan = true;
      }
      particle = new ImageParticle( pic, HALF_WIDTH,
                                   SCREEN_HEIGHT-220 ); 
      particle.velX = randomRange( minvelx, maxvelx) ;
      particle.velY = randomRange( minvely, maxvely );

      particle.size = randomRange( 0.4, logosize );
      if(nyan){
        particle.size = randomRange( 0.3, 0.5 );
        this.alpha = 0.5;
      }
      particle.gravity = gravity; 

      if ( rotate ) {
        particle.spin = randomRange( -10, 10 );
      }
      particle.drag = drag;

      if (browser === 0 ) { // it is catching up a bit 
        particle.drag -= 0.04;
      } 

      particle.shrink = 0.98; 
      particles.push( particle ); 
    }
  }
  
  window.addEventListener( 'load', init, false );
  
  document.addEventListener( 'keydown', function(e){
  
    var display;
    if ( e.keyCode === 88 ) {
      if ( visible ){
        visible = false;
        display = 'none';
      } else {
        visible = true;
        display = 'block';
      }
      document.querySelector( 'section' ).style.display = display;
      document.querySelector( 'header' ).style.display = display;
      document.querySelector( 'footer' ).style.display = display;
    }
    if ( e.keyCode === 80 ) {
      if ( running ) { 
        running = false; 
      } else {
        running = true;
      }
    }
    
    // if s - save as image
    if ( e.keyCode === 83 ) {
      // use canvas2image
      Canvas2Image.saveAsJPEG(canvas);
      alert('Please rename the file FILENAME.jpg');
      // annoyingly on a mac using firefox it saved as .part 
      // even though complete
    }
    
  }, false );

})();

/**
 * Provides requestAnimationFrame in a cross browser way.
 * http://paulirish.com/2011/requestanimationframe-for-smart-animating/
 */
if ( !window.requestAnimationFrame ) {
  window.requestAnimationFrame = ( function() {
    return window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element ) {
      window.setTimeout( callback, 1000 / 60 );
    };
  } )();
}
