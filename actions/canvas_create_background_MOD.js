module.exports = {

  name: 'Canvas Create Background',

  section: 'Image Editing',

  subtitle (data) {
    if (parseInt(data.info) === 0) {
      return data.color ? `Create with Color ${data.color}` : 'No color background has create'
    } else if (parseInt(data.info) === 1) {
      return data.gradient ? `Create with Gradient ${data.gradient}` : 'No gradient background has create'
    }
  },

  variableStorage (data, varType) {
    const type = parseInt(data.storage)
    if (type !== varType) return
    return ([data.varName, 'Image'])
  },

  fields: ['width', 'height', 'info', 'gradient', 'color', 'storage', 'varName'],

  html (isEvent, data) {
    return `
  <div>
    <div style="float: left; width: 46%;">
      Width(px):<br>
      <input id="width" class="round" type="text"><br>
    </div>
    <div style="padding-left: 3px; float: left; width: 49%;">
      Height(px):<br>
      <input id="height" class="round" type="text"><br>
    </div>
  </div><br><br><br>
  <div>
    <div style="float: left; width: 92%;">
      Fill:
      <select id="info" class="round" onchange="glob.onChange0(this)">
        <option value="0" selected>Solid Color</option>
        <option value="1">Gradient Color</option>
      </select>
    <div>
  <div><br>
    <div id="Gradient" style="display: none; float: left; width: 109%;">
      Gradient:<br>
      <textarea id="gradient" rows="5" placeholder="Insert var lingrad = ctx.createLinearGradient()... here" style="width: 92%; white-space: nowrap;"></textarea><br>
    </div>
    <div id="Solid" style="float: left; width: 111%;">
      Color:<br>
      <input id="color" class="round" type="text" placeholder="Insert Color Hex code here"><br>
    </div>
  <div><br><br><br>
  <div>
    <div style="float: left; width: 35%;">
      Store In:<br>
      <select id="storage" class="round">
        ${data.variables[1]}
      </select>
    </div>
    <div style="float: right; width: 60%;">
      Variable Name:<br>
      <input id="varName" class="round" type="text"><br>
    </div>
  </div>`
  },

  init () {
    const { glob, document } = this

    const gradient = document.getElementById('Gradient')
    const solid = document.getElementById('Solid')

    glob.onChange0 = function (event) {
      switch (parseInt(event.value)) {
        case 0:
          gradient.style.display = 'none'
          solid.style.display = null
          break
        case 1:
          gradient.style.display = null
          solid.style.display = 'none'
          break
      }
    }
    glob.onChange0(document.getElementById('info'))
  },

  action (cache) {
    const data = cache.actions[cache.index]
    const Canvas = require('canvas')
    const width = parseInt(this.evalMessage(data.width, cache))
    const height = parseInt(this.evalMessage(data.height, cache))
    const info = parseInt(data.info)
    const canvas = Canvas.createCanvas(width, height)
    const ctx = canvas.getContext('2d')
    switch (info) {
      case 0: {
        let color = this.evalMessage(data.color, cache)
        if (!color.startsWith('#')) {
          color = '#' + color
        }
        ctx.fillStyle = color
        ctx.rect(0, 0, width, height)
        ctx.fill()
        break
      }
      case 1: {
        const gradient = String(this.evalMessage(data.gradient, cache))
        // eslint-disable-next-line no-eval
        eval(gradient)
        break
      }
    }
    const result = new this.Canvas.Image(canvas.toDataURL('image/png'))
    const varName = this.evalMessage(data.varName, cache)
    const storage = parseInt(data.storage)
    this.storeValue(result, storage, varName, cache)
    this.callNextAction(cache)
  },

  mod () {
  }

}
