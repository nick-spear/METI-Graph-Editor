var loadTime, editMode = 1;

/* Edit modes:
 * 1 - Select
 * 2 - Move
 * 3 - Add Node
 * 4 - Add Edge
 * 5 - Add Edge (In Progress)
 */


window.onload = function() {
  loadTime = new Date().getTime();
  var svgEle = document.getElementById("svgEle");
  svgEle.setAttribute("viewBox", "0 0 " + (parseInt(window.innerWidth)-450) + " " + parseInt(window.innerHeight));
  clearMenu();
  initializeGraphMove();
  loadGraphListen();
  initializeUndo();
  addParentDrag("headerBlock");
  setGraph({nodes:{}, edges:{}})
  svgEle.addEventListener("click", addListen)
  document.getElementById("selectEdit").addEventListener("click", function() {editMode = 1})
  document.getElementById("moveEdit").addEventListener("click", function() {editMode = 2})
  document.getElementById("nodeEdit").addEventListener("click", function() {editMode = 3})
  document.getElementById("edgeEdit").addEventListener("click", function() {editMode = 4})
}

/*
  nodes
  id
  data-name
  data-type

  edges
  id (hidden)
  data-name
  data-nodefrom
  data-nodeto
  data-type
  data-direction
  data-distance
  data-speed
*/

function updateGeneral(element) {
  if (element.classList.contains("node")) {
    updateNode(element)
  } else if (element.classList.contains("edge")) {
    updateEdge(element)
  }
}

function updateNode(element) {
  var id = element.getAttribute("id"),
      name = element.dataset.name,
      type = element.dataset.type,
      xCoord, yCoord;

  var element = document.getElementById(id),
      eleName = element.nodeName.toLowerCase();
  if (eleName == "circle") {
    xCoord = element.getAttribute("cx")
    yCoord = element.getAttribute("cy")
  } else if (eleName == "rect") {
    var wid = parseInt(element.getAttribute("width"))
    var hei = parseInt(element.getAttribute("height"))
    xCoord = parseInt(element.getAttribute("x")) + (0.5 * wid)
    yCoord = parseInt(element.getAttribute("y")) + (0.5 * hei)
  } else {
    var box = element.getBBox()
    var wid = parseInt(box.getAttribute("width"))
    var hei = parseInt(box.getAttribute("height"))
    xCoord = parseInt(box.getAttribute("x")) + (0.5 * wid)
    yCoord = parseInt(box.getAttribute("y")) + (0.5 * hei)
  }

  // Creates and appends node with text element
  var nodeShape,
      nodeG = document.getElementById(id).parentElement

  nodeG.removeChild(nodeG.firstElementChild)

  if (type == "PoweredIntersection") {
    nodeShape = document.createElementNS("http://www.w3.org/2000/svg", "circle");

    nodeShape.setAttribute("id", id);
    nodeShape.classList.add("node", type);
    nodeShape.setAttribute("cx", xCoord);
    nodeShape.setAttribute("cy", yCoord);
    nodeShape.setAttribute("r", "30");
    nodeShape.setAttribute("stroke", "rgb(0, 0, 0)");
    nodeShape.setAttribute("stroke-width", "3");
    nodeShape.setAttribute("fill", "rgb(0,0,255)");

  } else if (type == "UnpoweredIntersection") {
    nodeShape = document.createElementNS("http://www.w3.org/2000/svg", "circle");

    nodeShape.setAttribute("id", id);
    nodeShape.classList.add("node", type);
    nodeShape.setAttribute("cx", xCoord);
    nodeShape.setAttribute("cy", yCoord);
    nodeShape.setAttribute("r", "30");
    nodeShape.setAttribute("stroke", "rgb(0, 0, 0)");
    nodeShape.setAttribute("stroke-width", "3");
    nodeShape.setAttribute("fill", "rgb(255,0,0)");

  } else if (type == "Border") {
    nodeShape = document.createElementNS("http://www.w3.org/2000/svg", "circle");

    //the node's attributes
    nodeShape.setAttribute("id", id);
    nodeShape.classList.add("node", type);
    nodeShape.setAttribute("cx", xCoord);
    nodeShape.setAttribute("cy", yCoord);
    nodeShape.setAttribute("r", "15");
    nodeShape.setAttribute("stroke", "rgb(0, 0, 0)");
    nodeShape.setAttribute("stroke-width", "3");
    nodeShape.setAttribute("fill", "rgb(175,175,175)");

  } else if (type == "AccessPoint") {
    nodeShape = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    menuOffset = 35;

    //the node's attributes
    nodeShape.setAttribute("id", id);
    nodeShape.classList.add("node", type);
    nodeShape.setAttribute("cx", xCoord);
    nodeShape.setAttribute("cy", yCoord);
    nodeShape.setAttribute("r","20");
    nodeShape.setAttribute("stroke", "rgb(0, 0, 0)");
    nodeShape.setAttribute("stroke-width", "3");
    nodeShape.setAttribute("fill", "rgb(0,255,0)");

  } else if (type == "PowerStation") {
    nodeShape = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    menuOffset = 120;

    //the node's attributes
    nodeShape.setAttribute("id", id);
    nodeShape.classList.add("node", type);
    nodeShape.setAttribute("x", xCoord - 70);
    nodeShape.setAttribute("y", yCoord - 70);
    nodeShape.setAttribute("width", "140");
    nodeShape.setAttribute("height", "140");
    nodeShape.setAttribute("stroke", "rgb(0, 0, 0)");
    nodeShape.setAttribute("stroke-width", "3");
    nodeShape.setAttribute("fill", "rgb(175,175,175)");

  } else if (type == "TrainStation") {
    nodeShape = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    menuOffset = 120;

    //the node's attributes
    nodeShape.setAttribute("id", id);
    nodeShape.classList.add("node", type);
    nodeShape.setAttribute("x", xCoord - 70);
    nodeShape.setAttribute("y", yCoord - 35);
    nodeShape.setAttribute("width", "140");
    nodeShape.setAttribute("height", "70");
    nodeShape.setAttribute("stroke", "rgb(0, 0, 0)");
    nodeShape.setAttribute("stroke-width", "3");
    nodeShape.setAttribute("fill", "rgb(175,175,175)");

  } else if (type == "SmallBusiness") {
    nodeShape = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    menuOffset = 50;

    //the node's attributes
    nodeShape.setAttribute("id", id);
    nodeShape.classList.add("node", type);
    nodeShape.setAttribute("x", xCoord - 35);
    nodeShape.setAttribute("y", yCoord - 35);
    nodeShape.setAttribute("width", "70");
    nodeShape.setAttribute("height", "70");
    nodeShape.setAttribute("stroke", "rgb(0, 0, 0)");
    nodeShape.setAttribute("stroke-width", "3");
    nodeShape.setAttribute("fill", "rgb(175,175,175)");

  } else if (type == "Business") {
    nodeShape = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    menuOffset = 50;

    //the node's attributes
    nodeShape.setAttribute("id", id);
    nodeShape.classList.add("node", type);
    nodeShape.setAttribute("x", xCoord - 100);
    nodeShape.setAttribute("y", yCoord - 100);
    nodeShape.setAttribute("width", "200");
    nodeShape.setAttribute("height", "200");
    nodeShape.setAttribute("stroke", "rgb(0, 0, 0)");
    nodeShape.setAttribute("stroke-width", "3");
    nodeShape.setAttribute("fill", "rgb(175,175,175)");

  }

  nodeShape.setAttribute("data-name", name)
  nodeShape.setAttribute("data-type", type)

  nodeG.appendChild(nodeShape);

  addNodeHover(id, type)
  setMenu(nodeShape)
}

function updateEdge(element) {

  element.setAttribute("class", "edge " + element.dataset.nodefrom + "edge " + element.dataset.nodeto + "edge " + element.dataset.type)

  // Updating paths
  var nodefrom, nodefromX, nodefromY, nodeto, nodetoX, nodetoY;
  nodefrom = document.getElementById(element.dataset.nodefrom);
  nodeto = document.getElementById(element.dataset.nodeto);

  if (nodefrom.nodeName == "circle") {
    nodefromX = nodefrom.getAttribute("cx")
    nodefromY = nodefrom.getAttribute("cy")
  } else if (nodefrom.nodeName == "rect") {
    nodefromX = parseInt(nodefrom.getAttribute("x")) + (parseInt(nodefrom.getAttribute("width")) / 2)
    nodefromY = parseInt(nodefrom.getAttribute("y")) + (parseInt(nodefrom.getAttribute("height")) / 2)
  }

  if (nodeto.nodeName == "circle") {
    nodetoX = nodeto.getAttribute("cx")
    nodetoY = nodeto.getAttribute("cy")
  } else if (nodeto.nodeName == "rect") {
    nodetoX = parseInt(nodeto.getAttribute("x")) + (parseInt(nodeto.getAttribute("width")) / 2)
    nodetoY = parseInt(nodeto.getAttribute("y")) + (parseInt(nodeto.getAttribute("height")) / 2)
  }

  var path;
  // Sets path properties according to edge type.
  if (validTypes["edge"]["PowerLine"].includes(element.dataset.type)) {
    element.classList.add("PowerLine")
    path = "M " + (nodefromX-15) + " " + (nodefromY-15) + " L " + (nodefromX-15) + " " + (nodetoY-15) + " L " + (nodetoX-15) + " " + (nodetoY-15);
    element.setAttribute("d", path);
    element.setAttribute("stroke-dasharray", "");
    element.style.stroke = "rgb(255, 215, 0)";
  } else if (validTypes["edge"]["Railroad"].includes(element.dataset.type)) {
    element.classList.add("Railroad")
    path = "M " + nodefromX + " " + nodefromY + " L " + nodetoX + " " + nodetoY;
    element.setAttribute("d", path);
    element.setAttribute("stroke-dasharray", "25,15");
    element.style.stroke = "rgb(0, 0, 0)"
  } else if (validTypes["edge"]["Road"].includes(element.dataset.type)) {
    element.classList.add("Road")
    path = "M " + nodefromX + " " + nodefromY + " L " + nodetoX + " " + nodetoY;
    element.setAttribute("d", path);
    element.setAttribute("stroke-dasharray", "");
    element.style.stroke = "rgb(0, 0, 0)"
  }

  var mark = document.getElementsByClassName(element.getAttribute("id") + "marker")

  while (mark[0]) {
    mark[0].parentElement.removeChild(mark[0])
  }

  if (element.dataset.direction == 1 && validTypes["edge"]["Road"].includes(element.dataset.type)) {
      var container = document.getElementById("innerSVG")
      var length = element.getTotalLength();
      for (var i = 0.25; i < 1; i += 0.5) {
        setMarker(length * i, element, container)
      }
    // var anim = document.createElementNS("http://www.w3.org/2000/svg", "animateMotion"),
    //     marker = document.createElementNS("http://www.w3.org/2000/svg", "path");
    //
    // var angle = 180 * Math.atan2(nodetoY - nodefromY, nodetoX - nodefromX) / Math.PI;
    // var disto = Math.pow( Math.pow(nodetoX - nodefromX, 2) + Math.pow(nodetoY - nodefromY, 2) ,0.5);
    //
    // marker.setAttribute("id", element.getAttribute("id") + "marker");
    // marker.setAttribute("d", "M 0 0 L 26 15 L 0 30");
    // marker.setAttribute("transform", "rotate(" + angle + ") translate(-15, -15)");
    // marker.setAttribute("stroke", "black");
    // marker.setAttribute("stroke-width", "5");
    // marker.setAttribute("stroke-linecap", "round");
    // marker.setAttribute("fill", "none");
    //
    // marker.classList.add("edgeMarker", "Road");
    //
    // anim.setAttribute("id", element.getAttribute("id") + "markanim")
    // anim.setAttribute("path", path);
    // anim.setAttribute("repeatCount", "indefinite");
    // anim.setAttribute("dur", (disto * 0.02) + "s");
    //
    // marker.appendChild(anim);
    // document.getElementById("innerSVG").insertBefore(marker, element)
  }

  addEdgeHover(element.getAttribute("id"))
  setMenu(element)
}

function clearMenu() {
  var selectMenu = document.getElementById("selectAttributes")
  while (selectMenu.children[0]) {
    selectMenu.removeChild(selectMenu.children[0])
  }
  for (var i = 0; i <= 6; i++) {
    var child = document.createElement("li")
    child.classList.add("li" + ((i%2)+1))
    selectMenu.appendChild(child)
  }
}

function updateDisplay(element) {
  var ele = element.cloneNode(true)

  var selectTitle = document.getElementById("selectedTitle")
  var selectDisplay = document.getElementById("selectDisplay")
  var eleId = ele.getAttribute("id")
  while (selectDisplay.children[0]) {
    selectDisplay.removeChild(selectDisplay.children[0])
  }
  selectTitle.onclick = function() {
    panGeneral(eleId)
  }
  selectDisplay.onclick = function() {
    panGeneral(eleId)
  }

  if (ele.classList.contains("node")) {
    var nodeText = document.createElementNS("http://www.w3.org/2000/svg", "text");

    var name = ele.nodeName.toLowerCase();

    if (name == "circle") {
      ele.setAttribute("cx", "72")
      ele.setAttribute("cy", "60")
      nodeText.classList.add("nodeLabel");
      nodeText.setAttribute("x", "72");
      nodeText.setAttribute("y", "146");
      nodeText.setAttribute("text-anchor", "middle")
      nodeText.setAttribute("fill", "rgb(0, 0, 0)");
      nodeText.innerHTML = parseInt(eleId)
      ele.setAttribute("id", "")
    } else if (name == "rect") {
      var wid = parseInt(ele.getAttribute("width"))
      var hei = parseInt(ele.getAttribute("height"))
      if (wid > 130 || hei > 110) {
        if (wid - 130 > hei - 110) {
          hei = (130 / wid) * hei;
          wid =  130;
          ele.setAttribute("width", wid)
          ele.setAttribute("height", hei)
        } else {
          wid = (110 / hei) * wid;
          hei = 110;
          ele.setAttribute("width", wid)
          ele.setAttribute("height", hei)
        }
      }
      ele.setAttribute("x", 72 - (wid / 2))
      ele.setAttribute("y", 60 - (hei / 2))
      nodeText.classList.add("nodeLabel");
      nodeText.setAttribute("x", "72");
      nodeText.setAttribute("y", "146");
      nodeText.setAttribute("text-anchor", "middle")
      nodeText.setAttribute("fill", "rgb(0, 0, 0)");
      nodeText.innerHTML = parseInt(eleId)
      ele.setAttribute("id", "")
    } else {
      var boundRect = document.getElementById(ele.getAttribute("id")).getBBox()
      var bWid = parseInt(boundRect.width)
      var bHei = parseInt(boundRect.height)
      var bx = -1 * parseInt(boundRect.x)
      var by = -1 * parseInt(boundRect.y)
      var scale;
      if ( bWid - 130 > bHei - 110 ) {
        scale = (130 / bWid);
        bx += (6/scale) + (130/scale - bWid)*0.5
        by += (6/scale) + (110/scale - bHei)*0.5
      } else {
        scale = (110 / bHei);
        bx += (130/scale - bWid)*0.5
        by += (110/scale - bHei)*0.5
      }

      var nodeText = document.createElementNS("http://www.w3.org/2000/svg", "text");
      nodeText.classList.add("nodeLabel");
      nodeText.setAttribute("x", "72");
      nodeText.setAttribute("y", "146");
      nodeText.setAttribute("text-anchor", "middle")
      nodeText.setAttribute("fill", "rgb(0, 0, 0)");
      nodeText.innerHTML = parseInt(eleId)
      ele.setAttribute("id", "")
    }

    selectDisplay.appendChild(nodeText)
    selectDisplay.appendChild(ele)
  } else if (ele.classList.contains("edge")) {
    var boundRect = document.getElementById(ele.getAttribute("id")).getBBox()
    var bWid = parseInt(boundRect.width)
    var bHei = parseInt(boundRect.height)
    var bx = -1 * parseInt(boundRect.x)
    var by = -1 * parseInt(boundRect.y)
    var scale;
    if ( bWid - 130 > bHei - 110 ) {
      scale = (130 / bWid);
      bx += (6/scale) + (130/scale - bWid)*0.5
      by += (6/scale) + (110/scale - bHei)*0.5
    } else {
      scale = (110 / bHei);
      bx += (130/scale - bWid)*0.5
      by += (110/scale - bHei)*0.5
    }

    var nodeText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    nodeText.classList.add("nodeLabel");
    nodeText.setAttribute("x", "72");
    nodeText.setAttribute("y", "146");
    nodeText.setAttribute("text-anchor", "middle")
    nodeText.setAttribute("fill", "rgb(0, 0, 0)");
    var id = eleId;
    while (id.charAt(0) === 'A') {
      id = id.slice(1)
    }
    nodeText.innerHTML = id

    ele.setAttribute("transform", "scale(" + scale + ") translate(" + bx + " " + by + ")")
    ele.setAttribute("stroke-linecap", "round");
    ele.setAttribute("id", "")
    ele.setAttribute("class", "edge")
    selectDisplay.appendChild(ele)
    selectDisplay.appendChild(nodeText)
  }
}

function setMenu(element) {
  clearMenu()
  var removeButton = document.getElementById("removeButton")
  removeButton.onclick = function() {
    pushAction("remove", element)
    var id = element.getAttribute("id")
    if (element.classList.contains("edge")) {
      var marks = document.getElementsByClassName(id + "marker")
      while (marks[0]) {
        marks[0].parentNode.removeChild(marks[0])
      }
      element.parentNode.removeChild(element)
    } else if (element.classList.contains("node")) {
      element.parentNode.parentNode.removeChild(element.parentNode)
    }

    var selectTitle = document.getElementById("selectedTitle")
    var selectDisplay = document.getElementById("selectDisplay")
    while (selectDisplay.children[0]) {
      selectDisplay.removeChild(selectDisplay.children[0])
    }
    selectTitle.onclick = function() {}
    selectDisplay.onclick = function() {}
    removeButton.onclick = function() {}
    clearMenu();
  }

  updateDisplay(element)

  var selectMenu = document.getElementById("selectAttributes")
  while (selectMenu.children[0]) {
    selectMenu.removeChild(selectMenu.children[0])
  }

  if (element.classList.contains("edge")) {
    var data = element.dataset

    // Name
    var name = document.createElement("li")
    name.classList.add("li1")
    var nameSpan = document.createElement("span")
    nameSpan.classList.add("attributeTitle")
    nameSpan.innerHTML = "name"
    var nameForm = document.createElement("form")
    nameForm.setAttribute("onsubmit", "namesubmit('" + element.getAttribute("id") + "'); return false;")
    nameForm.setAttribute("autocomplete", "off")
    var nameInput = document.createElement("input")
    nameInput.classList.add("nameAttribute")
    nameInput.setAttribute("id", "selectname")
    nameInput.setAttribute("type", "text")
    nameInput.setAttribute("value", data.name)

    name.appendChild(nameSpan)
    nameForm.appendChild(nameInput)
    name.appendChild(nameForm)
    selectMenu.appendChild(name)

    // Node From
    var nodeFrom = document.createElement("li")
    nodeFrom.classList.add("li2")
    var nodeFromSpan = document.createElement("span")
    nodeFromSpan.classList.add("attributeTitle")
    nodeFromSpan.innerHTML = "node from"
    var nodeFromForm = document.createElement("form")
    nodeFromForm.setAttribute("onsubmit", "nodefromsubmit('" + element.getAttribute("id") + "'); return false;")
    nodeFromForm.setAttribute("autocomplete", "off")
    var nodeFromInput = document.createElement("input")
    nodeFromInput.classList.add("nameAttribute")
    nodeFromInput.setAttribute("id", "selectnodefrom")
    nodeFromInput.setAttribute("type", "text")
    nodeFromInput.setAttribute("value", data.nodefrom)

    nodeFrom.appendChild(nodeFromSpan)
    nodeFromForm.appendChild(nodeFromInput)
    nodeFrom.appendChild(nodeFromForm)
    selectMenu.appendChild(nodeFrom)

    // Node To
    var nodeTo = document.createElement("li")
    nodeTo.classList.add("li1")
    var nodeToSpan = document.createElement("span")
    nodeToSpan.classList.add("attributeTitle")
    nodeToSpan.innerHTML = "node to"
    var nodeToForm = document.createElement("form")
    nodeToForm.setAttribute("onsubmit", "nodetosubmit('" + element.getAttribute("id") + "'); return false;")
    nodeToForm.setAttribute("autocomplete", "off")
    var nodeToInput = document.createElement("input")
    nodeToInput.classList.add("nameAttribute")
    nodeToInput.setAttribute("id", "selectnodeto")
    nodeToInput.setAttribute("type", "text")
    nodeToInput.setAttribute("value", data.nodeto)

    nodeTo.appendChild(nodeToSpan)
    nodeToForm.appendChild(nodeToInput)
    nodeTo.appendChild(nodeToForm)
    selectMenu.appendChild(nodeTo)

    // Type
    var type = document.createElement("li")
    type.classList.add("li2")
    var typeSpan = document.createElement("span")
    typeSpan.classList.add("attributeTitle")
    typeSpan.innerHTML = "type"
    var typeSelect = document.createElement("select")
    typeSelect.classList.add("typeAttribute")
    var typeRoad = document.createElement("option")
    typeRoad.setAttribute("id", "Road")
    typeRoad.innerHTML = "Road"
    var typePL = document.createElement("option")
    typePL.setAttribute("id", "PowerLine")
    typePL.innerHTML = "Power Line"
    var typeRR = document.createElement("option")
    typeRR.setAttribute("id", "Railroad")
    typeRR.innerHTML = "Railroad"

    switch (data.type) {
      case "Road" :
        typeRoad.setAttribute("selected","selected")
        break
      case "PowerLine" :
        typePL.setAttribute("selected","selected")
        break
      case "Railroad" :
        typeRR.setAttribute("selected","selected")
        break
    }

    typeSelect.appendChild(typeRoad)
    typeSelect.appendChild(typePL)
    typeSelect.appendChild(typeRR)
    type.appendChild(typeSpan)
    type.appendChild(typeSelect)
    selectMenu.appendChild(type)

    // Direction
    var direction = document.createElement("li")
    direction.classList.add("li1")
    var dirSpan = document.createElement("span")
    dirSpan.classList.add("attributeTitle")
    dirSpan.innerHTML = "direction"
    var dirSelect = document.createElement("select")
    dirSelect.classList.add("typeAttribute")
    var dirOne = document.createElement("option")
    dirOne.setAttribute("id", "oneway")
    dirOne.innerHTML = "One-Way"
    var dirTwo = document.createElement("option")
    dirTwo.setAttribute("id", "twoway")
    dirTwo.innerHTML = "Two-Way"

    switch (data.direction) {
      case "1" :
        dirOne.setAttribute("selected","selected")
        break
      case "0" :
        dirTwo.setAttribute("selected","selected")
        break
      default:
        break
    }

    dirSelect.appendChild(dirTwo)
    dirSelect.appendChild(dirOne)
    direction.appendChild(dirSpan)
    direction.appendChild(dirSelect)
    selectMenu.appendChild(direction)

    // Distance
    var distance = document.createElement("li")
    distance.classList.add("li2")
    var distanceSpan = document.createElement("span")
    distanceSpan.classList.add("attributeTitle")
    distanceSpan.innerHTML = "distance"
    var distanceForm = document.createElement("form")
    distanceForm.setAttribute("onsubmit", "distancesubmit('" + element.getAttribute("id") + "'); return false;")
    distanceForm.setAttribute("autocomplete", "off")
    var distanceInput = document.createElement("input")
    distanceInput.classList.add("nameAttribute")
    distanceInput.setAttribute("id", "selectdistance")
    distanceInput.setAttribute("type", "text")
    var distValue = parseFloat(data.distance)
    if (isNaN(distValue)) { distValue = "" }
    distanceInput.setAttribute("value", distValue)

    distance.appendChild(distanceSpan)
    distanceForm.appendChild(distanceInput)
    distance.appendChild(distanceForm)
    selectMenu.appendChild(distance)

    // Speed
    var speed = document.createElement("li")
    speed.classList.add("li1")
    var speedSpan = document.createElement("span")
    speedSpan.classList.add("attributeTitle")
    speedSpan.innerHTML = "speed"
    var speedForm = document.createElement("form")
    speedForm.setAttribute("onsubmit", "speedsubmit('" + element.getAttribute("id") + "'); return false;")
    speedForm.setAttribute("autocomplete", "off")
    var speedInput = document.createElement("input")
    speedInput.classList.add("nameAttribute")
    speedInput.setAttribute("id", "selectspeed")
    speedInput.setAttribute("type", "text")
    var speedValue = parseFloat(data.speed)
    if (isNaN(speedValue)) { speedValue = "" }
    speedInput.setAttribute("value", speedValue)

    speed.appendChild(speedSpan)
    speed.appendChild(speedInput)
    selectMenu.appendChild(speed)

    nameInput.onblur = function() {
      pushAction("change", element)
      nameInput.value = element.dataset.name;
    }

    typeSelect.onchange = function(e) {
      var selected = typeSelect.options[typeSelect.selectedIndex].value.replace(/\s+/g, '');
      var dupCheck = 0;
      var dupEdges = document.getElementsByClassName("edge " + element.dataset.nodeto + "edge " + element.dataset.nodefrom + "edge " + selected)
      dupCheck = dupEdges.length == 0;
      if (dupCheck) {
        pushAction("change", element)
        element.dataset.type = selected
        updateGeneral(element)
      } else {
        document.getElementById(element.dataset.type).setAttribute("selected", "selected")
      }
    }

    dirSelect.onchange = function(e) {
      pushAction("change", element)
      element.dataset.direction = parseInt(dirSelect.selectedIndex);
      updateGeneral(element)
    }

  } else if (element.classList.contains("node")) {
    var name = document.createElement("li")
    name.classList.add("li1")
    var nameSpan = document.createElement("span")
    nameSpan.classList.add("attributeTitle")
    nameSpan.innerHTML = "name"
    var nameForm = document.createElement("form")
    nameForm.setAttribute("onsubmit", "nodenamesubmit('" + element.getAttribute("id") + "'); return false;")
    nameForm.setAttribute("autocomplete", "off")
    var nameInput = document.createElement("input")
    nameInput.classList.add("nameAttribute")
    nameInput.setAttribute("id", "nodeselectname")
    nameInput.setAttribute("type", "text")
    nameInput.setAttribute("value", element.dataset.name)

    name.appendChild(nameSpan)
    nameForm.appendChild(nameInput)
    name.appendChild(nameForm)
    selectMenu.appendChild(name)

    var nodeid = document.createElement("li")
    nodeid.classList.add("li2")
    var nodeidspan = document.createElement("span")
    nodeidspan.classList.add("attributeTitle")
    nodeidspan.innerHTML = "id"
    var nodeidvalue = document.createElement("div")
    nodeidvalue.classList.add("idAttribute")
    nodeidvalue.innerHTML = element.getAttribute("id")

    nodeid.appendChild(nodeidspan)
    nodeid.appendChild(nodeidvalue)
    selectMenu.appendChild(nodeid)

    // Type
    var type = document.createElement("li")
    type.classList.add("li1")
    var typeSpan = document.createElement("span")
    typeSpan.classList.add("attributeTitle")
    typeSpan.innerHTML = "type"
    var typeSelect = document.createElement("select")
    typeSelect.classList.add("typeAttribute")
    var typeBus = document.createElement("option")
    typeBus.innerHTML = "Business"
    var typeSmBus = document.createElement("option")
    typeSmBus.innerHTML = "SmallBusiness"
    var typeTra = document.createElement("option")
    typeTra.innerHTML = "TrainStation"
    var typePow = document.createElement("option")
    typePow.innerHTML = "PowerStation"
    var typeUIn = document.createElement("option")
    typeUIn.innerHTML = "UnpoweredIntersection"
    var typePIn = document.createElement("option")
    typePIn.innerHTML = "Powered Intersection"
    var typeAcs = document.createElement("option")
    typeAcs.innerHTML = "Access Point"

    switch (element.dataset.type) {
      case "Business" :
        typeBus.setAttribute("selected","selected")
        break
      case "SmallBusiness" :
        typeSmBus.setAttribute("selected","selected")
        break
      case "TrainStation" :
        typeTra.setAttribute("selected","selected")
        break
      case "PowerStation" :
        typePow.setAttribute("selected","selected")
        break
      case "UnpoweredIntersection" :
        typeUIn.setAttribute("selected","selected")
        break
      case "PoweredIntersection" :
        typePIn.setAttribute("selected","selected")
        break
      case "AccessPoint" :
        typeAcs.setAttribute("selected","selected")
        break
    }

    typeSelect.appendChild(typeBus)
    typeSelect.appendChild(typeSmBus)
    typeSelect.appendChild(typeTra)
    typeSelect.appendChild(typePow)
    typeSelect.appendChild(typeUIn)
    typeSelect.appendChild(typePIn)
    typeSelect.appendChild(typeAcs)
    type.appendChild(typeSpan)
    type.appendChild(typeSelect)
    selectMenu.appendChild(type)

    var fill1 = document.createElement("li"),
        fill2 = document.createElement("li"),
        fill3 = document.createElement("li"),
        fill4 = document.createElement("li");

    fill1.classList.add("li2")
    fill2.classList.add("li1")
    fill3.classList.add("li2")
    fill4.classList.add("li1")

    selectMenu.appendChild(fill1)
    selectMenu.appendChild(fill2)
    selectMenu.appendChild(fill3)
    selectMenu.appendChild(fill4)

    nameInput.onblur = function() {
      pushAction("change", element)
      nameInput.setAttribute("value", element.dataset.name);
    }

    typeSelect.onchange = function(e) {
      pushAction("change", element)
      var selected = typeSelect.options[typeSelect.selectedIndex].value;
      element.dataset.type = selected.replace(/\s/g, '');
      updateGeneral(element)
    }
  }
}

function idType(string) {
  var ele = document.getElementById(string);
  if (ele) {
    if (ele.classList.contains("node")) {
      return "node"
    } else if (ele.classList.contains("edge")) {
      return "edge"
    } else {
      return ""
    }
  } else {
    return ""
  }
}

function checkId(id) {
  if ( /^\d+$/.test(id) ) { // Regex to test for exclusively digit input.
    var reducedId = "" + (parseInt(id)); // Eliminates any leading 0s
    if (reducedId.length > 5) { return ""; } // If the value has more than 5 digits, it cannot be a valid id.
    while (reducedId.length < 5) { // Pads with correct amounts of 0s
      reducedId = "0" + reducedId;
    }
    if (document.getElementById(reducedId)) { // Checks if node with corresponding id exists.
      return reducedId;
    } else {
      return "";
    }
  } else if ( /^[a-zA-Z]+$/.test(id) ) { // Regex to test for exclusively letter input.
    if (id.length > 5) { return ""; } // If the value has more than 5 characters, it cannot be a valid id.
    var reducedId = id.toUpperCase(); // Forces uppercase
    while (reducedId.length < 5) { // Pads with correct amounts of 0s
      reducedId = "A" + reducedId;
    }
    if (document.getElementById(reducedId)) { // Checks if node with corresponding id exists.
      return reducedId;
    } else {
      return "";
    }
  } else {
    return "";
  }
}

function nodefromsubmit(id) {
  var newFrom = document.getElementById("selectnodefrom").value;
  var element = document.getElementById(id)
  pushAction("change", element)
  var fromId = checkId(newFrom);
  var type = fromId ? idType(fromId) : "";
  var dupCheck = 0;
  if (fromId) {
    var dupEdges = document.getElementsByClassName("edge " + element.dataset.nodeto + "edge " + fromId + "edge " + element.dataset.type)
    dupCheck = dupEdges.length == 0;
  }
  if (dupCheck) {
    element.dataset.nodefrom = fromId;
    updateGeneral(element)
  }
  document.getElementById("selectnodefrom").value = element.dataset.nodefrom;
}

function nodenamesubmit(id) {
  var element = document.getElementById(id);
  pushAction("change", element)
  element.dataset.name = document.getElementById("nodeselectname").value;
  document.getElementById("nodeselectname").blur();
}

function namesubmit(id) {
  var element = document.getElementById(id);
  pushAction("change", element)
  element.dataset.name = document.getElementById("selectname").value;
  document.getElementById("selectname").blur();
}

function nodetosubmit(id) {
  var newTo = document.getElementById("selectnodeto").value;
  var element = document.getElementById(id)
  pushAction("change", element)
  var toId = checkId(newTo);
  var type = toId ? idType(toId) : "";
  var dupCheck = 0;
  if (toId) {
    var dupEdges = document.getElementsByClassName("edge " + toId + "edge " + element.dataset.nodefrom + "edge " + element.dataset.type)
    dupCheck = dupEdges.length == 0;
  }
  if (dupCheck) {
    element.dataset.nodeto = toId;
    updateGeneral(element)
  }
  document.getElementById("selectnodeto").value = element.dataset.nodeto;
}

function distancesubmit(id) {
  var element = document.getElementById(id)
  pushAction("change", element)
  var newDist = document.getElementById("selectdistance").value;
  element.dataset.distance = newDist;
}

function speedsubmit(id) {
  var element = document.getElementById(id)
  pushAction("change", element)
  var newSpeed = document.getElementById("selectspeed").values;
  element.dataset.speed = newSpeed;
}
