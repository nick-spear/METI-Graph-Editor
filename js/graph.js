var maxNodeId = 0;
var maxEdgeId = "AAAAA"

var validTypes = {
  "edge" : { "Road":["Road", "AccessRoad", "Highway", "Private"],
             "Railroad":["Railroad", "AccessRail"],
             "PowerLine":["PowerLine", "HighVoltageLine"] },
  "intersectionNode" : ["UnpoweredIntersection", "PoweredIntersection", "AccessPoint", "Border"],
  "buildingNode" : ["Business", "TrainStation", "PowerStation", "SmallBusiness"],
  "agent" : ["Car", "Truck", "Sonic", "Train", "Ambulance", "FireTruck", "Police"]
}

function loadGraphListen() {
  var upload = document.getElementById("loadGraph")

  // Parses file on input selection ('onchange')
  upload.onchange = function(e) {

    // Extracts the file, its name, and its extension for evaluation
    var fileInput = e.target.files;
    var fileName = fileInput[0].name;
    var fileName = fileName.split('.').pop();

    // If not a .txt file, the file is declined
    if (fileName != "txt") {
      window.alert("Load error: Invalid file extension '." + fileName + "'.")
      return;
    }

    // If the file is .txt, we attempt to read it.
    var reader = new FileReader();

    // Evaluation to perform on file once read by 'reader'
    reader.onload = function(ev) {
      fileString = ev.target.result;

      // Attempts to convert file contents into valid JSON.
      var graphIn;
      try {
        graphIn = JSON.parse(fileString)
      } catch (e) {
        window.alert("Load error: Input file could not be parsed as graph.");
        return;
      }

      // If the graph contains no node or edge object containers, we consider it invalid.
      if (!graphIn.nodes || !graphIn.edges) {
        window.alert("Load error: Invalid graph from parsed input file.");
        return;
      }

      // TODO Iterate through nodes/edges to verify validity of each

      // Constructs new graph with node and edge arrays, effectively ignoring
      // any other inserted data members.
      var cg = { nodes: graphIn.nodes,
                 edges: graphIn.edges,
                 adjList: { }
               };

      setGraph(cg);


    }

    reader.readAsText(fileInput[0]);

  }
}

/**
 *  Initializes the graph, draws the nodes and edges and adds
 *  their group elements, such as menus and status flags.
 *  @param {graph} inGraph Graph to be set and loaded.
 */
function setGraph(currentGraph) {
  editMode = 1;

  var body = document.getElementById("body");
  var svg = document.getElementById("svgBody");
  var innerG = document.createElementNS("http://www.w3.org/2000/svg", "g")

  svg.innerHTML = "";

  innerG.setAttribute("id", "innerSVG")

  // Adds edge line elements
  for (var id in currentGraph.edges) {

    var newEdge = currentGraph.edges[id]
    newEdge.id = id
    addEdge(innerG, newEdge, currentGraph)

  }


  /*
    This loop adds the node group elements, menus, and status flags. First are
    the if-else statements to check the type of the node, then the node label is
    added. Right now, the label is just the node's id number. Next the menus are
    added, the menu buttons are added to the menus, and then the status flags
    are added to the nodes.
  */
  for (var id in currentGraph.nodes) {
    var newNode = currentGraph.nodes[id]
    newNode.id = id;
    addNode(innerG, newNode, 1)
  }
  svg.appendChild(innerG);

  for (var id in currentGraph.nodes) { addNodeHover(id, currentGraph.nodes[id].type); }
  for (var id in currentGraph.edges) { addEdgeHover(id); }
}

function addNode(container, newNode, init) {
  if (newNode.id > maxNodeId) {maxNodeId = newNode.id}
  // Creates and appends node with text element
  var nodeShape,
      nodeG = document.createElementNS("http://www.w3.org/2000/svg", "g"),
      id = newNode.id,
      xCoord = parseInt(newNode.cx),
      yCoord = parseInt(newNode.cy);

  /*
    This if statement checks to see if the node's type is 'PoweredIntersection'
    or 'UnpoweredIntersection', and if it is, sets the shape and size, before
    finishing with a nested if-else statement to set the color, blue for a
    PoweredIntersection, and red for an UnpoweredIntersection.
    (PoweredIntersections are streetlights, and UnpoweredIntersections are
     stop signs)
  */


  if (newNode.type == "PoweredIntersection") {
    nodeShape = document.createElementNS("http://www.w3.org/2000/svg", "circle");

    //the node's attributes
    nodeShape.setAttribute("id", id);
    nodeShape.classList.add("node");
    nodeShape.setAttribute("cx", xCoord);
    nodeShape.setAttribute("cy", yCoord);
    nodeShape.setAttribute("r", "30");
    nodeShape.setAttribute("stroke", "rgb(0, 0, 0)");
    nodeShape.setAttribute("stroke-width", "3");
    nodeShape.setAttribute("fill", "rgb(0,0,255)");

  }

  else if (newNode.type == "UnpoweredIntersection") {
    nodeShape = document.createElementNS("http://www.w3.org/2000/svg", "circle");

    //the node's attributes
    nodeShape.setAttribute("id", id);
    nodeShape.classList.add("node");
    nodeShape.setAttribute("cx", xCoord);
    nodeShape.setAttribute("cy", yCoord);
    nodeShape.setAttribute("r", "30");
    nodeShape.setAttribute("stroke", "rgb(0, 0, 0)");
    nodeShape.setAttribute("stroke-width", "3");
    nodeShape.setAttribute("fill", "rgb(255,0,0)");

  }

  /*
    This if statement checks to see if the node's type is 'Border',
    and if it is, sets the shape and size, and sets the color to grey.
  */
  else if (newNode.type == "Border") {
    nodeShape = document.createElementNS("http://www.w3.org/2000/svg", "circle");

    //the node's attributes
    nodeShape.setAttribute("id", id);
    nodeShape.classList.add("node");
    nodeShape.setAttribute("cx", xCoord);
    nodeShape.setAttribute("cy", yCoord);
    nodeShape.setAttribute("r", "15");
    nodeShape.setAttribute("stroke", "rgb(0, 0, 0)");
    nodeShape.setAttribute("stroke-width", "3");
    nodeShape.setAttribute("fill", "rgb(175,175,175)");

  }

  /*
    This if statement checks to see if the node's type is 'AccessPoint',
    and if it is, sets the shape and size, and sets the color to green.
  */
  else if (newNode.type == "AccessPoint") {
    nodeShape = document.createElementNS("http://www.w3.org/2000/svg", "circle");

    //the node's attributes
    nodeShape.setAttribute("id", id);
    nodeShape.classList.add("node");
    nodeShape.setAttribute("cx", xCoord);
    nodeShape.setAttribute("cy", yCoord);
    nodeShape.setAttribute("r","20");
    nodeShape.setAttribute("stroke", "rgb(0, 0, 0)");
    nodeShape.setAttribute("stroke-width", "3");
    nodeShape.setAttribute("fill", "rgb(0,255,0)");

  }

  /*
    This if statement checks to see if the node's type is 'PowerStation',
    and if it is, sets the shape and size, and sets the color to grey.
  */
  else if (newNode.type == "PowerStation") {
    nodeShape = document.createElementNS("http://www.w3.org/2000/svg", "rect");

    //the node's attributes
    nodeShape.setAttribute("id", id);
    nodeShape.classList.add("node");
    nodeShape.setAttribute("x", xCoord - 70);
    nodeShape.setAttribute("y", yCoord - 70);
    nodeShape.setAttribute("width", "140");
    nodeShape.setAttribute("height", "140");
    nodeShape.setAttribute("stroke", "rgb(0, 0, 0)");
    nodeShape.setAttribute("stroke-width", "3");
    nodeShape.setAttribute("fill", "rgb(175,175,175)");

  }

  /*
    This if statement checks to see if the node's type is 'TrainStation',
    and if it is, sets the shape and size, and sets the color to grey.
  */
  else if (newNode.type == "TrainStation") {
    nodeShape = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    //the node's attributes
    nodeShape.setAttribute("id", id);
    nodeShape.classList.add("node");
    nodeShape.setAttribute("x", xCoord - 70);
    nodeShape.setAttribute("y", yCoord - 35);
    nodeShape.setAttribute("width", "140");
    nodeShape.setAttribute("height", "70");
    nodeShape.setAttribute("stroke", "rgb(0, 0, 0)");
    nodeShape.setAttribute("stroke-width", "3");
    nodeShape.setAttribute("fill", "rgb(175,175,175)");

  }


  /*
    This if statement checks to see if the node's type is 'SmallBusiness',
    and if it is, sets the shape and size, and sets the color to grey.
    (small businesses are coffee shops, gas stations, etc)
  */
  else if (newNode.type == "SmallBusiness") {
    nodeShape = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    //the node's attributes
    nodeShape.setAttribute("id", id);
    nodeShape.classList.add("node");
    nodeShape.setAttribute("x", xCoord - 35);
    nodeShape.setAttribute("y", yCoord - 35);
    nodeShape.setAttribute("width", "70");
    nodeShape.setAttribute("height", "70");
    nodeShape.setAttribute("stroke", "rgb(0, 0, 0)");
    nodeShape.setAttribute("stroke-width", "3");
    nodeShape.setAttribute("fill", "rgb(175,175,175)");

  }


  /*
    If the node's type doesn't match any of the other catagories, then it must
    be 'Business', and the else statement sets the shape and size, and sets
    the color to grey.
    (businesses are hospitals, schools, banks, shops, etc)
  */
  else if (newNode.type == "Business") {
    nodeShape = document.createElementNS("http://www.w3.org/2000/svg", "rect");

    //the node's attributes
    nodeShape.setAttribute("id", id);
    nodeShape.classList.add("node");
    nodeShape.setAttribute("x", xCoord - 100);
    nodeShape.setAttribute("y", yCoord - 100);
    nodeShape.setAttribute("width", "200");
    nodeShape.setAttribute("height", "200");
    nodeShape.setAttribute("stroke", "rgb(0, 0, 0)");
    nodeShape.setAttribute("stroke-width", "3");
    nodeShape.setAttribute("fill", "rgb(175,175,175)");

  }
  nodeShape.setAttribute("data-name", newNode.name)
  nodeShape.setAttribute("data-type", newNode.type)

  nodeG.appendChild(nodeShape);
  container.appendChild(nodeG);

  if (!init) { addNodeHover(id, newNode.type) }
}

function addEdge(container, newEdge, cg) {
  if (newEdge.id > maxEdgeId) {maxEdgeId = newEdge.id}
  /*
    This if statement checks to see if the type of the current node is
    'PowerLine', and if it is, moves the edge up 15 pixels and to the left
    15 pixels, and colors the edge gold.
  */
  var edgeEle = document.createElementNS("http://www.w3.org/2000/svg", "path"),
      edgeEleId = newEdge.id,
      edgeEleClass1 = newEdge.id1 + "edge",
      edgeEleClass2 = newEdge.id2 + "edge",
      x1, x2, y1, y2, path;

  if (cg) {
    x1 = parseInt(cg.nodes[newEdge.id1].cx)
    y1 = parseInt(cg.nodes[newEdge.id1].cy)
    x2 = parseInt(cg.nodes[newEdge.id2].cx)
    y2 = parseInt(cg.nodes[newEdge.id2].cy)
  } else {
    var n1 = document.getElementById(newEdge.id1),
        n2 = document.getElementById(newEdge.id2);
    var name1 = n1.nodeName.toLowerCase(),
        name2 = n2.nodeName.toLowerCase();
    if (name1 == "circle") {
      x1 = n1.getAttribute("cx")
      y1 = n1.getAttribute("cy")
    } else if (name1 == "rect") {
      var wid = parseInt(n1.getAttribute("width"))
      var hei = parseInt(n1.getAttribute("height"))
      x1 = parseInt(n1.getAttribute("x")) + (0.5 * wid)
      y1 = parseInt(n1.getAttribute("y")) + (0.5 * hei)
    } else {
      var box = n1.getBBox()
      var wid = parseInt(box.getAttribute("width"))
      var hei = parseInt(box.getAttribute("height"))
      x1 = parseInt(box.getAttribute("x")) + (0.5 * wid)
      y1 = parseInt(box.getAttribute("y")) + (0.5 * hei)
    }
    if (name2 == "circle") {
      x2 = n2.getAttribute("cx")
      y2 = n2.getAttribute("cy")
    } else if (name2 == "rect") {
      var wid = parseInt(n2.getAttribute("width"))
      var hei = parseInt(n2.getAttribute("height"))
      x2 = parseInt(n2.getAttribute("x")) + (0.5 * wid)
      y2 = parseInt(n2.getAttribute("y")) + (0.5 * hei)
    } else {
      var box = n2.getBBox()
      var wid = parseInt(box.getAttribute("width"))
      var hei = parseInt(box.getAttribute("height"))
      x2 = parseInt(box.getAttribute("x")) + (0.5 * wid)
      y2 = parseInt(box.getAttribute("y")) + (0.5 * hei)
    }
  }

  edgeEle.setAttribute("id", edgeEleId);
  edgeEle.classList.add("edge", edgeEleClass1, edgeEleClass2, newEdge.type);

  // Sets path properties according to edge type.
  if (validTypes["edge"]["PowerLine"].includes(newEdge.type)) {
    edgeEle.classList.add("PowerLine")
    path = "M " + (x1-15) + " " + (y1-15) + " L " + (x1-15) + " " + (y2-15) + " L " + (x2-15) + " " + (y2-15);
    edgeEle.setAttribute("d", path);
    edgeEle.setAttribute("stroke-dasharray", "");
    edgeEle.style.stroke = "rgb(255, 215, 0)";
  } else if (validTypes["edge"]["Railroad"].includes(newEdge.type)) {
    edgeEle.classList.add("Railroad")
    path = "M " + x1 + " " + y1 + " L " + x2 + " " + y2;
    edgeEle.setAttribute("d", path);
    edgeEle.setAttribute("stroke-dasharray", "25,15");
    edgeEle.style.stroke = "rgb(0, 0, 0)"
  } else if (validTypes["edge"]["Road"].includes(newEdge.type)) {
    edgeEle.classList.add("Road")
    path = "M " + x1 + " " + y1 + " L " + x2 + " " + y2;
    edgeEle.setAttribute("d", path);
    edgeEle.setAttribute("stroke-dasharray", "");
    edgeEle.style.stroke = "rgb(0, 0, 0)"
  }

  edgeEle.setAttribute("data-name", newEdge.name)
  edgeEle.setAttribute("data-nodefrom", newEdge.id1)
  edgeEle.setAttribute("data-nodeto", newEdge.id2)
  edgeEle.setAttribute("data-type", newEdge.type)
  if (newEdge.oneway) { edgeEle.setAttribute("data-direction", 1) }
  else { edgeEle.setAttribute("data-direction", 0) }
  if (newEdge.distance) { edgeEle.setAttribute("data-distance", newEdge.distance) }
  else { edgeEle.setAttribute("data-distance", "") }
  if (newEdge.speed) { edgeEle.setAttribute("data-speed", newEdge.speed) }
  else { edgeEle.setAttribute("data-speed", "") }

  if (container.firstElementChild) {
    container.insertBefore(edgeEle, container.firstElementChild);
  } else {
    container.appendChild(edgeEle);
  }

  // Sets oneway markers for roads
  if (newEdge.oneway && validTypes["edge"]["Road"].includes(newEdge.type)) {
    var length = edgeEle.getTotalLength();
    for (var i = 0.25; i < 1; i += 0.5) {
      setMarker(length * i, edgeEle, container)
    }
  }

  if (!cg) { addEdgeHover(edgeEleId) }

}


/**
 * This function adjusts the size of the nodes on mouse hover, as well as toggling the visibility of the node menus.
 * @param {string} id Id of the node to add hover effects to.
 * @param {string} type Type of node to that hover effects are added to.
 */
function addNodeHover(id, type) {
  var node = document.getElementById(id);

  var par = node.parentElement,
      incVal = 10; // Value that hovering will change the size of the element by\

  // This if statement covers the buildings in mouseover
  if (validTypes["buildingNode"].includes(type)) {
    par.onmouseover = function() {
      var width = parseInt(node.getAttribute("width")),
          height = parseInt(node.getAttribute("height"));
      node.setAttribute("x", parseInt(node.getAttribute("x")) - incVal);
      node.setAttribute("y", parseInt(node.getAttribute("y")) - incVal);
      node.setAttribute("height", height + 2 * incVal);
      node.setAttribute("width", width + 2 * incVal);
    };
  }
  // This else if statement covers the intersections, access points, and borders in mouseover
  else {
    par.onmouseover = function() {
      node.setAttribute("r", parseInt(node.getAttribute("r")) + incVal);
    };
  }

  if (validTypes["buildingNode"].includes(type)) {
    par.onmouseout = function() {
      var width = parseInt(node.getAttribute("width")),
          height = parseInt(node.getAttribute("height"));
      node.setAttribute("x", parseInt(node.getAttribute("x")) + incVal);
      node.setAttribute("y", parseInt(node.getAttribute("y")) + incVal);
      node.setAttribute("height", height - 2 * incVal);
      node.setAttribute("width", width - 2 * incVal);
    };
  }
  //this else if statement covers the intersections, access points, and borders in mouseout
  else {
    par.onmouseout = function() {
      node.setAttribute("r", parseInt(node.getAttribute("r")) - incVal);
    };
  }
  /* Edit modes:
   * 1 - Select
   * 2 - Move
   * 3 - Add
   * 4 - Remove
   */
  //this checks the menu visibility and changes it when the node is clicked.
  par.onclick = function() {
    if (editMode == 1) {
      setMenu(node)
    }
  }

  par.onmousedown = function(e) {
    if (editMode == 2) {
      var edgeArray = document.getElementsByClassName(node.getAttribute("id") + "edge")
      pushAction("move", node, edgeArray)
      window.onmouseup = function() {
          setMenu(node)
      }
      movingNode(e, node)
    }
  }
}

function movingNode(e, ele) {
  var x = e.clientX, y = e.clientY;

  window.onmousemove = function(ev) {
    var eX = ev.clientX,
        eY = ev.clientY;
    moveNode((eX - x), (eY - y), ele);
    x = eX;
    y = eY;
  };
}


function moveNode(x, y, ele) {
  var inX = x / transformMatrix[0]
  var inY = y / transformMatrix[0]
  if (ele.nodeName == "circle") {
    var nx = parseFloat(ele.getAttribute("cx")) + inX
    var ny = parseFloat(ele.getAttribute("cy")) + inY
    ele.setAttribute("cx", nx);
    ele.setAttribute("cy", ny);
  } else {
    var nx = parseFloat(ele.getAttribute("x")) + inX
    var ny = parseFloat(ele.getAttribute("y")) + inY
    ele.setAttribute("x", nx);
    ele.setAttribute("y", ny);
  }
  var edges = document.getElementsByClassName(ele.getAttribute("id") + "edge")
  for (var i = 0; i < edges.length; i++) {
    var x1, x2, y1, y2, path;
    var n1 = document.getElementById(edges[i].dataset.nodefrom),
        n2 = document.getElementById(edges[i].dataset.nodeto);
    var name1 = n1.nodeName.toLowerCase(),
        name2 = n2.nodeName.toLowerCase();
    if (name1 == "circle") {
      x1 = n1.getAttribute("cx")
      y1 = n1.getAttribute("cy")
    } else if (name1 == "rect") {
      var wid = parseInt(n1.getAttribute("width"))
      var hei = parseInt(n1.getAttribute("height"))
      x1 = parseInt(n1.getAttribute("x")) + (0.5 * wid)
      y1 = parseInt(n1.getAttribute("y")) + (0.5 * hei)
    } else {
      var box = n1.getBBox()
      var wid = parseInt(box.getAttribute("width"))
      var hei = parseInt(box.getAttribute("height"))
      x1 = parseInt(box.getAttribute("x")) + (0.5 * wid)
      y1 = parseInt(box.getAttribute("y")) + (0.5 * hei)
    }
    if (name2 == "circle") {
      x2 = n2.getAttribute("cx")
      y2 = n2.getAttribute("cy")
    } else if (name2 == "rect") {
      var wid = parseInt(n2.getAttribute("width"))
      var hei = parseInt(n2.getAttribute("height"))
      x2 = parseInt(n2.getAttribute("x")) + (0.5 * wid)
      y2 = parseInt(n2.getAttribute("y")) + (0.5 * hei)
    } else {
      var box = n2.getBBox()
      var wid = parseInt(box.getAttribute("width"))
      var hei = parseInt(box.getAttribute("height"))
      x2 = parseInt(box.getAttribute("x")) + (0.5 * wid)
      y2 = parseInt(box.getAttribute("y")) + (0.5 * hei)
    }
    // Sets path properties according to edge type.
    if (validTypes["edge"]["PowerLine"].includes(edges[i].dataset.type)) {
      path = "M " + (x1-15) + " " + (y1-15) + " L " + (x1-15) + " " + (y2-15) + " L " + (x2-15) + " " + (y2-15);
      edges[i].setAttribute("d", path);
    } else  {
      path = "M " + x1 + " " + y1 + " L " + x2 + " " + y2;
      edges[i].setAttribute("d", path);
    }

    if (edges[i].dataset.direction == "1" && validTypes["edge"]["Road"].includes(edges[i].dataset.type)) {
      var markers = document.getElementsByClassName(edges[i].getAttribute("id") + "marker")
      while (markers[0]) {markers[0].parentElement.removeChild(markers[0])}
      var length = edges[i].getTotalLength();
      for (var j = 0.25; j < 1; j += 0.5) {
        setMarker(length * j, edges[i], document.getElementById("innerSVG"))
      }
    }
  }
}


/**
 * This function adjusts the width of the edges on mouse hover, as well as toggling
 * the visibility of the edge menus.
 * @param {string} id Id of edge to add hover effects to.
*/
function addEdgeHover(id) {
  var edge = document.getElementById(id),
      menu = document.getElementById(id + "Menu");

  edge.onmouseover = function() {
    edge.style.strokeWidth = "12";
  }

  edge.onmouseout = function() {
    edge.style.strokeWidth = "6";
  }

  edge.onclick = function(e) {
    if (editMode == 1) {
      setMenu(edge);
    }
  }
}

/**
 * Sets a oneway marker on path 'edgeEle', placed 'length' distance along path, and appends to the 'innerG' graph element container.
 * @summary Creates edge oneway marker.
 * @param {number} length Distance down path for the marker to be placed.
 * @param {PathElement} edgeEle Edge for marker to be placed on.
 * @param {GroupElement} container Graph element container for marker to be placed in.
 */

function setMarker(length, edgeEle, container) {
  var marker = document.createElementNS("http://www.w3.org/2000/svg", "path");

  var start = length;

  var startPoint = edgeEle.getPointAtLength(start)
  var before = edgeEle.getPointAtLength(start - 1);
  var after = edgeEle.getPointAtLength(start + 1);

  var marker = document.createElementNS("http://www.w3.org/2000/svg", "path");
  var angle = 180 * Math.atan2(after.y - before.y, after.x - before.x) / Math.PI;

  marker.setAttribute("d", "m 0 0 m 9 0 l -18 10 m 18 -10 l -18 -10");
  marker.setAttribute("transform", "translate(" + startPoint.x + "," + startPoint.y + ") rotate(" + angle + ")");
  marker.setAttribute("stroke", "black");
  marker.setAttribute("stroke-width", "4");
  marker.setAttribute("stroke-linecap", "round");
  marker.setAttribute("fill", "none");

  marker.classList.add("edgeMarker", "Road", edgeEle.getAttribute("id") + "marker");

  if (container.firstElementChild) {
    container.insertBefore(marker, container.firstElementChild);
  } else {
    container.appendChild(marker);
  }
}

function addListen(e) {
  if (editMode == 3) {
    if (e.target.classList.contains("edge")) {

    } else {
      var node = document.createElementNS("http://www.w3.org/2000/svg", "circle")
      node.setAttribute("fill", "black")
      node.setAttribute("r", "10px")
      var ele = document.getElementById("svgEle");
      var wid = parseInt(ele.getAttribute("width"));
      var hei = parseInt(ele.getAttribute("height"));
      var scale = (window.innerWidth - wid) > (window.innerHeight - hei) ? ((window.innerWidth)/wid) : (window.innerHeight/hei);
      function c(float, s) {
        return (float - transformMatrix[s])/transformMatrix[0]
      }
      node.setAttribute("cx", (parseFloat(e.clientX) - transformMatrix[4]) / transformMatrix[0])
      node.setAttribute("cy", (parseFloat(e.clientY) - transformMatrix[5]) / transformMatrix[0])
      var innerG = document.getElementById("innerSVG")
      innerG.insertBefore(node, innerG.firstElementChild);
    }
  } else if (editMode == 4) {
    if (e.target.classList.contains("node")) {
      var name = e.target.nodeName.toLowerCase(),
          x, y;
      if (name == "circle") {
        x = e.target.getAttribute("cx")
        y = e.target.getAttribute("cy")
      } else if (name == "rect") {
        var wid = parseInt(e.target.getAttribute("width"))
        var hei = parseInt(e.target.getAttribute("height"))
        x = parseInt(e.target.getAttribute("x")) + (0.5 * wid)
        y = parseInt(e.target.getAttribute("y")) + (0.5 * hei)
      } else {
        var box = e.target.target.getBBox()
        var wid = parseInt(box.getAttribute("width"))
        var hei = parseInt(box.getAttribute("height"))
        x = parseInt(box.getAttribute("x")) + (0.5 * wid)
        y = parseInt(box.getAttribute("y")) + (0.5 * hei)
      }
      var edge = document.createElementNS("http://www.w3.org/2000/svg", "line")
      edge.setAttribute("id", "addEdge")
      edge.setAttribute("x1", x)
      edge.setAttribute("y1", y)
      edge.setAttribute("x2", (parseFloat(e.clientX) - transformMatrix[4]) / transformMatrix[0])
      edge.setAttribute("y2", (parseFloat(e.clientY) - transformMatrix[5]) / transformMatrix[0])
      edge.setAttribute("data-id1", e.target.getAttribute("id"))
      var innerG = document.getElementById("innerSVG")
      innerG.insertBefore(edge, innerG.firstElementChild);
      var svg = document.getElementById("svgEle")
      //svg.removeEventListener("click", addListen)
      svg.addEventListener("click", finishEdgeListen, true)
      svg.addEventListener("mousemove", moveEdgeListen, true)
      svg.addEventListener("wheel", moveEdgeListen, true)
      editMode = 5
    } else if (e.target.classList.contains("edge")) {
      var container = document.getElementById("innerSVG")
      var evTarget = e.target

      var nodeObj = {}
      nodeObj.name = ""
      nodeObj.cx = (parseFloat(e.clientX) - transformMatrix[4]) / transformMatrix[0]
      nodeObj.cy = (parseFloat(e.clientY) - transformMatrix[5]) / transformMatrix[0]
      nodeObj.type = "UnpoweredIntersection"
      nodeObj.id = nextNodeId()
      addNode(container, nodeObj, 0)

      var markers = document.getElementsByClassName(evTarget.getAttribute("id") + "marker")
      var target = document.getElementById(evTarget.getAttribute("id"))
      while (markers[0]) {
        markers[0].parentElement.removeChild(markers[0])
      }
      target.parentElement.removeChild(target)

      var edge = document.createElementNS("http://www.w3.org/2000/svg", "line")
      edge.setAttribute("id", "addEdge")
      edge.setAttribute("x1", (parseFloat(e.clientX) - transformMatrix[4]) / transformMatrix[0])
      edge.setAttribute("y1", (parseFloat(e.clientY) - transformMatrix[5]) / transformMatrix[0])
      edge.setAttribute("x2", (parseFloat(e.clientX) - transformMatrix[4]) / transformMatrix[0])
      edge.setAttribute("y2", (parseFloat(e.clientY) - transformMatrix[5]) / transformMatrix[0])
      edge.setAttribute("data-id1", nodeObj.id)
      edge.setAttribute("data-cutedge", e.target.getAttribute("id"))
      var innerG = document.getElementById("innerSVG")
      innerG.insertBefore(edge, innerG.firstElementChild);
      var svg = document.getElementById("svgEle")
      //svg.removeEventListener("click", addListen)
      svg.addEventListener("click", finishEdgeListen, true)
      svg.addEventListener("mousemove", moveEdgeListen, true)
      svg.addEventListener("wheel", moveEdgeListen, true)
      editMode = 5
    }
  }
}

function moveEdgeListen(ev) {
  var edge = document.getElementById("addEdge")
  edge.setAttribute("x2", (parseFloat(ev.clientX) - transformMatrix[4]) / transformMatrix[0])
  edge.setAttribute("y2", (parseFloat(ev.clientY) - transformMatrix[5]) / transformMatrix[0])
}

function finishEdgeListen(ev) {
  var edge = document.getElementById("addEdge")
  if (editMode == 5) {
    if (edge.dataset.cutedge) {
      var container = document.getElementById("innerSVG")
      var evTarget = ev.target

      var cutEdge1Object = {}
      cutEdge1Object.name = ""
      cutEdge1Object.id = nextEdgeId()
      cutEdge1Object.id1 = ev.target.dataset.nodefrom
      cutEdge1Object.id2 = nodeObj.id
      cutEdge1Object.oneway = parseInt(ev.target.dataset.direction)
      cutEdge1Object.distance = ""
      cutEdge1Object.speed = ev.target.dataset.speed
      cutEdge1Object.type = ev.cutEdge1.dataset.type
      addEdge(container, cutEdge1Object, 0)
      var cutEdge1Ele = document.getElementById(cutEdge1.id)
      cutEdge1Ele.dataset.distance = parseFloat(cutEdge1Ele.getTotalLength())/2000

      var cutEdge2Object = {}
      cutEdge2Object.name = ""
      cutEdge2Object.id = nextEdgeId()
      cutEdge2Object.id1 = nodeObj.id
      cutEdge2Object.id2 = ev.target.dataset.nodeto
      cutEdge2Object.oneway = parseInt(ev.target.dataset.direction)
      cutEdge2Object.distance = ""
      cutEdge2Object.speed = ev.target.dataset.speed
      cutEdge2Object.type = ev.target.dataset.type
      addEdge(container, cutEdge2Object, 0)
      var cutedge2Ele = document.getElementById(cutEdge2Object.id)
      cutedge2Ele.dataset.distance = parseFloat(cutedge2Ele.getTotalLength())/2000

      var newEdge = {}
      var edId = nextEdgeId()
      newEdge.name = ""
      newEdge.id = edId
      newEdge.id1 = edge.dataset.id1
      newEdge.id2 = nodeObj.id
      newEdge.oneway = 0
      newEdge.distance = 0
      newEdge.speed = 35
      newEdge.type = "Road"
      addEdge(container, newEdge, 0)
    }

    if (ev.target.classList.contains("node")) {
      var newEdgeObj = {}
      newEdgeObj.name = ""
      newEdgeObj.id1 = edge.dataset.id1
      newEdgeObj.id2 = ev.target.getAttribute("id")
      newEdgeObj.oneway = 0
      newEdgeObj.distance = 0
      newEdgeObj.speed = 35
      newEdgeObj.type = "Road"

      var newId = maxEdgeId.split('');
      for (var i = 4; i >= 0; i--) {
        if (newId[i] == 'Z') {
          newId[i] = 'A'
        } else {
          newId[i] = String.fromCharCode(newId[i].charCodeAt()+1)
          break
        }
      }
      maxEdgeId = newId.join('')
      newEdgeObj.id = maxEdgeId;

      var container = document.getElementById("innerSVG")
      edge.parentElement.removeChild(edge)
      addEdge(container, newEdgeObj, 0)

      var edgeEle = document.getElementById(newEdgeObj.id)
      setMenu(edgeEle)
      setTimeout(function(){editMode = 4},100)

      var svg = document.getElementById("svgEle")
      svg.removeEventListener("click", finishEdgeListen, true)
      svg.removeEventListener("mousemove", moveEdgeListen, true)
      svg.removeEventListener("wheel", moveEdgeListen, true)

      pushAction("add", newEdgeObj.id)
    } else if (ev.target.classList.contains("edge")) {
      var container = document.getElementById("innerSVG")
      var evTarget = ev.target

      var nodeObj = {}
      nodeObj.name = ""
      nodeObj.cx = (parseFloat(ev.clientX) - transformMatrix[4]) / transformMatrix[0]
      nodeObj.cy = (parseFloat(ev.clientY) - transformMatrix[5]) / transformMatrix[0]
      nodeObj.type = validTypes["buildingNode"].includes(document.getElementById(edge.dataset.id1).dataset.type) ? "AccessPoint" : "UnpoweredIntersection"
      nodeObj.id = nextNodeId()
      addNode(container, nodeObj, 0)

      var repEdge1 = {}
      repEdge1.name = ""
      repEdge1.id = nextEdgeId()
      repEdge1.id1 = ev.target.dataset.nodefrom
      repEdge1.id2 = nodeObj.id
      repEdge1.oneway = parseInt(ev.target.dataset.direction)
      repEdge1.distance = ""
      repEdge1.speed = ev.target.dataset.speed
      repEdge1.type = ev.target.dataset.type
      addEdge(container, repEdge1, 0)
      var repEdge1Ele = document.getElementById(repEdge1.id)
      repEdge1Ele.dataset.distance = parseFloat(repEdge1Ele.getTotalLength())/2000

      var repEdge2 = {}
      repEdge2.name = ""
      repEdge2.id = nextEdgeId()
      repEdge2.id1 = nodeObj.id
      repEdge2.id2 = ev.target.dataset.nodeto
      repEdge2.oneway = parseInt(ev.target.dataset.direction)
      repEdge2.distance = ""
      repEdge2.speed = ev.target.dataset.speed
      repEdge2.type = ev.target.dataset.type
      addEdge(container, repEdge2, 0)
      var repEdge2Ele = document.getElementById(repEdge2.id)
      repEdge2Ele.dataset.distance = parseFloat(repEdge2Ele.getTotalLength())/2000

      var newEdge = {}
      var edId = nextEdgeId()
      newEdge.name = ""
      newEdge.id = edId
      newEdge.id1 = edge.dataset.id1
      newEdge.id2 = nodeObj.id
      newEdge.oneway = 0
      newEdge.distance = 0
      newEdge.speed = 35
      newEdge.type = "Road"
      addEdge(container, newEdge, 0)

      var edgeEle = document.getElementById(edId)
      setMenu(edgeEle)
      edge.parentElement.removeChild(edge)
      setTimeout(function(){editMode = 4},100)

      var markers = document.getElementsByClassName(evTarget.getAttribute("id") + "marker")
      var target = document.getElementById(evTarget.getAttribute("id"))
      while (markers[0]) {
        markers[0].parentElement.removeChild(markers[0])
      }
      target.parentElement.removeChild(target)

      var svg = document.getElementById("svgEle")
      svg.removeEventListener("click", finishEdgeListen, true)
      svg.removeEventListener("mousemove", moveEdgeListen, true)
      svg.removeEventListener("wheel", moveEdgeListen, true)

    }
  } else {
    edge.parentElement.removeChild(edge)
  }
}

function nextEdgeId() {
  var newId = maxEdgeId.split('');
  for (var i = 4; i >= 0; i--) {
    if (newId[i] == 'Z') {
      newId[i] = 'A'
    } else {
      newId[i] = String.fromCharCode(newId[i].charCodeAt()+1)
      break
    }
  }
  maxEdgeId = newId.join('')
  return maxEdgeId
}

function nextNodeId() {
  var newId = parseInt(maxNodeId)
  newId++
  newId+=""
  while (newId.length < 5) {
    newId = "0" + newId
  }
  maxNodeId = newId
  return maxNodeId
}
