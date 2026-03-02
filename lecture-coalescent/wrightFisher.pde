void setup() {
  //createCanvas(windowWidth, windowHeight); 
  size(1000,600);
  background(255);  
  
  N = 32;
  G = 64;
  
  pop = initialPopulation(G, N);
  
  sortPopulation(pop);
} 

void draw() {
  
  stroke(127,127,127);
  strokeWeight(0.5);
  plotWrightFisher();
  
  stroke(255,0,0);
  strokeWeight(1.5);
  traceCoalescence([1,2,3,4,5,6],pop[0]);
}

void mouseClicked() {
  background(255);  
  pop = initialPopulation(G, N);
  sortPopulation(pop);	
}

void plotWrightFisher() {

  scale = min(width/(N+2),height/(G+2));
  
  xMargin = (width - scale*(N+2)) / 2
  yMargin = (height - scale*(G+2)) / 2
  
  pointSize = 7;
  
  for (i = 1; i <= N; i++) {
    for (j = 1; j <= G; j++) {
      
      x = i*scale+xMargin
      y = height - yMargin - j*scale

      plotParentLine(pop[j-1][i-1])
    }
  }
  
  for (i = 1; i <= N; i++) {
    for (j = 1; j <= G; j++) {
      x = i*scale+xMargin
      y = height - yMargin - j*scale

      //text(pop[j-1][i-1].label,i*scale+xMargin, height - yMargin - j*scale)
      ellipse(x, y, pointSize, pointSize)
    }
  }
}

void plotParentLine(node) {
  x = (node.num+1)*scale+xMargin;
  y = height - yMargin - (node.gen+1)*scale;

  if (node["parent"]) {
    p = node.parent;
    px = (p.num+1)*scale+xMargin;
    py = height - yMargin - (p.gen+1)*scale;

    line(x,y,px,py);
  }
}

void plotCoalescentLine(node) {
  x1 = scale+xMargin;
  x2 = scale*N+xMargin;
  y = height - yMargin - (node.gen+1)*scale;
  
  line(x1,y,x2,y);
}

void initialPopulation(G, N){

  var arr = [];

  // Creates all generations:
  for(var i=0; i < G; i++){

      // Creates an empty line
      arr.push([]);

      // Adds cols to the empty line:
      arr[i].push( new Array(N));
  }
  
  // populate generations from oldest to most recent
  for(var i=G-1; i >= 0; i--){

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

void traceCoalescence(labels, gen) {

  nodes = [];
  
  for(var j=0; j < N; j++) {
    if (labels.indexOf(gen[j].label) > -1) {
      nodes.push(gen[j]);
    }
  }
  traceNodes(nodes);
}
  
void traceNodes(nodes) {
  
  parents = [];

  for(var j=0; j < nodes.length; j++){
    plotParentLine(nodes[j]);
    if (nodes[j]["parent"]) {
      if (parents.indexOf(nodes[j].parent) === -1) {
        parents.push(nodes[j].parent);
      }
    }
  }
  
  if (parents.length < nodes.length && parents.length > 0) {
    stroke(0,0,255);
    plotCoalescentLine(parents[0]);	
    stroke(255,0,0);
  }
  
  if (parents.length > 0) { traceNodes(parents); }
}

void sortPopulation(pop) {

  for (i = (G-2); i >= 0; i--) {
    gen = pop[i];
    // sort this generation by parent numbers
    gen.sort(function(a, b) { return a.parent.num - b.parent.num });
    // renumber this generation after sorting
    for(var j=0; j < N; j++){
      gen[j].num = j;
    }
  }  
}
