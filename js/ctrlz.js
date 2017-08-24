var actionStack = [];

function initializeUndo () {
  window.addEventListener("keydown", ctrlz)
}

function ctrlz(e) {
  var evtobj = window.event? event : e
  if (evtobj.keyCode == 90 && evtobj.ctrlKey && actionStack.length > 0) {
    action = actionStack.pop()
    if (action[0] === "add") {
      var ele = document.getElementById(action[1])
      ele.parentElement.removeChild(ele)
    } else if (action[0] === "remove") {
      var ele = action[1]
      if (ele.classList.contains("node")) {
        var newNode = {}
        var name = ele.nodeName.toLowerCase()
        if (name == "circle") {
          newNode.cx = ele.getAttribute("cx")
          newNode.cy = ele.getAttribute("cy")
        } else if (name == "rect") {
          var wid = parseInt(ele.getAttribute("width"))
          var hei = parseInt(ele.getAttribute("height"))
          newNode.cx = parseInt(ele.getAttribute("x")) + (0.5 * wid)
          newNode.cy = parseInt(ele.getAttribute("y")) + (0.5 * hei)
        } else {
          var box = ele.getBBox()
          var wid = parseInt(box.getAttribute("width"))
          var hei = parseInt(box.getAttribute("height"))
          newNode.cx = parseInt(box.getAttribute("x")) + (0.5 * wid)
          newNode.cy = parseInt(box.getAttribute("y")) + (0.5 * hei)
        }
        newNode.id = ele.getAttribute("id")
        newNode.name = ele.dataset.name
        newNode.type = ele.dataset.type
        addNode(document.getElementById("innerSVG"), newNode)
        setMenu(document.getElementById(newNode.id))
        addNodeHover(newNode.id, newNode.type)

      } else if (ele.classList.contains("edge")) {
        var newEdge = {}
        newEdge.id = ele.getAttribute("id")
        newEdge.name = ele.dataset.name
        newEdge.id1 = ele.dataset.nodefrom
        newEdge.id2 = ele.dataset.nodeto
        newEdge.type = ele.dataset.type
        if (ele.dataset.direction == "1") {newEdge.oneway = 1}
        if (ele.dataset.distance) {newEdge.distance = ele.dataset.distance}
        if (ele.dataset.speed) {newEdge.speed = ele.dataset.speed}
        addEdge(document.getElementById("innerSVG"), newEdge, 0)
        setMenu(document.getElementById(newEdge.id))
        addEdgeHover(newEdge.id)
      }
    } else if (action[0] === "change") {
      updateGeneral(action[1])
      setMenu(action[1])
      updateDisplay(action[1])
    } else if (action[0] === "move") {
      var ele = document.getElementById(action[1][0].getAttribute("id"))
      var name = ele.nodeName.toLowerCase()
      if (name == "circle") {
        ele.setAttribute("cx", action[1][0].getAttribute("cx"))
        ele.setAttribute("cy", action[1][0].getAttribute("cy"))
      } else {
        ele.setAttribute("x", parseInt(action[1][0].getAttribute("x")) + 10)
        ele.setAttribute("y", parseInt(action[1][0].getAttribute("y")) + 10)
      }

      for (var i = 1; i < action[1].length; i++) {
        setEdge = document.getElementById(action[1][i].getAttribute("id"))


        setEdge.setAttribute("d", action[1][i].getAttribute("d"))
        if (setEdge.dataset.direction == "1" && validTypes["edge"]["Road"].includes(setEdge.dataset.type)) {
          var markers = document.getElementsByClassName(action[1][i].getAttribute("id") + "marker")
          while (markers[0]) {markers[0].parentElement.removeChild(markers[0])}
          var length = setEdge.getTotalLength();
          for (var j = 0.25; j < 1; j += 0.5) {
            setMarker(length * j, setEdge, document.getElementById("innerSVG"))
          }
        }
      }
    }
  }
}

function pushAction(type, element, elements) {
  if (type.toLowerCase() == "move") {
    var actionArray = [element.cloneNode(true)]
    for (var i = 0; i < elements.length; i++) {
      actionArray.push(elements[i].cloneNode(true))
    }
    actionStack.push([type, actionArray])
  } else if (type.toLowerCase() == "add") {
    if (elements) {
      var actionArray = [elements[0].cloneNode(true), element]
      for (var i = 1; i < elements.length; i++) {
        actionArray.push(elements[i])
      }
      actionStack.push([type, actionArray])
    } else {
      actionStack.push([type, [element]])
    }
  } else {
    actionStack.push([type, element.cloneNode(true)])
  }
}
