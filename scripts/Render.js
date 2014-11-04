/*

@betolink 2013

Licensed under WTFPL
http://www.wtfpl.net/txt/copying/

*/

var gl, canvas, container, camera, scene, renderer, tloader, geometry, context, gradient,
mouseX = 0, mouseY = 0, mesh, material, texture, indexIm = 0, textures = [],
windowHalfX = window.innerWidth / 2,
windowHalfY = window.innerHeight / 2,
months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

init();
animate();

function init() {
  container = document.getElementById( 'container' );
  yearDOM = document.getElementById( 'years');
  camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 2000 );
  camera.position.z = 500;
  scene = new THREE.Scene();
  //loadTextures("2002");
  texture = THREE.ImageUtils.loadTexture( "./browse.jpg" );
  console.log('texture loaded');
  geometry = new THREE.SphereGeometry( 200, 32, 32 );
  material = new THREE.MeshBasicMaterial( { map: texture, overdraw: true } );
  mesh = new THREE.Mesh( geometry, material );
  mesh.material.needsUpdate = true;
  scene.add( mesh );
  canvas = document.createElement( 'canvas' );
  controls = new THREE.TrackballControl( camera, container );
  controls.zoomSpeed = 1.2;
  controls.noZoom = false;
  controls.dynamicDampingFactor = 0.3;
  canvas.width = 256;
  canvas.height = 256 ;

  context = canvas.getContext( '2d' );
  gradient = context.createRadialGradient(
    canvas.width / 2,
    canvas.height / 2,
    0,
    canvas.width / 2,
    canvas.height / 2,
    canvas.width / 2
    );

  gradient.addColorStop( 0.1, 'rgba(210,210,210,1)' );
  gradient.addColorStop( 1, 'rgba(255,255,255,1)' );

  context.fillStyle = gradient;
  context.fillRect( 0, 0, canvas.width, canvas.height );
  tloader = new THREE.TextureLoader();

  texture = new THREE.Texture( canvas );
  texture.needsUpdate = true;

  renderer = new THREE.CanvasRenderer();
  renderer.setSize( window.innerWidth / 1.8 , window.innerHeight / 1.8);

  container.appendChild( renderer.domElement );

  document.addEventListener( 'mousemove', onDocumentMouseMove, false );

  container.addEventListener("touchstart", touchHandler, true);
  container.addEventListener("touchmove", touchHandler, true);
  container.addEventListener("touchend", touchHandler, true);
  container.addEventListener("touchcancel", touchHandler, true);

  window.addEventListener( 'resize', onWindowResize, false );
  yearDOM.addEventListener('change', loadYear, false);

}

function onWindowResize() {

  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth / 1.8 , window.innerHeight / 1.8);
}

function onDocumentMouseMove( event ) {
  mouseX = ( event.clientX  );
  mouseY = ( event.clientY  );
}
//
function animate() {
  requestAnimationFrame( animate );
  render();
}

function render() {
  controls.update();
  mesh.rotation.y -= 0.005;
  renderer.render( scene, camera );
}

function updateTexture (index) {
  mesh.material.map = textures[index-1];
  var elem = document.getElementById('current-week');
  elem.innerText = months[Math.round(index * 0.229984)];
};

function updateWorld (){
  if (tloaded === false || textures === undefined) return;
  if (indexIm >= textures.length) indexIm = 0;
  indexIm += 1;
  updateTexture(indexIm);
}

function rLoader(rasters, count) {
  if (count >= rasters.length) {
    tloaded = true;
    return;
  }
  tloader.load("./data/stack/" + rasters[count].file,  function ( texture ) {
    textures.push(texture);
    rLoader(rasters, count+1);
  } );
}

function loadTextures(year) {
  var rasters = textureRasters[year];
  rLoader(rasters,0);
  window.setInterval(updateWorld, 1000);
};

function loadYear(e){
  window.clearInterval();
  var rasters, year, yearDOM;
  textures = [];
  tloaded = false;
  yearDOM = document.getElementById( 'years' );
  year = yearDOM[yearDOM.selectedIndex].value;
  console.log("Loading " + year);
  var elem = document.getElementById('current-week');
  elem.innerText = "LOADING DATA...";
  loadTextures(year.toString());
};


function touchHandler(event) {
  var touches = event.changedTouches,
  first = touches[0],
  type = "";
  switch(event.type)
  {
    case "touchstart": type = "mousedown"; break;
    case "touchmove":  type="mousemove"; break;
    case "touchend":   type="mouseup"; break;
    default: return;
  }
  var simulatedEvent = document.createEvent("MouseEvent");
  simulatedEvent.initMouseEvent(type, true, true, window, 1,
  first.screenX, first.screenY,
  first.clientX, first.clientY, false,
  false, false, false, 0/*left*/, null);
  first.target.dispatchEvent(simulatedEvent);
  event.preventDefault();
};
