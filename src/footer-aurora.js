const WIDTH = 1440
const HEIGHT = 240
const SAMPLES = 36
const RAY_COUNT = 7

function buildSmoothPath(points, closeBottom = true) {
  let d = `M ${points[0][0].toFixed(1)} ${points[0][1].toFixed(1)}`
  for (let i = 0; i < points.length - 1; i++) {
    const [x0, y0] = points[i]
    const [x1, y1] = points[i + 1]
    const mx = (x0 + x1) * 0.5
    const my = (y0 + y1) * 0.5
    d += ` Q ${x0.toFixed(1)} ${y0.toFixed(1)} ${mx.toFixed(1)} ${my.toFixed(1)}`
  }
  const last = points[points.length - 1]
  d += ` L ${last[0].toFixed(1)} ${last[1].toFixed(1)}`
  if (closeBottom) d += ` L ${WIDTH} ${HEIGHT} L 0 ${HEIGHT} Z`
  return d
}

/**
 * Animates layered SVG aurora curtains, shore waves with incoming sunset glow,
 * and shallow-water liquid repulsion on pointer hover inside `.site-footer`.
 */
export function initFooterAurora(reducedMotion) {
  const footer = document.querySelector('.site-footer')
  const svg = document.querySelector('#footer-aurora-svg')
  if (!footer || !svg) return

  const skyPath = svg.querySelector('#fa-path-sky')
  const w1Path = svg.querySelector('#fa-path-w1')
  const w2Path = svg.querySelector('#fa-path-w2')
  const w3Path = svg.querySelector('#fa-path-w3')
  const w3SunsetPath = svg.querySelector('#fa-path-w3-sunset')
  const w4Path = svg.querySelector('#fa-path-w4')
  const w4SunsetPath = svg.querySelector('#fa-path-w4-sunset')
  const raysGroup = svg.querySelector('#fa-rays-group')

  const rayEls = Array.from({ length: RAY_COUNT }, (_, i) => {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    path.setAttribute('fill', i % 2 === 0 ? 'url(#fa-ray-grad-a)' : 'url(#fa-ray-grad-b)')
    raysGroup.appendChild(path)
    return path
  })

  // 1D shallow-water spring nodes so cursor pushes waves like liquid and ripples outward
  const waterY = new Float32Array(SAMPLES + 1)
  const waterV = new Float32Array(SAMPLES + 1)
  const nextY = new Float32Array(SAMPLES + 1)

  let pointerU = 0.5
  let pointerStrength = 0
  let pointerDrift = 0
  let lastClientX = 0
  let hasPointer = false
  let inView = true
  let rafId = 0
  let startTime = performance.now()

  const stepWater = () => {
    // Relax pointer injection even while hovering still so waves move away then come back
    pointerStrength *= 0.92
    pointerDrift *= 0.9

    for (let i = 0; i <= SAMPLES; i++) {
      const u = i / SAMPLES
      const dist = u - pointerU
      const gaussian = Math.exp(-(dist * dist) / 0.0085)
      const target = pointerStrength * gaussian * 52
      const spring = (target - waterY[i]) * 0.14
      const left = i > 0 ? waterY[i - 1] : waterY[i] * 0.6
      const right = i < SAMPLES ? waterY[i + 1] : waterY[i] * 0.6
      const neighbor = (left + right - 2 * waterY[i]) * 0.24
      waterV[i] = (waterV[i] + spring + neighbor) * 0.86
      nextY[i] = waterY[i] + waterV[i]
    }
    for (let i = 0; i <= SAMPLES; i++) {
      waterY[i] = Math.max(-42, Math.min(72, nextY[i]))
    }
  }

  const archCurve = (u, phase = 0) => 0.44 + 0.56 * Math.pow(0.5 + 0.5 * Math.cos(4 * Math.PI * u + phase), 0.9)

  const renderFrame = now => {
    const t = reducedMotion.matches ? 2.4 : (now - startTime) * 0.001
    if (!reducedMotion.matches) stepWater()

    // Wave surge oscillators (0 -> 1 when incoming onto the shore)
    const surge3 = 0.5 + 0.5 * Math.sin(t * 0.52 - 0.8)
    const surge4 = 0.5 + 0.5 * Math.sin(t * 0.41 + 1.9)
    const lift3 = Math.pow(surge3, 1.6) * 24
    const lift4 = Math.pow(surge4, 1.6) * 20

    const skyPts = []
    const w1Pts = []
    const w2Pts = []
    const w3Pts = []
    const w4Pts = []

    for (let i = 0; i <= SAMPLES; i++) {
      const u = i / SAMPLES
      const x = u * WIDTH
      const sway = Math.sin(t * 0.25) * 0.14
      const arch = archCurve(u)
      const arch1 = archCurve(u, sway)
      const arch2 = archCurve(u, -sway * 1.15)
      const arch3 = archCurve(u, sway * 0.85)
      const liq = waterY[i]
      const skew = pointerDrift * (0.4 + 0.6 * arch)

      const skyY = 136 - arch * 82 + Math.sin(u * 6.5 + t * 0.28) * 8 + Math.cos(u * 11 - t * 0.18) * 4 + liq * 0.35
      const y1 = 152 - arch1 * 72 + Math.sin(u * 8.2 + t * 0.45 + skew) * 9 + Math.sin(u * 15 - t * 0.3) * 4 + liq * 0.55
      const y2 = 168 - arch2 * 60 + Math.sin(u * 9.5 - t * 0.55 + skew * 1.1) * 10 + Math.cos(u * 18 + t * 0.36) * 5 + liq * 0.78
      const y3 = 186 - arch3 * 48 - lift3 + Math.sin(u * 10.5 + t * 0.72 + skew * 1.2) * 8 + Math.sin(u * 21 - t * 0.5) * 4 + liq * 1.0
      const y4 = 202 - arch * 36 - lift4 + Math.cos(u * 11.5 - t * 0.64 + skew * 1.3) * 7 + Math.sin(u * 23 + t * 0.48) * 3 + liq * 1.18

      skyPts.push([x, skyY])
      w1Pts.push([x, y1])
      w2Pts.push([x, y2])
      w3Pts.push([x, y3])
      w4Pts.push([x, y4])
    }

    skyPath.setAttribute('d', buildSmoothPath(skyPts))
    w1Path.setAttribute('d', buildSmoothPath(w1Pts))
    w2Path.setAttribute('d', buildSmoothPath(w2Pts))
    const d3 = buildSmoothPath(w3Pts)
    const d4 = buildSmoothPath(w4Pts)
    w3Path.setAttribute('d', d3)
    w3SunsetPath.setAttribute('d', d3)
    w4Path.setAttribute('d', d4)
    w4SunsetPath.setAttribute('d', d4)

    // Incoming shore waves bloom warm orange/sunset at peak surge, then settle back to normal aurora
    const glow3 = Math.pow(surge3, 2.2)
    const glow4 = Math.pow(surge4, 2.2)
    w3SunsetPath.setAttribute('opacity', (0.06 + glow3 * 0.86).toFixed(3))
    w4SunsetPath.setAttribute('opacity', (0.06 + glow4 * 0.82).toFixed(3))

    // Wide slanted aurora ray curtains rising smoothly behind the layered waves
    for (let r = 0; r < RAY_COUNT; r++) {
      const baseU = (r + 0.5) / RAY_COUNT
      const sway = Math.sin(t * 0.24 + r * 1.35) * 0.045
      const u = baseU + sway
      const cx = u * WIDTH
      const halfW = 86 + (r % 3) * 38
      const arch = archCurve(Math.max(0, Math.min(1, u)))
      const topY = 104 - arch * 68 + Math.cos(t * 0.32 + r) * 8
      const lean = 56 + Math.sin(t * 0.2 + r * 0.9) * 28 + waterY[Math.round(Math.max(0, Math.min(SAMPLES, u * SAMPLES)))] * 0.4
      const rayD = `M ${(cx - halfW * 0.55 + lean).toFixed(1)} ${topY.toFixed(1)} L ${(cx + halfW * 0.55 + lean).toFixed(1)} ${topY.toFixed(1)} L ${(cx + halfW).toFixed(1)} ${HEIGHT} L ${(cx - halfW).toFixed(1)} ${HEIGHT} Z`
      rayEls[r].setAttribute('d', rayD)
      rayEls[r].setAttribute('opacity', (0.38 + 0.34 * Math.sin(t * 0.35 + r * 1.7)).toFixed(3))
    }

    if (inView && !reducedMotion.matches) {
      rafId = requestAnimationFrame(renderFrame)
    } else {
      rafId = 0
    }
  }

  const ensureRunning = () => {
    if (!rafId && inView && !reducedMotion.matches) {
      rafId = requestAnimationFrame(renderFrame)
    }
  }

  footer.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch' || reducedMotion.matches) return
    const rect = footer.getBoundingClientRect()
    if (!rect.width) return
    const u = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width))
    const dx = hasPointer ? event.clientX - lastClientX : 0
    lastClientX = event.clientX
    hasPointer = true

    pointerU = u
    pointerStrength = Math.min(1.35, Math.max(0.65, Math.abs(dx) * 0.04 + 0.72))
    pointerDrift = Math.max(-0.45, Math.min(0.45, dx * 0.015))
  })

  footer.addEventListener('pointerleave', () => {
    hasPointer = false
    pointerStrength = 0
    pointerDrift = 0
  })

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      inView = entries[0]?.isIntersecting ?? true
      if (inView) ensureRunning()
    }, { threshold: 0 }).observe(footer)
  }

  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) {
      if (rafId) cancelAnimationFrame(rafId)
      rafId = 0
      waterY.fill(0)
      waterV.fill(0)
      renderFrame(performance.now())
    } else {
      ensureRunning()
    }
  })

  renderFrame(performance.now())
  ensureRunning()
}
