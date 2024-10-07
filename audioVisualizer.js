
//---

var audio, audioContext, audioSrc;
var analyser, analyserBufferLength;
var audioInfo = 'Song: LAKEY INSPIRED - Chill Day';

//---

var MATHPI2 = Math.PI * 2;

//---

var w;
var h;

var btStart;
var btLoadAudio;
var labelLoadAudio;
var txtStatus;
var canvas;
var context;

var imageData;
var data;

var mouseActive = false;
var mouseDown = false;
var mousePos = { x:0, y:0 };

var fov = 250;

var speed = 0.75;//0.25;

var cubeMinHeight = 2;

var frequencyDamp = 25;
var smoothingTimeConstant = 0.65;
var fftSize = 8192;//32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768

var circleHolder = [];

var time = 0;

var colorInvertValue = 0;

var rgb = {};
    rgb.r = Math.random() * MATHPI2;
    rgb.g = Math.random() * MATHPI2;
    rgb.b = Math.random() * MATHPI2;
    
var rgb2 = {};
    rgb2.r = Math.random() * MATHPI2;
    rgb2.g = Math.random() * MATHPI2;
    rgb2.b = Math.random() * MATHPI2;

//---
/*
function getRGBColor() {

  var r = Math.sin( rgb.r += 0.010 ) * 1 + 1;
  var g = Math.sin( rgb.g += 0.007 ) * 1 + 1;
  var b = Math.sin( rgb.b += 0.013 ) * 1 + 1;
  //var r = Math.sin( rgb.r += 0.040 ) * 1 + 1;
  //var g = Math.sin( rgb.g += 0.028 ) * 1 + 1;
  //var b = Math.sin( rgb.b += 0.052 ) * 1 + 1;

  return { r:r, g:g, b:b };

};*/




window.addEventListener('resize', function() {
  if (canvas) {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    data = imageData.data;
  }
});

function init() {
  canvas = document.getElementById('audioCanvas');
  canvas.width = canvas.offsetWidth || 300;
  canvas.height = canvas.offsetHeight || 150;
  
  context = canvas.getContext('2d');
  w = canvas.width;
  h = canvas.height;

  imageData = context.getImageData(0, 0, w, h);
  data = imageData.data;

  txtStatus = document.getElementById('txtStatus');
  txtStatus.innerHTML = 'Click "Start Audio Visualization" to begin';

  addCircles();
  
  setupAudioContext();
  setupEventListeners();
  loadDefaultAudio();
}


function loadDefaultAudio() {
  audio = new Audio('songs/down-with-the.mp3');
  audio.addEventListener('canplaythrough', function() {
    audioSrc = audioContext.createMediaElementSource(audio);
    audioSrc.connect(analyser);
    analyser.connect(audioContext.destination);
    txtStatus.innerHTML = 'Default audio loaded: ' + audio.src.split('/').pop();
  });
}
function setupAudioContext() {
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  analyser = audioContext.createAnalyser();
  analyser.fftSize = fftSize;
  analyserBufferLength = analyser.frequencyBinCount;
}

function setupEventListeners() {
  btStart = document.getElementById('btStartAudioVisualization');
  btLoadAudio = document.getElementById('btLoadAudio');
  
  btStart.addEventListener('click', startAudioVisualization);
  btLoadAudio.addEventListener('change', loadAudio);
}

function startAudioVisualization() {
  if (!audio) {
    txtStatus.innerHTML = 'No audio loaded. Please wait or load an audio file.';
    return;
  }
  
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }

  if (audio.paused) {
    audio.play();
    animate();
    txtStatus.innerHTML = 'Now playing: ' + audio.src.split('/').pop();
  } else {
    audio.pause();
    txtStatus.innerHTML = 'Paused';
  }
}

function loadAudio(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      audio = new Audio(e.target.result);
      audio.addEventListener('canplaythrough', function() {
        audioSrc = audioContext.createMediaElementSource(audio);
        audioSrc.connect(analyser);
        analyser.connect(audioContext.destination);
        txtStatus.innerHTML = 'Audio loaded: ' + file.name;
      });
    };
    reader.readAsDataURL(file);
  }
}
/*
const songs = [
  'songs/bulls-on-parade.mp3',
  'songs/down-with-the.mp3'
];

let currentSongIndex = 0;

function loadNextSong() {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  audio.src = songs[currentSongIndex];
  audio.play().catch(e => console.error("Error playing next song:", e));
  updateSongInfo();
}
  */

function togglePlayPause() {
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
  updateSongInfo();
}

function playPreviousSong() {
  currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  audio.src = songs[currentSongIndex];
  audio.play().catch(e => console.error("Error playing previous song:", e));
  updateSongInfo();
}

function updateSongInfo() {
  audioInfo = 'Now playing: ' + songs[currentSongIndex].split('/').pop();
  txtStatus.innerHTML = audioInfo + (audio.paused ? ' (Paused)' : '');
}
function setupAudioContext() {
  audio = new Audio();
  audio.crossOrigin = "anonymous";
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  analyser = audioContext.createAnalyser();
  analyser.fftSize = fftSize;
  analyserBufferLength = analyser.frequencyBinCount;
}

function setupEventListeners() {
  document.getElementById('btStartAudioVisualization').addEventListener('click', startAudioVisualization);
  document.getElementById('btLoadAudio').addEventListener('change', loadAudio);
}

function startAudioVisualization() {
  if (!audio.src) {
    txtStatus.innerHTML = 'Please load an audio file first';
    return;
  }
  
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }

  if (audio.paused) {
    audio.play();
    animate();
    txtStatus.innerHTML = 'Now playing: ' + audio.src.split('/').pop();
  } else {
    audio.pause();
    txtStatus.innerHTML = 'Paused';
  }
}

function loadAudio(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      audio.src = e.target.result;
      audioSrc = audioContext.createMediaElementSource(audio);
      audioSrc.connect(analyser);
      analyser.connect(audioContext.destination);
      txtStatus.innerHTML = 'Audio loaded: ' + file.name;
    };
    reader.readAsDataURL(file);
  }
}
function setupPlayerControls() {
  const playPauseButton = document.getElementById('playPauseButton');
  const prevButton = document.getElementById('prevButton');
  const nextButton = document.getElementById('nextButton');

  playPauseButton.addEventListener('click', togglePlayPause);
  prevButton.addEventListener('click', playPreviousSong);
  nextButton.addEventListener('click', loadNextSong);
}

function togglePlayPause() {
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
  updateSongInfo();
}

function playPreviousSong() {
  currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  audio.src = songs[currentSongIndex];
  audio.play().catch(e => console.error("Error playing previous song:", e));
  updateSongInfo();
}

function updateSongInfo() {
  audioInfo = 'Now playing: ' + songs[currentSongIndex].split('/').pop();
  txtStatus.innerHTML = audioInfo + (audio.paused ? ' (Paused)' : '');
}
//---
function loadNextSong() {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  audio.src = songs[currentSongIndex];
  audio.play().catch(e => console.error("Error playing next song:", e));
  updateSongInfo();
}

function drawLine( x1, y1, x2, y2, r, g, b, a ) {

  var dx = Math.abs( x2 - x1 );
  var dy = Math.abs( y2 - y1 );

  var sx = ( x1 < x2 ) ? 1 : -1;
  var sy = ( y1 < y2 ) ? 1 : -1;

  var err = dx - dy;

  var lx = x1;
  var ly = y1;    

  while ( true ) {

    if ( lx > 0 && lx < w && ly > 0 && ly < h ) {

      setPixel( lx, ly, r, g, b, a );

    }

    if ( ( lx === x2 ) && ( ly === y2 ) )
      break;

    var e2 = 2 * err;

    if ( e2 > -dx ) { 

      err -= dy; 
      lx += sx; 

    }

    if ( e2 < dy ) { 

      err += dx; 
      ly += sy; 

    }

  }

};

//---

function getCirclePosition( centerX, centerY, radius, index, segments ) {

  var angle = index * ( MATHPI2 / segments ) + time;

  var x = centerX + Math.cos( angle ) * radius;
  var y = centerY + Math.sin( angle ) * radius;

  return { x:x, y:y };

};

function drawCircle( centerPosition, radius, segments ) {

  var coordinates = [];

  var radiusSave;
  
  var diff = 0;//Math.floor( Math.random() * segments );

  for ( var i = 0; i <= segments; i++ ) {

    //var radiusRandom = radius + Math.random() * ( radius / 8 );
    //var radiusRandom = radius + Math.random() * ( radius / 32 );
    var radiusRandom = radius;// + ( radius / 8 );

    if ( i === 0 ) {

      radiusSave = radiusRandom;

    }

    if ( i === segments ) {

      radiusRandom = radiusSave;

    }

    var centerX = centerPosition.x;
    var centerY = centerPosition.y;

    var position = getCirclePosition( centerX, centerY, radiusRandom, i, segments );

    coordinates.push( { x:position.x, y:position.y, index:i + diff, radius:radiusRandom, segments:segments } );

  }

  return coordinates;

};

function addCircleSegment( x, y, z, audioBufferIndex ) {

  var circleSegment = {};
      circleSegment.x = x;
      circleSegment.y = y;
      //circleSegment.z = z;
      circleSegment.x2d = 0;
      circleSegment.y2d = 0;
      circleSegment.audioBufferIndex = audioBufferIndex;

  return circleSegment;

};

function addCircles() {

  var audioBufferIndexMin = 8;
  var audioBufferIndexMax = 1024;
  var audioBufferIndex = audioBufferIndexMin;

  var centerPosition = { x:0, y:0 };
  var center  = { x:0, y:0 };
  
  var toggle = 1;
  var index = 0;
  var audioIndex = audioBufferIndexMin;
  
  var mp = { x:Math.random() * w, y:Math.random() * h };
  
  for ( var z = -fov; z < fov; z += 5 ) { 

    var coordinates = drawCircle( centerPosition, 75, 64 );

    var circleObj = {};
        circleObj.segmentsOutside = [];
        circleObj.segmentsInside = [];
        circleObj.segmentsInside2 = [];
        circleObj.segmentsCount = 0;
        circleObj.index = index;
        //circleObj.audioIndex = audioIndex;
        circleObj.z = z;
        circleObj.center = center;
        circleObj.circleCenter = { x:0, y:0 };
        circleObj.mp = { x:mp.x, y:mp.y };
        circleObj.radius = coordinates[ 0 ].radius;
        //circleObj.radiusAudio = circleObj.radius;
        circleObj.color = { r:0, g:0, b:0 };

    //toggle = index % 4;
    toggle = index % 2;
    index++;
    
    if ( z < 0 ) {
    
      audioIndex++;
    
    } else {
    
      audioIndex--;
    
    }
    
    audioBufferIndex = Math.floor( Math.random() * audioBufferIndexMax ) + audioBufferIndexMin;  
    //audioBufferIndex = audioBufferIndexMin;
    
    var circleSegmentOutside;

    for ( var i = 0, l = coordinates.length; i < l; i++ ) { 

      var coordinate = coordinates[ i ];
    
      //if ( i % 4 === toggle && i % 2 === 1 ) {
      if ( i % 2 === toggle ) {
      
        circleSegmentOutside = addCircleSegment( coordinate.x, coordinate.y, z, audioBufferIndex );
        circleSegmentOutside.active = true;
        circleSegmentOutside.index = coordinate.index;
        circleSegmentOutside.radius = coordinate.radius;
        circleSegmentOutside.radiusAudio = circleSegmentOutside.radius;// + Math.random() * 15;
        circleSegmentOutside.segments = coordinate.segments;
        circleSegmentOutside.coordinates = [];

        var co;

        if ( i > 0 ) {

          co = coordinates[ i - 1 ];

        } else {

          co = coordinates[ l - 1 ];

        }

        var sub1 = addCircleSegment( co.x, co.y, z, audioBufferIndex );
        var sub2 = addCircleSegment( coordinate.x, coordinate.y, z - 5, audioBufferIndex );
        var sub3 = addCircleSegment( co.x, co.y, z - 5, audioBufferIndex );
        
        var sub4 = addCircleSegment( coordinate.x, coordinate.y, z, audioBufferIndex );
        var sub5 = addCircleSegment( co.x, co.y, z, audioBufferIndex );
        var sub6 = addCircleSegment( coordinate.x, coordinate.y, z - 5, audioBufferIndex );
        var sub7 = addCircleSegment( co.x, co.y, z - 5, audioBufferIndex );

        sub1.index = co.index;
        sub2.index = coordinate.index;
        sub3.index = co.index;
        
        sub4.index = coordinate.index;
        sub5.index = co.index;
        sub6.index = coordinate.index;
        sub7.index = co.index;

        circleSegmentOutside.subs = [];
        circleSegmentOutside.subs.push( sub1, sub2, sub3, sub4, sub5, sub6, sub7 );

        //audioBufferIndex = Math.floor( Math.random() * audioBufferIndexMax ) + audioBufferIndexMin;

        if ( i < l - 1 ) {

          audioBufferIndex = Math.floor( Math.random() * audioBufferIndexMax ) + audioBufferIndexMin;

        } else {

          audioBufferIndex = circleObj.segmentsOutside[ 0 ].audioBufferIndex;

        }
        
        circleObj.segmentsOutside.push( circleSegmentOutside );
      
      } else {
      
        circleObj.segmentsOutside.push( { active:false } );

      }

    }

    circleHolder.push( circleObj );

  }

};

//---

function onResize(){
    
  w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

  canvas.width = w;
  canvas.height = h;

  context.fillStyle = '#000000';
  context.fillRect( 0, 0, w, h );

  imageData = context.getImageData( 0, 0, w, h );
  data = imageData.data;

};

//---

function audioBtHandler( event ) {

  if ( audio.paused ) {

    audio.play();
    
    btStart.innerHTML = 'Pause Audio';

  } else {

    audio.pause();
    
    btStart.innerHTML = 'Play Audio';

  }

};

//---

function mouseDownHandler( event ) {

  mouseDown = true;

};

function mouseUpHandler( event ) {

  mouseDown = false;

};

function mouseEnterHandler( event ) {

  mouseActive = true;

};

function mouseLeaveHandler( event ) {

  mouseActive = false;

  //mousePos.x = w / 2;
  //mousePos.y = h / 2;

  mouseDown = false;

};

function mouseMoveHandler( event ) {

  mousePos = getMousePos( canvas, event );

};

function getMousePos( canvas, event ) {

  var rect = canvas.getBoundingClientRect();

  return { x:event.clientX - rect.left, y:event.clientY - rect.top };

};
            
//---            

function render() {

  var aa = false;
  
  if ( analyser ) {
  
    aa = true;
  
  }

  var frequencySource;
  
  if ( aa === true ) {
  
    frequencySource = new Uint8Array( analyser.frequencyBinCount );

    analyser.getByteFrequencyData( frequencySource );
  
  }

  //---

  var sortArray = false;
  
  //---
  
  var col = getRGBColor2( rgb );
  var col2 = getRGBColor( rgb2 );
  
  limitRGBColor( col, 0.45 );
  limitRGBColor( col2, 0.25 );
  
  //---
  
  for ( var i = 0, l = circleHolder.length; i < l; i++ ) {

    var circleObj = circleHolder[ i ];

    circleObj.color.r = col.r - ( circleObj.z + fov ) / fov;
    circleObj.color.g = col.g - ( circleObj.z + fov ) / fov;
    circleObj.color.b = col.b - ( circleObj.z + fov ) / fov;

    //circleObj.color.r = Math.floor( ( ( ( col.r - circleObj.z + fov ) ) + ( col2.r - circleObj.z + fov ) ) / 2 );
    //circleObj.color.g = Math.floor( ( ( ( col.g - circleObj.z + fov ) ) + ( col2.g - circleObj.z + fov ) ) / 2 );
    //circleObj.color.b = Math.floor( ( ( ( col.b - circleObj.z + fov ) ) + ( col2.b - circleObj.z + fov ) ) / 2 );


    if ( circleObj.color.r < col2.r ) {

      circleObj.color.r = col2.r;

    }

    if ( circleObj.color.g < col2.g ) {

      circleObj.color.g = col2.g;

    }

    if ( circleObj.color.b < col2.b ) {

      circleObj.color.b = col2.b;

    }


    var circleObjBack;

    if ( i > 0 ) {

      circleObjBack = circleHolder[ i - 1 ];

    }

    //---

    if ( mouseActive ) {

      circleObj.mp = mousePos;

    } else {

      circleObj.mp.x += ( ( w / 2 ) - circleObj.mp.x ) * 0.00025;
      circleObj.mp.y += ( ( h / 2 ) - circleObj.mp.y ) * 0.00025;

    }

    //circleObj.center.x = ( ( w / 2 ) - circleObj.mp.x ) * ( -i / 150 ) + w / 2;
    //circleObj.center.y = ( ( h / 2 ) - circleObj.mp.y ) * ( -i / 150 ) + h / 2;

    circleObj.center.x = ( ( w / 2 ) - circleObj.mp.x ) * ( ( circleObj.z - fov ) / 500 ) + w / 2;
    circleObj.center.y = ( ( h / 2 ) - circleObj.mp.y ) * ( ( circleObj.z - fov ) / 500 ) + h / 2;

    //---

    if ( aa === true ) {

      //var f = frequencySource[ Math.floor(circleObj.z + fov) ];
      //var f = frequencySource[ i ];
      //var f = frequencySource[ circleObj.audioIndex ];
      //var fAdd = (f / 25);// * ( (circleObj.z - fov) / 200 );

      //circleObj.radiusAudio = fAdd;

    }

    //---

    for ( var j = 0, k = circleObj.segmentsOutside.length; j < k; j++ ) {

      var circleSegmentOutside = circleObj.segmentsOutside[ j ];

      if ( circleSegmentOutside.active === true ) {

        //---

        var scale = fov / ( fov + circleObj.z ); 
        var scaleBack;

        if ( i > 0 ) {

          scaleBack = fov / ( fov + circleObjBack.z ); 

        }

        var frequency, frequencyAdd;

        circleSegmentOutside.x2d = ( circleSegmentOutside.x * scale ) + circleObj.center.x;
        circleSegmentOutside.y2d = ( circleSegmentOutside.y * scale ) + circleObj.center.y;

        //---

        if ( aa === true ) {

          frequency = frequencySource[ circleSegmentOutside.audioBufferIndex ];
          frequencyAdd = frequency / 20;

          //---

          circleSegmentOutside.radiusAudio = circleSegmentOutside.radius - frequencyAdd;

        } 
        
        //---

        var lineColorValue = 0;

        if ( j > 0 ) {

          if ( aa === true && audio.paused === false ) {

            lineColorValue = Math.round( i / l * ( 55 + frequency ) );//255 

            if ( lineColorValue > 255 ) {

              lineColorValue = 255;

            }

          } else {

            lineColorValue = Math.round( i / l * 200 );//255 

          }

        }

        //---

        if ( i > 0 && i < l - 1 ) {

          var sub1 = circleSegmentOutside.subs[ 0 ];
          var sub1angle = sub1.index * ( MATHPI2 / circleSegmentOutside.segments ) + time;
              sub1.x2d = ( sub1.x * scale ) + circleObj.center.x;
              sub1.y2d = ( sub1.y * scale ) + circleObj.center.y;
              sub1.x = circleObj.circleCenter.x + Math.cos( sub1angle ) * circleSegmentOutside.radiusAudio;
              sub1.y = circleObj.circleCenter.y + Math.sin( sub1angle ) * circleSegmentOutside.radiusAudio;

          var sub2 = circleSegmentOutside.subs[ 1 ];
         	var sub2angle = sub2.index * ( MATHPI2 / circleSegmentOutside.segments ) + time;
              sub2.x2d = ( sub2.x * scaleBack ) + circleObjBack.center.x;
              sub2.y2d = ( sub2.y * scaleBack ) + circleObjBack.center.y;
              sub2.x = circleObj.circleCenter.x + Math.cos( sub2angle ) * circleSegmentOutside.radiusAudio;
              sub2.y = circleObj.circleCenter.y + Math.sin( sub2angle ) * circleSegmentOutside.radiusAudio;
              
          var sub3 = circleSegmentOutside.subs[ 2 ];
         	var sub3angle = sub3.index * ( MATHPI2 / circleSegmentOutside.segments ) + time;
              sub3.x2d = ( sub3.x * scaleBack ) + circleObjBack.center.x;
              sub3.y2d = ( sub3.y * scaleBack ) + circleObjBack.center.y;
              sub3.x = circleObj.circleCenter.x + Math.cos( sub3angle ) * circleSegmentOutside.radiusAudio;
              sub3.y = circleObj.circleCenter.y + Math.sin( sub3angle ) * circleSegmentOutside.radiusAudio;

					var sub4 = circleSegmentOutside.subs[ 3 ];
         	var sub4angle = sub4.index * ( MATHPI2 / circleSegmentOutside.segments ) + time;
              sub4.x2d = ( sub4.x * scale ) + circleObj.center.x;
              sub4.y2d = ( sub4.y * scale ) + circleObj.center.y;
							sub4.x = circleObj.circleCenter.x + Math.cos( sub4angle ) * circleSegmentOutside.radius;
              sub4.y = circleObj.circleCenter.y + Math.sin( sub4angle ) * circleSegmentOutside.radius;

					var sub5 = circleSegmentOutside.subs[ 4 ];
         	var sub5angle = sub5.index * ( MATHPI2 / circleSegmentOutside.segments ) + time;
              sub5.x2d = ( sub5.x * scale ) + circleObj.center.x;
              sub5.y2d = ( sub5.y * scale ) + circleObj.center.y;
							sub5.x = circleObj.circleCenter.x + Math.cos( sub5angle ) * circleSegmentOutside.radius;
              sub5.y = circleObj.circleCenter.y + Math.sin( sub5angle ) * circleSegmentOutside.radius;
              
         var sub6 = circleSegmentOutside.subs[ 5 ];
         var sub6angle = sub6.index * ( MATHPI2 / circleSegmentOutside.segments ) + time;
             sub6.x2d = ( sub6.x * scaleBack ) + circleObjBack.center.x;
             sub6.y2d = ( sub6.y * scaleBack ) + circleObjBack.center.y;
						 sub6.x = circleObj.circleCenter.x + Math.cos( sub6angle ) * circleSegmentOutside.radius;
             sub6.y = circleObj.circleCenter.y + Math.sin( sub6angle ) * circleSegmentOutside.radius; 
          
         var sub7 = circleSegmentOutside.subs[ 6 ];
         var sub7angle = sub7.index * ( MATHPI2 / circleSegmentOutside.segments ) + time;
             sub7.x2d = ( sub7.x * scaleBack ) + circleObjBack.center.x;
             sub7.y2d = ( sub7.y * scaleBack ) + circleObjBack.center.y;
						 sub7.x = circleObj.circleCenter.x + Math.cos( sub7angle ) * circleSegmentOutside.radius;
             sub7.y = circleObj.circleCenter.y + Math.sin( sub7angle ) * circleSegmentOutside.radius;

          var p1;
          var p2;
          var p3;
          var p4;

          var p5 = circleSegmentOutside.subs[ 3 ];
          var p6 = circleSegmentOutside.subs[ 4 ];
          var p7 = circleSegmentOutside.subs[ 6 ];
          var p8 = circleSegmentOutside.subs[ 5 ];
          
          if ( frequencyAdd > 0 ) {
          
            p1 = circleSegmentOutside;
            p2 = circleSegmentOutside.subs[ 1 ];
            p3 = circleSegmentOutside.subs[ 2 ];
            p4 = circleSegmentOutside.subs[ 0 ];
          
          }
          
          var cr = Math.round( circleObj.color.r * lineColorValue );
          var cg = Math.round( circleObj.color.g * lineColorValue );
          var cb = Math.round( circleObj.color.b * lineColorValue );
          
          if ( frequencyAdd > 0 ) {
          
            drawLine( p1.x2d | 0, p1.y2d | 0, p2.x2d | 0, p2.y2d | 0, cr, cg, cb, 255 );
            drawLine( p2.x2d | 0, p2.y2d | 0, p3.x2d | 0, p3.y2d | 0, cr, cg, cb, 255 );
            drawLine( p3.x2d | 0, p3.y2d | 0, p4.x2d | 0, p4.y2d | 0, cr, cg, cb, 255 );
            drawLine( p4.x2d | 0, p4.y2d | 0, p1.x2d | 0, p1.y2d | 0, cr, cg, cb, 255 );
            
            drawLine( p5.x2d | 0, p5.y2d | 0, p1.x2d | 0, p1.y2d | 0, cr, cg, cb, 255 );
            drawLine( p6.x2d | 0, p6.y2d | 0, p4.x2d | 0, p4.y2d | 0, cr, cg, cb, 255 );
            drawLine( p7.x2d | 0, p7.y2d | 0, p3.x2d | 0, p3.y2d | 0, cr, cg, cb, 255 );
            drawLine( p8.x2d | 0, p8.y2d | 0, p2.x2d | 0, p2.y2d | 0, cr, cg, cb, 255 );

          }

          if ( circleObj.z < fov / 2 ) {

            drawLine( p5.x2d | 0, p5.y2d | 0, p6.x2d | 0, p6.y2d | 0, cr, cg, cb, 255 );
            drawLine( p6.x2d | 0, p6.y2d | 0, p7.x2d | 0, p7.y2d | 0, cr, cg, cb, 255 );
            drawLine( p7.x2d | 0, p7.y2d | 0, p8.x2d | 0, p8.y2d | 0, cr, cg, cb, 255 );
            drawLine( p8.x2d | 0, p8.y2d | 0, p5.x2d | 0, p5.y2d | 0, cr, cg, cb, 255 );
          
          }

        }

        //---

        var circleSegmentOutsideangle;
        
        //if ( j < k - 1 ) {
        
        	circleSegmentOutsideangle = circleSegmentOutside.index * ( MATHPI2 / circleSegmentOutside.segments ) + time;

          circleSegmentOutside.x = circleObj.circleCenter.x + Math.cos( circleSegmentOutsideangle ) * circleSegmentOutside.radiusAudio;
          circleSegmentOutside.y = circleObj.circleCenter.y + Math.sin( circleSegmentOutsideangle ) * circleSegmentOutside.radiusAudio;
          
        /*} else {
        	
          var circleSegmentOutside1 = circleObj.segmentsOutside[ 0 ];
          
          circleSegmentOutsideangle = circleSegmentOutside1.index * ( MATHPI2 / circleSegmentOutside1.segments ) + time;
          
          circleSegmentOutside.x = circleObj.circleCenter.x + Math.cos( circleSegmentOutsideangle ) * circleSegmentOutside1.radiusAudio;
          circleSegmentOutside.y = circleObj.circleCenter.y + Math.sin( circleSegmentOutsideangle ) * circleSegmentOutside1.radiusAudio;
          
       	}
        */
        
        
        

        //---
        /*
      if ( i > 0 && i < l - 1 ) {
      //if ( i > 0 && i < l - 1 && j < k - 1 ) {

        var circleSegmentOutsideLineBack;// = circleObjBack[ j ];
        var circleSegmentInsideLineBack;

        //if ( j === 0 ) {

          //pB = circleObjBack.segments[ circleObjBack.segments.length - 1 ];

        //} else {

          //pB = circleObjBack.segments[ j - 1 ];

        //}

        circleSegmentOutsideLineBack = circleObjBack.segmentsOutside[ j ];
        circleSegmentInsideLineBack = circleObjBack.segmentsInside[ j ];

        //drawLine( circleSegmentOutside.x2d | 0, circleSegmentOutside.y2d | 0, circleSegmentOutsideLineBack.x2d | 0, circleSegmentOutsideLineBack.y2d | 0, 0, Math.round( lineColorValue / 2 ), lineColorValue, 255 );
        //drawLine( circleSegmentInside.x2d | 0, circleSegmentInside.y2d | 0, circleSegmentInsideLineBack.x2d | 0, circleSegmentInsideLineBack.y2d | 0, 0, Math.round( lineColorValue / 2 ), lineColorValue, 255 );

      }
      */


      }
      
    }

    if ( mouseDown ) {

      circleObj.z += speed;

      if ( circleObj.z > fov ) {

        circleObj.z -= ( fov * 2 );

        sortArray = true;

      }

    } else {

      circleObj.z -= speed;

      if ( circleObj.z < -fov ) {

        circleObj.z += ( fov * 2 );

        sortArray = true;

      }

    }

  }

  //---

  if ( sortArray ) {

    circleHolder = circleHolder.sort( function( a, b ) {

      return ( b.z - a.z );

    } );

  }

  //---

  if ( mouseDown ) {

    time -= 0.005;

  } else {

    time += 0.005;

  }

  //---

  //soft invert colors
  if ( mouseDown ) {

    if ( colorInvertValue < 255 )
      colorInvertValue += 5;
    else
      colorInvertValue = 255;

    softInvert( colorInvertValue );

  } else {

    if ( colorInvertValue > 0 )
      colorInvertValue -= 5;
    else
      colorInvertValue = 0;

    if ( colorInvertValue > 0 )
      softInvert( colorInvertValue );

  }

};

//---

function softInvert( value ) {

  for ( var j = 0, n = data.length; j < n; j += 4 ) {

    data[ j ]     = Math.abs( value - data[ j ] );     // red
    data[ j + 1 ] = Math.abs( value - data[ j + 1 ] ); // green
    data[ j + 2 ] = Math.abs( value - data[ j + 2 ] ); // blue
    data[ j + 3 ] = 255;// - data[ j + 3 ]; // alpha

  }

};

//---


function clearImageData() {
  for (var i = 0, l = data.length; i < l; i += 4) {
    data[i] = 0;
    data[i + 1] = 0;
    data[i + 2] = 0;
    data[i + 3] = 255;
  }
}
function render() {
  var frequencyData = new Uint8Array(analyserBufferLength);
  analyser.getByteFrequencyData(frequencyData);

  var centerX = w / 2;
  var centerY = h / 2;

  for (var i = 0, l = circleHolder.length; i < l; i++) {
    var circleObj = circleHolder[i];
    
    var freqIndex = Math.floor(i / l * analyserBufferLength);
    circleObj.radiusAudio = circleObj.radius + frequencyData[freqIndex] / 256 * 100;

    for (var j = 0, k = circleObj.segments; j < k; j++) {
      var angle = (j / k) * MATHPI2 + time;
      var x = centerX + Math.cos(angle) * circleObj.radiusAudio;
      var y = centerY + Math.sin(angle) * circleObj.radiusAudio;
      
      if (j > 0) {
        var prevAngle = ((j - 1) / k) * MATHPI2 + time;
        var prevX = centerX + Math.cos(prevAngle) * circleObj.radiusAudio;
        var prevY = centerY + Math.sin(prevAngle) * circleObj.radiusAudio;
        
        drawLine(
          prevX | 0, 
          prevY | 0, 
          x | 0, 
          y | 0, 
          255, 255, 255, 255
        );
      }
    }
  }
}

function drawLine(x1, y1, x2, y2, r, g, b, a) {
  var dx = Math.abs(x2 - x1);
  var dy = Math.abs(y2 - y1);
  var sx = (x1 < x2) ? 1 : -1;
  var sy = (y1 < y2) ? 1 : -1;
  var err = dx - dy;

  while (true) {
    setPixel(x1, y1, r, g, b, a);

    if (x1 === x2 && y1 === y2) break;
    var e2 = 2 * err;
    if (e2 > -dy) { err -= dy; x1 += sx; }
    if (e2 < dx) { err += dx; y1 += sy; }
  }
}

function setPixel(x, y, r, g, b, a) {
  var i = (x + y * w) * 4;
  data[i] = r;
  data[i + 1] = g;
  data[i + 2] = b;
  data[i + 3] = a;
}
//---
function animate() {
  clearImageData();
  render();
  context.putImageData(imageData, 0, 0);
  requestAnimationFrame(animate);
}