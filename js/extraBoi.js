function addEdge(container, edge, cg) {
  /*
    This if statement checks to see if the type of the current node is
    'PowerLine', and if it is, moves the edge up 15 pixels and to the left
    15 pixels, and colors the edge gold.
  */
  var edgeEle = document.createElementNS("http://www.w3.org/2000/svg", "path"),
      edgeEleId = edge.id,
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
    } else if (name == "rect") {
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

  // Sets oneway markers for roads
  if (newEdge.oneway && validTypes["edge"]["Road"].includes(newEdge.type)) {
    var anim = document.createElementNS("http://www.w3.org/2000/svg", "animateMotion"),
        marker = document.createElementNS("http://www.w3.org/2000/svg", "path");

    var angle = 180 * Math.atan2(y2 - y1, x2 - x1) / Math.PI;
    var disto = Math.pow( Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) ,0.5);

    marker.setAttribute("id", id + "marker");
    marker.setAttribute("d", "M 0 0 L 26 15 L 0 30");
    marker.setAttribute("transform", "rotate(" + angle + ") translate(-15, -15)");
    marker.setAttribute("stroke", "black");
    marker.setAttribute("stroke-width", "5");
    marker.setAttribute("stroke-linecap", "round");
    marker.setAttribute("fill", "none");

    marker.classList.add("edgeMarker", "Road");

    anim.setAttribute("path", path);
    anim.setAttribute("repeatCount", "indefinite");
    anim.setAttribute("dur", (disto * 0.02) + "s");

    marker.appendChild(anim);
    innerG.appendChild(marker);
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

  container.appendChild(edgeEle);
}
