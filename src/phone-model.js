const frontYaw = -12
const rearYaw = 168
const restPitch = 3
const radians = Math.PI / 180
const demoPoses = {
  typing: [-13, 3],
  reading: [7, -2],
  action: [-6, 4],
  private: [11, 2],
  vox: [-7, -3],
}

function buildRails(body, front, rails) {
  const width = body.offsetWidth
  const height = body.offsetHeight
  const radius = parseFloat(getComputedStyle(front).borderTopLeftRadius)
  const corners = [
    [width - radius, radius, -90],
    [width - radius, height - radius, 0],
    [radius, height - radius, 90],
    [radius, radius, 180],
  ]
  const outline = []
  for (const [x, y, start] of corners) {
    for (let step = 0; step <= 6; step++) {
      const angle = (start + 15 * step) * radians
      outline.push([x + radius * Math.cos(angle), y + radius * Math.sin(angle)])
    }
  }

  const edges = outline.map(([x, y], index) => {
    const [nextX, nextY] = outline[(index + 1) % outline.length]
    const dx = nextX - x
    const dy = nextY - y
    const angle = Math.atan2(dy, dx)
    const light = 35 + 24 * Math.cos(angle + .8)
    const edge = document.createElement('span')
    edge.className = 'demo-phone-edge'
    edge.style.cssText = `--edge-x: ${x + dx / 2}px; --edge-y: ${y + dy / 2}px;
      --edge-width: ${Math.hypot(dx, dy) + .7}px; --edge-angle: ${angle}rad; --edge-light: ${light}%`
    return edge
  })
  rails.replaceChildren(...edges)
}

function observePhoneRails(body, front, rails) {
  const rebuild = () => buildRails(body, front, rails)
  new ResizeObserver(rebuild).observe(body)
}

export function initPhoneModel(container, { keyboardRotation = true, presentation = false } = {}) {
  const stage = container.querySelector('.demo-phone-stage')
  const body = stage.querySelector('.demo-phone-body')
  const front = stage.querySelector('#demo-phone-front')
  const rear = stage.querySelector('#demo-phone-rear')
  const rails = stage.querySelector('.demo-phone-rails')
  const flip = container.querySelector('#demo-phone-flip')
  let yaw = frontYaw
  let pitch = restPitch
  let drag
  let manualView = false
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)')

  observePhoneRails(body, front, rails)

  function rotate(nextYaw, nextPitch) {
    yaw = nextYaw
    const tiltLimit = presentation ? 15 : 28
    pitch = Math.max(-tiltLimit, Math.min(tiltLimit, nextPitch))
    body.style.setProperty('--phone-yaw', `${yaw}deg`)
    body.style.setProperty('--phone-pitch', `${pitch}deg`)
    const side = Math.cos(yaw * radians) >= 0 ? 'front' : 'rear'
    if (stage.dataset.phoneSide === side) return

    stage.dataset.phoneSide = side
    flip.textContent = side === 'front' ? 'View back' : 'View front'
    const departingFace = side === 'front' ? rear : front
    if (departingFace.contains(document.activeElement)) flip.focus({ preventScroll: true })
    front.inert = side !== 'front'
    rear.inert = side !== 'rear'
  }

  function nearestTurn(angle) {
    return angle + 360 * Math.round((yaw - angle) / 360)
  }

  function showFront() {
    rotate(nearestTurn(frontYaw), restPitch)
  }

  flip.addEventListener('click', () => {
    manualView = true
    if (stage.dataset.phoneSide === 'rear') showFront()
    else rotate(nearestTurn(rearYaw), restPitch)
  })

  stage.addEventListener('pointerdown', event => {
    if (!event.isPrimary || event.button !== 0 || event.target.closest('button, textarea, input, a')) return
    const matrix = new DOMMatrixReadOnly(getComputedStyle(body).transform)
    drag = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      width: body.offsetWidth,
      yaw: nearestTurn(Math.atan2(matrix.m31, matrix.m11) / radians),
      pitch: Math.atan2(matrix.m23, matrix.m22) / radians,
    }
    stage.setPointerCapture(event.pointerId)
  })

  stage.addEventListener('pointermove', event => {
    if (drag?.id !== event.pointerId) return
    const dx = event.clientX - drag.x
    const dy = event.clientY - drag.y
    if (!stage.hasAttribute('data-dragging') && Math.hypot(dx, dy) < 5) return
    manualView = true
    stage.setAttribute('data-dragging', '')
    rotate(drag.yaw + dx * 360 / drag.width, drag.pitch - dy * .4)
  })

  function stopDragging(event) {
    if (drag?.id !== event.pointerId) return
    const changed = stage.hasAttribute('data-dragging')
    drag = undefined
    stage.removeAttribute('data-dragging')
    if (presentation && changed) {
      const center = nearestTurn(stage.dataset.phoneSide === 'rear' ? 180 : 0)
      // Keep the selected face readable when the presenter releases the device.
      const offset = Math.max(-38, Math.min(38, yaw - center))
      rotate(center + offset, pitch)
    }
  }

  stage.addEventListener('lostpointercapture', stopDragging)
  stage.addEventListener('keydown', event => {
    if (!keyboardRotation || event.target !== stage) return
    const step = {
      ArrowLeft: [-15, 0],
      ArrowRight: [15, 0],
      ArrowUp: [0, -8],
      ArrowDown: [0, 8],
    }[event.key]
    if (!step) return
    event.preventDefault()
    manualView = true
    rotate(yaw + step[0], pitch + step[1])
  })

  function setDemoPose(pose) {
    if (manualView || drag || stage.dataset.phoneSide !== 'front') return
    if (reducedMotion.matches) {
      if (!keyboardRotation) rotate(nearestTurn(0), 0)
      return
    }
    const [angle, tilt] = demoPoses[pose]
    stage.dataset.demoPose = pose
    rotate(nearestTurn(presentation ? angle * .24 : angle), presentation ? tilt * .2 : tilt)
  }

  function followDemo() {
    manualView = false
    showFront()
  }

  return { showFront, followDemo, setDemoPose }
}

export function initPhoneFinish(container, onChange) {
  const logo = container.querySelector('#demo-phone-logo')
  const choices = container.querySelectorAll('[data-demo-theme]')

  function setFinish(finish) {
    container.dataset.theme = finish
    for (const choice of choices) {
      choice.setAttribute('aria-pressed', String(choice.dataset.demoTheme === finish))
    }
    const action = finish === 'ink' ? 'Switch phone to Paper' : 'Switch phone to Ink'
    logo.setAttribute('aria-label', action)
    logo.title = action
    onChange?.(finish)
  }

  logo.addEventListener('click', () => setFinish(container.dataset.theme === 'ink' ? 'paper' : 'ink'))
  for (const choice of choices) choice.addEventListener('click', () => setFinish(choice.dataset.demoTheme))
}
