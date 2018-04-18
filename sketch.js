// display the video 
// play the specific music 
// background emojis 
//clapping 


var face = [];
var position = {x:0, y:0};
var scale = 0;
var orientation = {x:0, y:0, z:0};
var mouthWidth = 0;
var mouthHeight = 0;
var eyebrowLeft = 0;
var eyebrowRight = 0;
var eyeLeft = 0;
var eyeRight = 0;
var jaw = 0;
var nostrils = 0;
var img;
var capture;
var laugh;
var cry;
var anger;
var mouth;
var applause;
var imgLaugh;
var imgCry;

function setup() {
  	createCanvas(900, 900);
	setupOsc(8338, 3334);
	capture = createCapture(VIDEO);
	capture.size(320, 240);

	imgLaugh = loadImage('images/laughemojii.png');
	imgCry = loadImage('images/sademoji.png');

	laugh = loadSound('images/laughing.mp3');
	laugh.setLoop(true);

	cry = loadSound('images/crying.mp3');
	cry.setLoop(true);

	applause = loadSound('images/applause.mp3');
	applause.setLoop(true);

}

function draw() {
	background('black');
	image(capture, 0, 0, 300, 300);
	image(capture, 0, 300, 300, 300);
	image(capture, 0, 600, 300, 300);
	image(capture, 300, 0, 300, 300);
	image(capture, 600, 0, 300, 300);
	image(capture, 300, 300, 300, 300);
	image(capture, 600, 300, 300, 300);
	image(capture, 300, 600, 300, 300);
	image(capture, 600, 600, 300, 300);

	//image(capture, 400, 400, 320, 240);

	// FACE_OUTLINE : 0 - 16
	// LEFT_EYEBROW : 17 - 21
	// RIGHT_EYEBROW : 22 - 26
	// NOSE_BRIDGE : 27 - 30
	// NOSE_BOTTOM : 31 - 35
	// LEFT_EYE : 36 - 41
	// RIGHT_EYE : 42 - 47
	// INNER_MOUTH : 48 - 59
	// OUTER_MOUTH : 60 - 65

	if(mouthHeight>4 && !laugh.isPlaying()){
		laugh.play();
	}

	if(mouthHeight<=4 && laugh.isPlaying()){
		laugh.pause();
	}

	if(mouthHeight>4){
		image(imgLaugh, 150, 150, 100, 100);
		image(imgLaugh, 450, 150, 100, 100);	
		image(imgLaugh, 750, 150, 100, 100);	
		image(imgLaugh, 150, 450, 100, 100);	
		image(imgLaugh, 150, 750, 100, 100);	
		image(imgLaugh, 750, 450, 100, 100);
		image(imgLaugh, 450, 750, 100, 100);	
		image(imgLaugh, 750, 750, 100, 100);	
		image(imgLaugh, 450, 450, 100, 100);		
	}

	if(eyebrowLeft>8 && !cry.isPlaying()){
		cry.play();	
	}

	if(eyebrowLeft<=8 && cry.isPlaying()){
		cry.pause();
	}

	if (eyebrowLeft>8){
		image(imgCry, 150, 150, 100, 100);
		image(imgCry, 450, 150, 100, 100);	
		image(imgCry, 750, 150, 100, 100);	
		image(imgCry, 150, 450, 100, 100);	
		image(imgCry, 150, 750, 100, 100);	
		image(imgCry, 750, 450, 100, 100);
		image(imgCry, 450, 750, 100, 100);	
		image(imgCry, 750, 750, 100, 100);	
		image(imgCry, 450, 450, 100, 100);
	}

	//if(NOFACEDETECTED == 0 && !applause.isPlaying()){
		//applause.play();
	//}

	//if(NOFACEDETECTED>0 && applause.isPlaying()){
	//	applause.pause();
	//}

	//mouth = map(mouthHeight, 1, 3, 200, 600);
	//imageMode(CENTER);
	//image(img, position.x, position.y, mouth/9, mouth/9);	
	
}

function receiveOsc(address, value) {
	if (address == '/raw') {
		face = [];
		for (var i=0; i<value.length; i+=2) {
			face.push({x:value[i], y:value[i+1]});
		}
	}
	else if (address == '/pose/position') {
		position = {x:value[0], y:value[1]};
	}
	else if (address == '/pose/scale') {
		scale = value[0];
	}
	else if (address == '/pose/orientation') {
		orientation = {x:value[0], y:value[1], z:value[2]};
	}
	else if (address == '/gesture/mouth/width') {
		mouthWidth = value[0];
	}
	else if (address == '/gesture/mouth/height') {
		mouthHeight = value[0];
		//print(mouthHeight);
		//console.log(MouthHeight);
	}
	else if (address == '/gesture/eyebrow/left') {
		eyebrowLeft = value[0];
		//print(eyebrowLeft);
	}
	else if (address == '/gesture/eyebrow/right') {
		eyebrowRight = value[0];
		//print(eyebrowRight);
	}
	else if (address == '/gesture/eye/left') {
		eyeLeft = value[0];
	}

	else if (address == '/gesture/eye/right') {
		eyeRight = value[0];
		//print(eyeRight);
	}
	else if (address == '/gesture/jaw') {
		jaw = value[0];
	}
	else if (address == '/gesture/nostrils') {
		nostrils = value[0];
	}
}

function setupOsc(oscPortIn, oscPortOut) {
	var socket = io.connect('http://127.0.0.1:8081', { port: 8081, rememberTransport: false });
	socket.on('connect', function() {
		socket.emit('config', {	
			server: { port: oscPortIn,  host: '127.0.0.1'},
			client: { port: oscPortOut, host: '127.0.0.1'}
		});
	});
	socket.on('message', function(msg) {
		if (msg[0] == '#bundle') {
			for (var i=2; i<msg.length; i++) {
				receiveOsc(msg[i][0], msg[i].splice(1));
			}
		} else {
			receiveOsc(msg[0], msg.splice(1));
		}
	});
}