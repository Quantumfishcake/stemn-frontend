/* eslint-disable */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(() => factory())
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory()
  } else {
    root.ViewEERenderer = factory()
  }
}(this, () => {
  // ---------------
  // --- DRAWING ---
  // ---------------

  function ViewEERenderer(board) {
    let canvas = board.canvas,
      ctx    = canvas.getContext('2d')

    this.canvas = canvas
    this.board  = board

    this.warnings = []
  }

  /**
	 * Returns scope of current rendering — layer, element/package
	 * @param {object} ctx   Rendering context
	 * @param {object} attrs Attributes attached to the rendering context
	 */
  ViewEERenderer.prototype.getScope = function (ctx, attrs) {
    throw 'not implemented'
  }

  ViewEERenderer.prototype.drawPlainWires = function (layer, ctx) {
    if (!layer) { return }

    const board = this.board

    const layerCtx = this.getScope(ctx, { name: layer.name })

    const layerWires = board.plainWires[layer.number] || []

    layerWires.forEach(function (wire) {
      this.drawSingleWire(Object.assign(
        {}, wire,
        {
          cap: 'round',
          strokeStyle: board.layerColor(layer.color),
          width: wire.width || board.minLineWidth,
        },
      ), layerCtx)
    }, this)
  }

  ViewEERenderer.prototype.drawSignalWires = function (layer, ctx) {
    if (!layer) { return }
    const layerNumber = layer.number

    const layerCtx = this.getScope(ctx, { name: layer.name })

    const board = this.board

    for (const signalKey in board.signalItems) {
      var signalCtx = this.getScope(layerCtx, { name: signalKey })

      const highlight = (board.highlightedItem && (board.highlightedItem.type == 'signal') && (board.highlightedItem.name == signalKey))
      var color = highlight ? board.highlightColor(layer.color) : board.layerColor(layer.color)

      let signalLayers = board.signalItems[signalKey],
        layerItems = signalLayers[layer.number]
      if (!layerItems) { continue }
      const layerWires = layerItems.wires || []

      layerWires.forEach(function (wire) {
        // TODO: join wires
        // console.log (wire);
        this.drawSingleWire(Object.assign(
          {}, wire,
          { cap: 'round', strokeStyle: color },
        ), signalCtx)
      }, this)
    }
  }

  ViewEERenderer.prototype.drawSignalVias = function (layersName, ctx, color) {
    if (!layersName) return

    const layerCtx = this.getScope(ctx, { name: 'via' })

    const board = this.board

    for (const signalKey in board.signalItems) {
      let signalLayers = board.signalItems[signalKey],
        layerItems = signalLayers[layersName]
      if (!layerItems) { continue }
      const layerVias = layerItems.vias || []
      layerVias.forEach(function (via) {
        this.drawHole(Object.assign({}, via, {
          strokeStyle: color,
          diameter: via.diameter || 1.5 * via.drill, // TODO: bad width
        }), layerCtx)
      }, this)
    }
  }

  ViewEERenderer.prototype.drawPlainTexts = function (layer, ctx) {
    if (!layer) return

    const layerCtx = this.getScope(ctx, { name: layer.name })

    const board = this.board

    const layerTexts = board.plainTexts[layer.number] || []

    const color = board.layerColor(layer.color)

    layerTexts.forEach(function (text) {
      const content = text.content

      const attrs = {
        color,
        content,
      }

      this.drawText(attrs, text, layerCtx)
    }, this)
  }

  ViewEERenderer.prototype.drawElements = function (layer, ctx) {
    if (!layer) return

    const layerCtx = this.getScope(ctx, { name: layer.name })

    const board = this.board

    for (const elemKey in board.elements) {
      var elem = board.elements[elemKey]

      var elemCtx = this.getScope(layerCtx, { name: elemKey })

      const highlight = (board.highlightedItem && (board.highlightedItem.type == 'element') && (board.highlightedItem.name == elem.name))
      var color     = highlight ? board.highlightColor(layer.color) : board.layerColor(layer.color)

      const pkg    = typeof elem.pkg === 'string' ? board.packagesByName[elem.pkg] : elem.pkg
      var rotMat = elem.matrix
      pkg.smds.forEach(function (smd) {
        let layerNum = smd.layer
        if (elem.mirror) { layerNum = board.mirrorLayer(layerNum) }
        if (layer.number != layerNum) { return }

        let smdDX = smd.x2 - smd.x1,
          smdDY = smd.y2 - smd.y1,
          // smd center
          smdX  = smd.x1 + smdDX / 2,
          smdY  = smd.y1 + smdDY / 2,
          smdXDir = smdDX / Math.abs(smdDX),
          smdYDir = smdDY / Math.abs(smdDY),
          smdDx1 = smd.x1,
          smdDx2 = smd.x2,
          smdDy1 = smd.y1,
          smdDy2 = smd.y2

        let borderRadius = Math.min(Math.abs(smdDX), Math.abs(smdDY)) / 2
        if (smd.roundness) {
          borderRadius *= smd.roundness / 100
          smdDx1 += 1 * smdXDir * borderRadius,
          smdDx2 -= 1 * smdXDir * borderRadius,
          smdDy1 += 1 * smdYDir * borderRadius,
          smdDy2 -= 1 * smdYDir * borderRadius
          var drawSmdCircle = (smd.roundness === 100 && Math.abs(smdDX) === Math.abs(smdDY))
        }

        const smdRotMat = board.matrixForRot(smd.rot)
        let smdX1 = smdX + smdRotMat[0] * (smdX - smdDx1) + smdRotMat[1] * (smdY - smdDy1),	// top left
          smdY1 = smdY + smdRotMat[2] * (smdX - smdDx1) + smdRotMat[3] * (smdY - smdDy1),
          smdX2 = smdX + smdRotMat[0] * (smdX - smdDx2) + smdRotMat[1] * (smdY - smdDy2),	// top right
          smdY2 = smdY + smdRotMat[2] * (smdX - smdDx2) + smdRotMat[3] * (smdY - smdDy2)


        // Note that rotation might be not axis aligned, so we have do transform all corners
        let x1 = elem.x + rotMat[0] * smdX1 + rotMat[1] * smdY1,	// top left
          y1 = elem.y + rotMat[2] * smdX1 + rotMat[3] * smdY1,
          x2 = elem.x + rotMat[0] * smdX2 + rotMat[1] * smdY1,	// top right
          y2 = elem.y + rotMat[2] * smdX2 + rotMat[3] * smdY1,
          x3 = elem.x + rotMat[0] * smdX2 + rotMat[1] * smdY2,	// bottom right
          y3 = elem.y + rotMat[2] * smdX2 + rotMat[3] * smdY2,
          x4 = elem.x + rotMat[0] * smdX1 + rotMat[1] * smdY2,	// bottom left
          y4 = elem.y + rotMat[2] * smdX1 + rotMat[3] * smdY2

        let padName = smd.name,
          signalName = elem.padSignals[padName],
          highlightPad = (board.highlightedItem && (board.highlightedItem.type == 'signal') && (board.highlightedItem.name == signalName))

        if (drawSmdCircle) {
          this.drawFilledCircle(Object.assign({}, smd, {
            x: x1 - (x2 - x1) / 2,
            y: y1 - (y2 - y1) / 2,
            radius: borderRadius,
            fillStyle: color,
            strokeWidth: borderRadius * 2,
            strokeStyle: smd.roundness ? color : null,
          }), elemCtx)
        } else {
          const points = [{ x: x1, y: y1 }, { x: x2, y: y2 }, { x: x3, y: y3 }, { x: x4, y: y4 }]

          this.drawFilledPoly(Object.assign({}, smd, {
            points,
            fillStyle: color,
            strokeWidth: borderRadius * 2,
            strokeStyle: smd.roundness ? color : null,
          }), elemCtx)
        }
      }, this)

      if (pkg.rects) {
        pkg.rects.forEach(function (rect) {
          let layerNum = rect.layer
          if (elem.mirror) { layerNum = board.mirrorLayer(layerNum) }
          if (layer.number != layerNum) { return }

          // Note that rotation might be not axis aligned, so we have do transform all corners
          let x1 = elem.x + rotMat[0] * rect.x1 + rotMat[1] * rect.y1,	// top left
            y1 = elem.y + rotMat[2] * rect.x1 + rotMat[3] * rect.y1,
            x2 = elem.x + rotMat[0] * rect.x2 + rotMat[1] * rect.y1,	// top right
            y2 = elem.y + rotMat[2] * rect.x2 + rotMat[3] * rect.y1,
            x3 = elem.x + rotMat[0] * rect.x2 + rotMat[1] * rect.y2,	// bottom right
            y3 = elem.y + rotMat[2] * rect.x2 + rotMat[3] * rect.y2,
            x4 = elem.x + rotMat[0] * rect.x1 + rotMat[1] * rect.y2,	// bottom left
            y4 = elem.y + rotMat[2] * rect.x1 + rotMat[3] * rect.y2

          let padName = rect.name,
            signalName = elem.padSignals[padName],
            highlightPad = (board.highlightedItem && (board.highlightedItem.type == 'signal') && (board.highlightedItem.name == signalName)),
            points = [{ x: x1, y: y1 }, { x: x2, y: y2 }, { x: x3, y: y3 }, { x: x4, y: y4 }]

          this.drawFilledPoly(Object.assign({}, rect, {
            points,
            fillStyle: highlightPad ? board.highlightColor(layer.color) : color,
          // strokeStyle: color,
          }), elemCtx)
        }, this) 
      }

      pkg.polys.forEach(function (poly) {
        let layerNum = poly.layer
        if (elem.mirror) { layerNum = board.mirrorLayer(layerNum) }
        if (layer.number != layerNum) { return  }

        const points = []
        for (let vId = 0; vId < poly.vertexes.length; vId++) {
          let vertex = poly.vertexes[vId],
            x1  = elem.x + rotMat[0] * vertex.x  + rotMat[1] * vertex.y,
            y1  = elem.y + rotMat[2] * vertex.x  + rotMat[3] * vertex.y

          points.push({ x: x1, y: y1 })
        }

        this.drawFilledPoly(Object.assign({}, poly, {
          points,
          fillStyle: color,
        }), elemCtx)
      }, this)

      pkg.wires.forEach(function (wire) {
        let layerNum = wire.layer
        if (elem.mirror) { layerNum = board.mirrorLayer(layerNum) }
        if (layer.number != layerNum) { return  }
        let x  = elem.x + rotMat[0] * wire.x  + rotMat[1] * wire.y,
          y  = elem.y + rotMat[2] * wire.x  + rotMat[3] * wire.y,
          x1 = elem.x + rotMat[0] * wire.x1 + rotMat[1] * wire.y1,
          y1 = elem.y + rotMat[2] * wire.x1 + rotMat[3] * wire.y1,
          x2 = elem.x + rotMat[0] * wire.x2 + rotMat[1] * wire.y2,
          y2 = elem.y + rotMat[2] * wire.x2 + rotMat[3] * wire.y2

        this.drawSingleWire({
          cap: wire.cap,
          width: wire.width,
          curve: wire.curve,
          rot: elem.rot,
          x1,
          y1,
          x2,
          y2,
          x,
          y,
          radius: wire.radius,
          angle: wire.angle,
          start: wire.start,
          strokeStyle: color,
        }, elemCtx)
      }, this)

      // TODO: pads can be rotated too
      pkg.pads.forEach(function (pad) {
        const layerNum = pad.layer
        // We don't need to check layers, pads is pass through all layers
        let x = elem.x + rotMat[0] * pad.x + rotMat[1] * pad.y,
          y = elem.y + rotMat[2] * pad.x + rotMat[3] * pad.y

        let lineWidth = (pad.diameter - pad.drill) / 2
        if (lineWidth <= 0) lineWidth = board.minLineWidth

        // TODO: make sure calculations is correct
        this.drawHole(Object.assign({}, pad, {
          x,
          y,
          strokeWidth: lineWidth,
          strokeStyle: board.viaPadColor(), // ouline/dimension color
        }), elemCtx)
      }, this)

      pkg.holes.forEach(function (hole) {
        const layerNum = hole.layer
        // We don't need to check layers, holes is pass through all layers
        let x = elem.x + rotMat[0] * hole.x + rotMat[1] * hole.y,
          y = elem.y + rotMat[2] * hole.x + rotMat[3] * hole.y

        this.drawHole(Object.assign({}, hole, {
          x,
          y,
          strokeWidth: board.minLineWidth,
          strokeStyle: board.layerColor(15), // ouline/dimension color
        }), elemCtx)
      }, this)

      let smashed = elem.smashed,
        absText = elem.absText === undefined ? elem.smashed : elem.absText,
        textCollection = smashed ? elem.attributes : pkg.texts	// smashed : use element attributes instead of package texts
      for (const textIdx in textCollection) {
        if (!textCollection.hasOwnProperty(textIdx)) continue
        const text = textCollection[textIdx]
        if (smashed && (text.display === 'off' || !text.font)) continue
        let layerNum = text.layer
        if ((!elem.smashed) && (elem.mirror)) {
          layerNum = board.mirrorLayer(layerNum)
        }
        if (layer.number != layerNum) { continue }

        let content = smashed ? null : text.content,
          attribName = smashed ? text.name : ((text.content.indexOf('>') == 0) ? text.content.substring(1) : null)
        if (attribName == 'NAME')  { content = elem.name  }
        if (attribName == 'VALUE') { content = elem.value }
        if (!content) { continue }

        let x = absText ? text.x : (elem.x + rotMat[0] * text.x + rotMat[1] * text.y),
          y = absText ? text.y : (elem.y + rotMat[2] * text.x + rotMat[3] * text.y),
          rot = smashed ? text.rot : elem.rot,
          flipText = smashed ? text.flipText : elem.flipText,
          size = text.size

        if (!text.size) continue

        this.drawText({
          x, y, content, color, rot, flipText,
        }, text, elemCtx)
      }
    }
  }

  ViewEERenderer.prototype.dimCanvas = function (ctx, alpha) {
    ctx.save()
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.globalCompositeOperation = 'destination-out'
    ctx.fillStyle = `rgba(0,0,0,${alpha})`
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.restore()
  }

  return ViewEERenderer
}))
