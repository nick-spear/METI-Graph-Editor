var transformMatrix = [1,0,0,1,0,0]; // Easier access to current transformation matrix applied to the graph's <g> element
var lastWidth, lastHeight; // Records the last known window height and width, used for resize events

/**
 * Initializes all event listeners related to zooming and panning of the graph.
 */
function initializeGraphMove() {
  var mov = document.getElementById("svgEle");

  // Records initial values of user window.
  transformMatrix = absoluteCenterMatrix();
  lastWidth = window.innerWidth;
  lastHeight = window.innerHeight;
  keepCenter();

  mov.addEventListener("mousedown", panningSVG, false); // Pans graph only when svg window is clicked on.
  window.addEventListener("mouseup", stopPanningSVG, false); // Stops panning whenever mouse button is raised TODO fix chrome bug on mouse leaving window.
  mov.addEventListener("wheel", zoomSVG, false); // Changes graph zoom only when scrollwheel is activated while mouse is over the graph.
  window.addEventListener("resize", keepCenter, false); // Maintains previous map center when window is resized.
  window.addEventListener("keydown", setCenter, false); // Binds F9 to pan graph to center.
}

/**
 * Wheel event handler to change zoom on svg element, currently based on 20% change in zoom every wheel tick.
 * @summary Changes zoom when handed a 'wheel' event.
 * @param {event} e Wheel Event
 */
function zoomSVG(e) {
  // Determines zoom depending on direction of scroll, also calls window size values.
  var zoomFactor = e.deltaY < 0 ? 1.2 : 0.8,
      winHei = parseInt(window.innerHeight),
      winWid = parseInt(window.innerWidth),
      svgHei, svgWid,
      svgEle = document.getElementById("svgEle");

  svgHei = parseInt(svgEle.getAttribute("height"));
  svgWid = parseInt(svgEle.getAttribute("width"));

  var scale = (winWid - svgWid) > (winHei - svgHei) ? (1-zoomFactor)*0.5*(winWid/svgWid) : (1-zoomFactor)*0.5*(winHei/svgHei);

  // Changes zoom values accordingly
  transformMatrix[0] *= zoomFactor;
  transformMatrix[3] *= zoomFactor;

  // Changes pan values accordingly
  transformMatrix[4] = zoomFactor*(transformMatrix[4]) + scale*(winWid);
  transformMatrix[5] = zoomFactor*(transformMatrix[5]) + scale*(winHei);

  document.getElementById("svgBody").setAttribute("transform", "matrix(" + transformMatrix.join(' ') +")");
}


/**
 * Keydown event handler to snap graph back to a centered view with default zoom on F9 Press.
 * @param {event} e Keydown Event.
 */
function setCenter(e) {
  if (e.keyCode == 121) {
    var ele = document.getElementById("svgEle");
    panToCoordinate(parseInt(ele.getAttribute("width"))/2, parseInt(ele.getAttribute("height"))/2);
  }
}

/**
 * Mousedown event handler, implements graph panning using the same idea as the commmand window's drag feature, does not bound panning.
 * @summary Handles graph panning.
 * @param {event} e Mousedown event.
 */
// TODO fix chrome mouseout bug
function panningSVG(e) {
  var x = e.clientX, y = e.clientY;
  if (editMode == 1 || !e.target.classList.contains("node")) {
    // Every time the mouse is moved while panning, we move the image accordingly.
    window.onmousemove = function(ev) {
      var eX = ev.clientX,
          eY = ev.clientY;
      panSVG((eX - x), (eY - y));
      x = eX;
      y = eY;
    };
  }
}

/**
 * Shifts graph by input values by changing its transformation matrix.
 * @param {number} x Specified relative horizontal shift.
 * @param {number} y Specified relative vertical shift.
 */
function panSVG(x, y) {
  var mov = document.getElementById("svgBody");
  transformMatrix[4] += x;
  transformMatrix[5] += y;
  mov.setAttribute("transform", "matrix(" + transformMatrix.join(' ') +")");
}


/**
 * Resize event handler, shifts graph on window resize such that the previous center is maintained.
 */
function keepCenter() {
  document.getElementById("svgEle").setAttribute("viewBox", "0 0 " + (parseInt(window.innerWidth)) + " " + parseInt(window.innerHeight));
  var ele = document.getElementById("svgEle");
  var wid = parseInt(ele.getAttribute("width"));
  var hei = parseInt(ele.getAttribute("height"));
  var scale = (window.innerWidth - wid) > (window.innerHeight - hei) ? 0.5*((window.innerWidth)/wid) : 0.5*(window.innerHeight/hei);
  panSVG(scale*(window.innerWidth - lastWidth),scale*(window.innerHeight - lastHeight));
  lastWidth = window.innerWidth;
  lastHeight = window.innerHeight;
  centerMatrix = absoluteCenterMatrix();
}

/**
 * Finds the transformation matrix that will correspond to the graph being centered on the window with zoom such that 50% of its height corresponding to the height of the user window.
 * @summary Finds transformation matrix that will center graph.
 * @returns {Array} Centering transformation matrix.
 */
function absoluteCenterMatrix() {
  var scale,
      winHei = parseInt(window.innerHeight),
      winWid = parseInt(window.innerWidth),
      svgHei, svgWid,
      svgEle = document.getElementById("svgEle");

  svgHei = parseInt(svgEle.getAttribute("height"));
  svgWid = parseInt(svgEle.getAttribute("width"));

  var scale = (window.innerWidth - svgWid) > (window.innerHeight - svgHei) ? 0.5*(window.innerWidth/svgWid) : 0.5*(window.innerHeight/svgHei);
  var zoom = 2 * winHei / svgHei;
  xOff = (winWid - zoom * svgWid) * scale ;
  yOff = (winHei - zoom * svgHei) * scale;

  return [zoom, 0, 0, zoom, xOff, yOff];
}


/**
 * Halts mousemove listeners on the window, effectively stopping graph panning.
 * @summary Stops graph panning.
 */
function stopPanningSVG() {
  window.onmousemove = function() {}
}

/**
 * Decides graph element type given the input id and pans accordingly.
 * @param {string} eleId Id of element to be evaluated and panned to.
 */
function panGeneral(eleId) {
  if (/^\d+$/.test(eleId)) {
    panToNode(eleId);
  } else if (/^[A-Z]+$/.test(eleId)) {
    panToEdge(eleId);
  }
}

/**
 * Pans to coordinates of input node id.
 * @param {string} nodeId Id of node to be panned to.
 */
function panToNode(nodeId) {
  var ele = document.getElementById(nodeId),
      name = ele.nodeName.toLowerCase(),
      x, y;
  if (name == "circle") {
    x = ele.getAttribute("cx")
    y = ele.getAttribute("cy")
  } else if (name == "rect") {
    var wid = parseInt(ele.getAttribute("width"))
    var hei = parseInt(ele.getAttribute("height"))
    x = parseInt(ele.getAttribute("x")) + (0.5 * wid)
    y = parseInt(ele.getAttribute("y")) + (0.5 * hei)
  } else {
    var box = ele.getBBox()
    var wid = parseInt(box.getAttribute("width"))
    var hei = parseInt(box.getAttribute("height"))
    x = parseInt(box.getAttribute("x")) + (0.5 * wid)
    y = parseInt(box.getAttribute("y")) + (0.5 * hei)
  }
  panToCoordinate(x, y);
}

/**
 * Pans to a given edge's flag coordinates.
 * @param {string} edgeId Id of edge whose flag is to be panned to.
 */
function panToEdge(edgeId) {
  var path = document.getElementById(edgeId);
  var point = path.getPointAtLength(path.getTotalLength() * 0.5)
  panToCoordinate(point.x, point.y);
}

/**
 * Pans to specific coordinates within the svg element.
 * @param {number} x X Coordinate to be panned to.
 * @param {number} y Y Coordinate to be panned to.
 */
// NOTE animateMotion element used for its cross-browser compatability. Standard CSS 'transition'
// styles do not apply to attribute changes (as in SVG elements) in firefox/
function panToCoordinate(x, y) {
  // Calculates tranform that would center desired coordinates on page.
  var ele = document.getElementById("svgEle");
  var wid = parseInt(ele.getAttribute("width"));
  var hei = parseInt(ele.getAttribute("height"));
  var scale = (window.innerWidth - wid) > (window.innerHeight - hei) ? 0.5*((window.innerWidth)/wid) : 0.5*(window.innerHeight/hei);

  var horiz = (parseInt(window.innerWidth))*scale - 2 * scale * x * transformMatrix[0],
      verti = (parseInt(window.innerHeight))*scale - 2 * scale * y * transformMatrix[0];

  var shiftX = horiz - transformMatrix[4],
      shiftY = verti -transformMatrix[5];
//  x - transformMatrix[4] - scale*window.innerWidth,
//      verti = y - transformMatrix[5] - scale*window.innerHeight;

  // Declares element variables and duration of pan.
  var svg = document.getElementById("svgBody");
  var anim = document.createElementNS("http://www.w3.org/2000/svg", "animateMotion");
  var duration = 1;

  // Pathing of graph for desired pan
  anim.setAttribute("path", "M 0 0 l " + (horiz - transformMatrix[4])+ " " + (verti -transformMatrix[5]));

  // Sets animation timing
  anim.setAttribute("dur", duration + "s");
  anim.setAttribute("fill", "freeze");
  anim.setAttribute("begin", ((new Date().getTime() - loadTime)/1000) + "s");

  // Spline-style animation for 'ease-in-out' effect
  anim.setAttribute("keyTimes", "0;1");
  anim.setAttribute("keySplines", "0.5 1 0.5 1");
  anim.setAttribute("calcMode", "spline");

  svg.appendChild(anim);

  anim.addEventListener("endEvent", function() {
    transformMatrix[4] += shiftX;
    transformMatrix[5] += shiftY;
    anim.setAttribute("fill","remove");
    svg.setAttribute("transform", "matrix(" + transformMatrix.join(' ') +")");
  }, false);
}

/**
 * Initializes for an entire element when a given child is passed. Requires the parent element has fixed position or absolute position with <body> as parent.
 * @param {string} id Html child element id.
 */
function addParentDrag(id) {
  var element = document.getElementById(id);
  element.onmousedown = function (e) {
    startDrag(e, element.parentElement);
  }
  element.onmouseup = function (e) {
    window.onmousemove = function() {};
  }
}

/**
 * Called on mouseDown event, calculates relative mouse position to the top left corner of the element, and assigns a mousemove listener to track position relative to that corner.
 * @summary Tracks movement of element by relative movement of mouse.
 * @param {event} e Mousedodwn event
 */
function startDrag(e, element) {
  // Getting mouse position, command window position, and document bounds
  var x = e.clientX,
      y = e.clientY,
      rect = element.getBoundingClientRect();

  var eleWidth = parseInt(rect.width),
      eleHeight = parseInt(rect.height),
      eleTop = parseInt(rect.top),
      eleLeft = parseInt(rect.left),
      winWidth = parseInt(window.innerWidth),
      winHeight = parseInt(window.innerHeight);

  // Gets relative displacement of mouse to command window's top-left corner
  var dispX = x - eleLeft,
      dispY = y - eleTop;

  // Evaluates relative mouse position, ensuring the window cannot leave document bounds, and
  // calls the moveCmd function on that new, evaluated position
  window.onmousemove = function(ev) {
    var eX = ev.clientX,
        eY = ev.clientY,
        moveX = eX - dispX,
        moveY = eY - dispY;
    if (moveX < 0) { moveX = 0; }
    if (moveY < 0) { moveY = 0; }
    if (moveX + eleWidth > winWidth) { moveX = winWidth - eleWidth; }
    if (moveY + eleHeight > winHeight) { moveY = winHeight - eleHeight; }
    moveElement(moveX, moveY, element);
  };
}

function moveElement(x, y, element) {
  element.style.left = x + "px";
  element.style.top = y + "px";
}
