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
  domelms = [],
  mouseDown = false,
  particles = [],
  MAX_PARTICLES = 350,
  minvelx = -15,
  maxvelx = 15,
  minvely = -30,
  maxvely = -5,
  logosize = 0.8,
  rotate = true,
  gravity = 0.4,
  drag = 0.97,
  createnumber = 1,
  browsers = [ 'ie', 'firefox', 'opera', 'safari', 'chrome' ];
  browserimages = [];

  for( var i = 0, j = browsers.length; i < j; i++ ) {
    var img = new Image();
    img.src = 'img/'+browsers[i]+'.png';
    browserimages.push(img);
  }

  function init() {
    
    var form = ''+
      '<form>'+
        '<fieldset><legend>Logos</legend>'+
        '<div><label for="maxparticles">Amount of logos</label>'+
        '<input type="number" id="maxparticles" value="350" size="1"></div>'+
        '<div><label for="createnumber">How many at a time?</label>'+
        '<input type="number" id="createnumber" value="1" size="2"></div>'+
        '<div><input type="checkbox" id="rotate" checked>'+
        '<label for="rotate">Rotate logos</label></div>'+
        '<div><label for="logosize">Logo size</label>'+
        '<input type="number" id="logosize" value="0.8" step="0.1"></div>'+
        '</fieldset>'+
        '<fieldset><legend>Physics</legend>'+
        '<div><label for="gravity">Gravity</label>'+
        '<input type="number" id="gravity" value="0.4" step="0.1"></div>'+
        '<div><label for="drag">Drag</label>'+
        '<input type="number" id="drag" value="0.97" step="0.01"></div>'+
        '</fieldset>'+
        '<fieldset><legend>Speeds</legend>'+
        '<div>Horizontal: <label for="minvelx">From</label>'+
        '<input id="minvelx" value="-15" type="number" size="2">'+
        '<label for="maxvelx">to</label>'+
        '<input id="maxvelx" value="15" type="number" size="2"></div>'+
        '<div>Vertical: <label for="minvely">From</label>'+
        '<input id="minvely" value="-30" type="number" size="2">'+
        '<label for="maxvely">to</label>'+
        '<input id="maxvely" value="-5" type="number" size="2">'+
        '</div></fieldset>'+
        '<p>Click the HTML5 logo to create more.</p>'+
      '</form>';

    var container = document.querySelector( 'section' );
    container.innerHTML += form;

    var logo = document.createElement( 'div' );
    logo.id = 'logo';
    document.body.appendChild( logo );
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

    makeParticle( mouseDown ? ( createnumber + 8 ) : createnumber );    
    context.fillStyle = "rgba(0,0,0,.5)";
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
    requestAnimationFrame( loop, 10 );

  }
  
  function cacheDOMelements() {

    var tocache = ['maxparticles', 'createnumber', 'minvelx', 
                   'maxvelx', 'drag', 'gravity', 'logosize', 
                   'minvely', 'maxvely', 'rotate'];
    for( var i = 0, j = tocache.length; i < j; i++ ) {
     var now = tocache[i];
     domelms[now] = document.querySelector( '#' + now ); 
    }

  }
  
  function getvalues() {

    MAX_PARTICLES = +domelms[ 'maxparticles' ].value;
    createnumber = +domelms[  'createnumber' ].value;
    minvelx = +domelms[  'minvelx' ].value;
    maxvelx = +domelms[  'maxvelx' ].value;
    drag = +domelms[  'drag' ].value;
    gravity = +domelms[  'gravity' ].value;
    logosize = +domelms[  'logosize' ].value;
    minvely = +domelms[  'minvely' ].value;
    maxvely = +domelms[  'maxvely' ].value;
    rotate = domelms[  'rotate' ].checked;

  }

  function makeParticle( particleCount ) {

    getvalues();
    for( var i = 0, j = particleCount; i < j; i++ ) {
      var browser = parseInt( randomRange( 0, 5 ), 0 ),
          particle = new ImageParticle( browserimages[browser], HALF_WIDTH,
                                       SCREEN_HEIGHT-190 ); 
      particle.velX = randomRange( minvelx, maxvelx) ;
      particle.velY = randomRange( minvely, maxvely );


      particle.size = randomRange( 0.4, logosize );
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
