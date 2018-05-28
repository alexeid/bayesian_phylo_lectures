var plotVertices = true;
var plotCoalescence = true;
var plotCoalescenceCounts = true;

var trace = [];
var theta = 0;
var delayInMillis = 100;

// line width of lines tracing whole population ancestry
var ancestryLineWidth = 0.5;

// line width of the lines tracing the coalescent ancestry
var coalescentTraceLineWidth = 1.5;

// line width of the lines marking each coalescent event
var coalescentEventLineWidth = 1.0;


// SIMULATION PARAMETERS

// the number of generations
var G = 64;

// sample size
var sampleSize = 5;


// POPULATION SIZE FUNCTION PARAMETERS

// the population size
var N = 32;

// the population size at bottleneck
var bottleneck = 8;

// the time in generations betweens successive bottlenecks
var wavelength = 16;


var Key = {
  LEFT:   37,
  UP:     38,
  RIGHT:  39,
  DOWN:   40
};

// the canvas
var canvas;

// the canvas context
var ctx;

// counts of coalescent events
var coalescentCounts = [];

// signifies that new generation added and coalescent events not yet counted
var readyForCoalescentCounts = false;

window.onresize = function(event) {
	initCanvasAndContext();
	drawWrightFisher();
};

window.onload = function() {

	initCanvasAndContext();

	// bind all controls

	// bind animation speed input control
	var animationSpeedInput = document.getElementById('animationSpeed');
	animationSpeedInput.oninput = function () {
    	setAnimationSpeed(animationSpeedInput.value);
	};
	setAnimationSpeed(animationSpeedInput.value);

	
	// bind sample size input control
	var sampleSizeInput = document.getElementById('sampleSize');
	sampleSizeInput.oninput = function () {
    	setSampleSize(sampleSizeInput.value);
    	clearCoalescentDensity();
		drawWrightFisher();
	};
	setSampleSize(sampleSizeInput.value);

	// bind N input control
	var NInput = document.getElementById('N');
	NInput.oninput = function () {
    	setN(NInput.value);
	};
	N = parseInt(NInput.value);
	
	// bind G input control
	var GInput = document.getElementById('G');
	GInput.oninput = function () {
    	setG(GInput.value);
	};
	G = parseInt(GInput.value);

	// bind wavelength input control
	var wavelengthInput = document.getElementById('wavelength');
	wavelengthInput.oninput = function () {
    	setWavelength(parseInt(wavelengthInput.value));
	};
	wavelength = parseInt(wavelengthInput.value);

	// bind bottleneck input control
	var bottleneckInput = document.getElementById('N_bottleneck');
	bottleneckInput.oninput = function () {
    	setBottleneck(bottleneckInput.value);
	};
	bottleneck = parseInt(bottleneckInput.value);

	clearCoalescentDensity();
		
	window.addEventListener('keydown', function(evt) {
								
		switch (evt.keyCode) {
			case Key.UP:
				setG(G + 1);
				break;
			case Key.DOWN:
				if (G > 2) {
				  setG(G - 1);
				}
				break;
			case Key.LEFT:
				if (N > 2) {
				  setN(N - 1);
				}
				break;
			case Key.RIGHT:
				  setN(N + 1);
				break;
			default:
		}
	});
	
	window.addEventListener('keypress', function(evt) { 
		if (evt.key == 'n') {
			addGenerationGenerateAndDraw();
		}

		if (evt.key == 'v') {
			vertex = !vertex;
			drawWrightFisher();
		}

	});

    var popFuncInputEl = document.getElementById("customPopFunc");
    var radioButtons = document.querySelectorAll("input[name='popfunc']");
    function handler(e) {
        popFuncInputEl.disabled = !(e.target.value == "custom");
    }

    for (i=0; i<radioButtons.length; i++)
        radioButtons[i].addEventListener("change", handler);

	pop = initialPopulation(1, N);
	advance(1);
};

var intervalId = null;
 
function run() {
	if (intervalId === null) {
		intervalId = setInterval(nextGeneration, delayInMillis);
	}
}

function initCanvasAndContext() {
    // Computes the canvas size based on the dimension of the parent div
    var container = document.getElementById("canvas-container");
    var bbox = container.getBoundingClientRect();

	canvas = document.getElementById("canvas"); // grabs the canvas element
    canvas.setAttribute("width", bbox.width);
    //canvas.setAttribute("height", bbox.height);

	ctx = canvas.getContext("2d"); // returns the 2d context object
}
  
function stop() {
	if (isRunning()) {
		clearInterval(intervalId);
		intervalId = null;
	}
}

function isRunning() {
	return (intervalId !== null);
}

// set the number of generations to plot
function setG(g) {
	G = parseInt(g);
	clearCoalescentDensity();
	advance(1);
}

// set the maximum population size
function setN(n) {
	N = parseInt(n);
	clearCoalescentDensity();
	advance(1);
}

function setWavelength(w) {
	wavelength = w;
	theta = 0;
	drawWrightFisher();	
}

function setBottleneck(b) {
	bottleneck = b;			
	advance(1);
}

// Set the animation speed (speed is measured in generations per second)
function setAnimationSpeed(speed) {
	delayInMillis = 1000/speed;	
	if (isRunning()) {
		stop();
		run();
	}
}

function getPopSize(N, amp, theta) {

    theta = theta % (2*Math.PI);

    switch(document.querySelector("input[name='popfunc']:checked").value) {
        case "sinusoid":
            return (N - amp/2) + amp * Math.cos(theta)/2;

        case "squarewave":
            return theta<Math.PI ? N : N - amp;

        case "sawtooth":
            return (N - amp) + amp*(Math.abs(theta/Math.PI - 1));

        case "custom":
            var str = document.getElementById("customPopFunc").value;
            return eval(str);

        default:
    }
}

// calculate the next generation and re-draw the whole wright-fisher population
function nextGeneration() {
	calculateNextGeneration();
	drawWrightFisher();	
}

function calculateNextGeneration() {
	theta = theta + 2 * Math.PI / wavelength;
	
	amplitude =  N - bottleneck;
	
	var Ntheta = Math.round(getPopSize(N, amplitude, theta));
	if (Ntheta < 1) Ntheta = 1;
		
	addGeneration(Ntheta);	
}

// advances G generations n times
function advance(n) {
	for (var j = 1; j <= n; j++) {
		for (var i = 1; i <= G; i++) {
			calculateNextGeneration();
		}
		// accumulate coalescent counts without plotting 
		traceCoalescence(trace, pop[0], null);	
	}
	drawWrightFisher();	
}

//function regenerate() {
//	generateWrightFisher();
//	drawWrightFisher();		
//}

function setPlotVertices(checkbox) {
	plotVertices = checkbox.checked;	
	drawWrightFisher();		
}

function setPlotCoalescence(checkbox) {
    plotCoalescence = checkbox.checked;
    drawWrightFisher();
}

function setSampleSize(s) {
    sampleSize = s;
    
	sample = Math.min(sampleSize,N);
	
	trace = [];
	for (var i = 1; i <= sample; i++) {
		trace.push(i);
	}
}

function setPlotCoalescenceDensity(checkbox) {
    plotCoalescenceCounts = checkbox.checked;
    drawWrightFisher();
}

function clearCoalescentDensity() {
	coalescentCounts = Array.apply(null, Array(G)).map(Number.prototype.valueOf,0);
}

// main function to draw the wright-fisher population
function drawWrightFisher() {
	ctx.fillStyle = "#FFFFFF"; // sets color
	ctx.fillRect(0, 0, width(), height()); // sets top left location points x,y and then width and height
	plotWrightFisher(ctx);

    ctx.strokeStyle = "#FF0000";
    ctx.lineWidth = coalescentTraceLineWidth;
    traceCoalescence(trace, pop[0], ctx);

	ctx.stroke();
	
	x1 = scale * N + xMargin + radius + 1;
	remain = Math.max(1,width() - x1 - 1);
	cScale = remain / Math.max.apply(null, coalescentCounts)
	
	if (plotCoalescenceCounts) {
		ctx.beginPath();
		ctx.lineWidth = scale*0.9;
		ctx.strokeStyle = "#6666FF";
		for (i = 0; i <= G-1; i++) {
			node = pop[i][0];
			
			x2 = x1 + cScale * coalescentCounts[i]
			ctx.moveTo(x1, node.y);
			ctx.lineTo(x2, node.y);
			
		}
		ctx.stroke();
		ctx.lineWidth = ancestryLineWidth;
		ctx.strokeStyle = "#000000";
	}

}

// adds a generation to the population and removes the oldest generation if necessary
function addGeneration(n) {
	
	readyForCoalescentCounts = true;
	
	// the number of generations already simulated
	var ngen = pop.length;
	
	if (ngen == G) {
		tmp = pop[ngen-1];
	} else {
		tmp = [];
	}
	
	lastg = Math.min(G-1,ngen);
	
	// shift current generations up one, but don't go beyond G-1
	for (var i = lastg; i > 0; i--) {
		pop[i] = pop[i-1];	
		
		// update gen numbers
		for (var j = 0; j < pop[i].length; j++) {
			pop[i][j].gen = i;
		}
	}
	
	// resize spare array if necessary
	m  = tmp.length;
	if (m < n) {
	    // add extra elements
	    for (var j = m; j < n; j++) {
	    	tmp.push({label: j + 1});
	    }
	} else if (m > n) {
		// remove last element until it is the right size
		for (var j = n; j < m; j++) {
			tmp[tmp.length-1].parent = null;
			tmp.pop();	
		}
	} 
	pop[0] = tmp;

	// clear old parent links from oldest generation
	for (var j = 0; j < pop[lastg].length; j++) {
		pop[lastg][j].parent = null;
	}
		
	// insert new generation in zero'th row
	for (var j = 0; j < pop[0].length; j++) {
		
		// rewrite data in new generation
		pop[0][j].label = j+1;
		pop[0][j].gen = 0;
		pop[0][j].parent = pop[1][Math.floor((Math.random() * pop[1].length))];
	}	
	
	// sort this generation by parent numbers
	pop[0].sort(function(a, b) {
		return a.parent.num - b.parent.num
	});
	// number this generation after sorting
	for (var j = 0; j < pop[0].length; j++) {
		pop[0][j].num = j;
	}
}

function width() {
	return canvas.width;
}

function height() {
	return canvas.height;
}

function plotWrightFisher(context) {
	scale = Math.min(width() / (N + 1.0), height() / (G + 1.0));
	
	xMargin = (width() - scale * (N + 1.0)) / 2.0
	yMargin = (height() - scale * (G + 1.0)) / 2.0
	radius = scale * 0.23;
	
	var xm = 0;
	var pxm = 0;
	context.beginPath();
	context.strokeStyle = "#808080";
	context.lineWidth = ancestryLineWidth;
	for (i = G-1; i >= 0; i--) {
		// calculate generation specific xm
		
		xm = (width() - scale * (pop[i].length + 2.0)) / 2.0
		for (j = 0; j < pop[i].length; j++) {
			pop[i][j].x = (j+1) * scale + xm
			pop[i][j].y = height() - yMargin - (i+1) * scale

			if (i < G-1) {
				plotParentLine(pop[i][j], context)
			}
		}
		pxm = xm;
	}
	context.stroke();
	
	if (plotVertices) {
		for (i = 0; i <= G-1; i++) {
			// calculate generation specific xm
			xm = (width() - scale * (pop[i].length + 2.0)) / 2.0
			for (j = 0; j < pop[i].length; j++) {
				//text(pop[j-1][i-1].label,i*scale+xMargin, height - yMargin - j*scale)
				
				node = pop[i][j];
				
				context.beginPath();
				context.ellipse(node.x, node.y, radius, radius, 0, 0, 2 * Math.PI)
				context.fill();
				context.stroke();
			}
		}
	}
	
}

function plotParentLine(node, context) {
	if (node["parent"]) {
		p = node.parent;
		context.moveTo(node.x, node.y);
		context.lineTo(p.x, p.y);
	}
}

function plotCoalescentLine(node, context) {
	x1 = scale + xMargin;
	x2 = scale * N + xMargin;
	context.moveTo(x1, node.y);
	context.lineTo(x2, node.y);
}

function initialPopulation(G, N) {
	var arr = [];
	// Creates all generations:
	for (var i = 0; i < G; i++) {
		// Creates an empty line
		arr.push([]);
		// Adds cols to the empty line:
		arr[i].push(new Array(N));
	}
	// populate generations from oldest to most recent
	for (var i = G - 1; i >= 0; i--) {
		for (var j = 0; j < N; j++) {
			// Initializes:
			arr[i][j] = {
				label: j + 1
			};
			arr[i][j].gen = i;
			arr[i][j].num = j;
			if (i < G - 1) {
				arr[i][j].parent = arr[i + 1][Math.floor((Math.random() * N))];
			}
		}
	}
	return arr;
}

function traceCoalescence(labels, gen, context) {
	nodes = [];
	for (var j = 0; j < gen.length; j++) {
		if (labels.indexOf(gen[j].label) > -1) {
			nodes.push(gen[j]);
		}
	}
	traceNodes(nodes, context);
	readyForCoalescentCounts = false;
}

function traceNodes(nodes, context) {
	parents = [];
	if (context !== null) {
		context.beginPath();
		xm = (width() - scale * (pop[nodes[0].gen].length + 2.0)) / 2.0
	}
	for (var j = 0; j < nodes.length; j++) {
		if (context !== null) { plotParentLine(nodes[j], context); }
		if (nodes[j]["parent"]) {
			if (parents.indexOf(nodes[j].parent) === -1) {
				parents.push(nodes[j].parent);
			}
		}
	}
	if (context !== null) context.stroke();
	if (parents.length < nodes.length && parents.length > 0) {
		
		if (plotCoalescence && context !== null) {
			context.strokeStyle = "#0000FF";
			context.lineWidth = coalescentEventLineWidth;
			context.beginPath();
			plotCoalescentLine(parents[0], context);
			context.stroke();
			context.strokeStyle = "#FF0000";
			context.lineWidth = coalescentTraceLineWidth;
		}
		if (readyForCoalescentCounts) { coalescentCounts[parents[0].gen] += 1; }
	}
	if (parents.length > 0) {
		traceNodes(parents, context);
	}
}

function sortPopulation(pop) {
	for (i = (G - 2); i >= 0; i--) {
		gen = pop[i];
				
		// sort this generation by parent numbers
		gen.sort(function(a, b) {
			return a.parent.num - b.parent.num
		});
		// renumber this generation after sorting
		for (var j = 0; j < gen.length; j++) {
			gen[j].num = j;
		}
	}
}
