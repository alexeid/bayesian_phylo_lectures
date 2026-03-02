var container;
var NS="http://www.w3.org/2000/svg";
var scale;
var vertex = true;

var Key = {
  LEFT:   37,
  UP:     38,
  RIGHT:  39,
  DOWN:   40
};

window.onload = function() {

	N = 32;
	G = 64;

    container = document.getElementById("container");
	container.addEventListener('click', function(evt) {
		generateWrightFisher();
		drawWrightFisher();
	}, false);

	window.addEventListener('keydown', function(evt) {
				
		switch (evt.keyCode) {
			case Key.UP:
				G += 1;
				generateWrightFisher();
				break;
			case Key.DOWN:
				if (G > 2) {
				  G -= 1;
				  generateWrightFisher();
				}
				break;
			case Key.LEFT:
				if (N > 2) {
				  N -= 1;
				  generateWrightFisher();
				}
				break;
			case Key.RIGHT:
				N += 1;
				generateWrightFisher();
				break;
			default: ;
		}

		if (evt.key === 'n') {
			addGeneration();
		}
		
		if (evt.key === 'v') {
			vertex = !vertex;
		}

		drawWrightFisher();
	}, false);

    var button = document.getElementById("export");
    button.addEventListener("click", exportSVG);

	generateWrightFisher();

    drawWrightFisher();
};

function exportSVG() {
    var blob = new Blob([container.innerHTML], {type: "image/svg+xml"});
    saveAs(blob, "wrightFisher.svg");
}

function generateWrightFisher() {
	pop = initialPopulation(G, N);
	sortPopulation(pop);
}

function drawWrightFisher() {

    var svg = document.createElementNS(NS, "svg");
    svg.setAttribute("xmlns", NS);
    svg.setAttribute("version","1.1");
    svg.setAttribute('width', window.innerWidth);
    svg.setAttribute('height', window.innerHeight - 10);
    svg.style.strokeWidth = "1.5px";

    plotWrightFisher(svg);

	var trace = [];

	for (var i = 1; i <= N; i++) {
		trace.push(i);
	}
	
	traceCoalescence(trace, pop[0], svg);

    container.innerHTML = "";
    container.appendChild(svg);
}

// adds a generation to the population and removes the oldest generation
function addGeneration() {
	
	var ngen = pop.length;
	
	tmp = pop[ngen-1];
	
	// shift current generations up one
	for (var i = ngen-1; i > 0; i--) {
		pop[i] = pop[i-1];	
		
		// update gen numbers
		for (var j = 0; j < N; j++) {
			pop[i][j].gen = i;
		}
	}
	
	// reuse oldest generation
	pop[0] = tmp;
	
	// insert new generation in zero'th row
	for (var j = 0; j < N; j++) {
		
		// clear old parent links from new oldest generation
		pop[ngen-1][j].parent = null;
		
		// rewrite data in new generation
		pop[0][j].label = j+1;
		pop[0][j].gen = 0;
		pop[0][j].parent = pop[1][Math.floor((Math.random() * N))];
	}	
	
	// sort this generation by parent numbers
	pop[0].sort(function(a, b) {
		return a.parent.num - b.parent.num
	});
	// number this generation after sorting
	for (var j = 0; j < N; j++) {
		pop[0][j].num = j;
	}
}

function width() {
    return window.innerWidth;
}

function height() {
    return window.innerHeight-10;
}

function mouseClicked() {
    pop = initialPopulation(G, N);
    sortPopulation(pop);	
}

function addCircle(x, y, r, fill, stroke, svg) {
    var circle = document.createElementNS(NS, "ellipse");
    circle.setAttribute("cx", x);
    circle.setAttribute("cy", y);
    circle.setAttribute("rx", r);
    circle.setAttribute("ry", r);
    circle.setAttribute("fill", fill);
    circle.setAttribute("stroke",  stroke);
    svg.appendChild(circle);
}

function addLine(x1, y1, x2, y2, stroke, svg) {
    var line = document.createElementNS(NS, "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    line.setAttribute("stroke", stroke);
    svg.appendChild(line);
}

function plotWrightFisher(svg) {

    scale = Math.min(width()/(N+2),height()/(G+2));

    xMargin = (width() - scale*(N+2.0)) / 2.0;
    yMargin = (height() - scale*(G+2)) / 2.0;

    radius = scale * 0.23;

    for (i = 1; i <= N; i++) {
        for (j = 1; j <= G; j++) {

            x = i*scale+xMargin;
            y = height() - yMargin - j*scale;

            plotParentLine(pop[j-1][i-1], "grey", svg);
        }
    }

    if (vertex) {
		for (i = 1; i <= N; i++) {
			for (j = 1; j <= G; j++) {
				x = i*scale+xMargin;
				y = height() - yMargin - j*scale;
	
				//text(pop[j-1][i-1].label,i*scale+xMargin, height - yMargin - j*scale)
	
				addCircle(x, y, radius, "white", "grey", svg);
			}
		}
	}
}

function plotParentLine(node, col, svg) {
    x = (node.num+1)*scale+xMargin;
    y = height() - yMargin - (node.gen+1)*scale;

    if (vertex) addCircle(x, y, radius, col, col, svg);

    if (node.parent) {
        p = node.parent;
        px = (p.num+1)*scale+xMargin;
        py = height() - yMargin - (p.gen+1)*scale;

        addLine(x, y, px, py, col, svg);
    }
}

function plotCoalescentLine(node, svg) {
    x1 = scale+xMargin;
    x2 = scale*N+xMargin;
    y = height() - yMargin - (node.gen+1)*scale;

    addLine(x1, y, x2, y, "blue", svg);

}

function initialPopulation(G, N){

    var arr = [];

    // Creates all generations:
    for(var i=0; i < G; i++){

        // Creates an empty line
        arr.push([]);

        // Adds cols to the empty line:
        arr[i].push( new Array(N));
    }

    // populate generations from oldest to most recent
    for(i=G-1; i >= 0; i--){

        for(var j=0; j < N; j++){
            // Initializes:
            arr[i][j] = {label:j+1};
            arr[i][j].gen = i;
            arr[i][j].num = j;
            if (i<G-1) {
                arr[i][j].parent = arr[i+1][Math.floor((Math.random() * N))];
            }
        }
    }

    return arr;
}

function traceCoalescence(labels, gen, svg) {

    nodes = [];

    for(var j=0; j < N; j++) {
        if (labels.indexOf(gen[j].label) > -1) {
            nodes.push(gen[j]);
        }
    }
    traceNodes(nodes, svg);
}

function traceNodes(nodes, svg) {

    parents = [];

    for(var j=0; j < nodes.length; j++){
        plotParentLine(nodes[j], "red", svg);
        if (nodes[j].parent) {
            if (parents.indexOf(nodes[j].parent) === -1) {
                parents.push(nodes[j].parent);
            }
        }
    }

    if (parents.length < nodes.length && parents.length > 0) {
        plotCoalescentLine(parents[0], svg);	
    }

    if (parents.length > 0) { traceNodes(parents, svg); }
}

function sortPopulation(pop) {

    for (i = (G-2); i >= 0; i--) {
        gen = pop[i];
        // sort this generation by parent numbers
        gen.sort(function(a, b) { return a.parent.num - b.parent.num; });
        // renumber this generation after sorting
        for(var j=0; j < N; j++){
            gen[j].num = j;
        }
    }  
}