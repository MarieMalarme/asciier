import { useState, useEffect } from 'react'

import { Component } from './utils/flags'
import { random, get_random_hex_color } from './utils/toolbox'

import glitch from './assets/images/noise.jpg'

import { AsciiImage } from './components/AsciiImage'
import { ControlPanel } from './components/ControlPanel'

export const Home = () => {
  const [canvas, set_canvas] = useState(null)
  const [wrapper, set_wrapper] = useState(null)
  const [image, set_image] = useState(glitch)
  const [ascii_lines, set_ascii_lines] = useState([])
  const [multicolor_mode_on, set_multicolor_mode_on] = useState(false)

  // customizable input parameters
  const [patterns, set_patterns] = useState(base_patterns)
  const [patterns_per_line, set_patterns_per_line] = useState(100)
  const [colors, set_colors] = useState(base_colors)

  useEffect(() => {
    if (!canvas || !wrapper) return
    const context = canvas.getContext('2d')
    load_image(context)
  }, [canvas, wrapper, patterns, patterns_per_line, image])

  const load_image = (context) => {
    const img = new Image()
    img.onload = () => {
      const ratio = img.height / img.width
      const target_width = Math.round(patterns_per_line)
      const target_height = Math.floor(target_width * ratio)
      const img_dimensions = [0, 0, img.width, img.height]
      const target_dimensions = [0, 0, target_width, target_height]

      canvas.width = target_width
      canvas.height = target_height

      context.drawImage(img, ...img_dimensions, ...target_dimensions)
      const pixels = context.getImageData(...target_dimensions).data

      let patterns_list = []
      const chunk_size = 4
      for (let i = 0; i < pixels.length; i += chunk_size) {
        const [red, green, blue] = pixels.slice(i, i + chunk_size)
        const grey = Math.floor((red + green + blue) / 3)
        const index = Math.floor(grey / (255 / patterns.length))
        const matching_pattern = patterns[index]
        patterns_list.push(matching_pattern || patterns.at(0))
      }

      let lines = []
      for (let i = 0; i < patterns_list.length; i += patterns_per_line) {
        lines.push(patterns_list.slice(i, i + patterns_per_line))
      }

      set_ascii_lines(lines)
    }
    img.src = image
  }

  return (
    <Wrapper style={{ background: colors[0] }} elemRef={set_wrapper}>
      <ControlPanel
        ascii_lines={ascii_lines}
        image={image}
        set_image={set_image}
        colors={colors}
        set_colors={set_colors}
        patterns={patterns}
        set_patterns={set_patterns}
        patterns_per_line={patterns_per_line}
        set_patterns_per_line={set_patterns_per_line}
        multicolor_mode_on={multicolor_mode_on}
        set_multicolor_mode_on={set_multicolor_mode_on}
        set_canvas={set_canvas}
      />

      <Canvas elemRef={set_canvas} width="0" height="0" />

      <AsciiImage
        ascii_lines={ascii_lines}
        colors={colors}
        multicolor_mode_on={multicolor_mode_on}
      />
    </Wrapper>
  )
}

const color_harmonies = [
  ['#097141', '#ffb3b3'],
  ['#665492', '#fcff2e'],
  ['#327071', '#ffa3a3'],
  ['#d1ff99', '#1e00ff'],
  ['#c09eff', '#71ff3d'],
  ['#ffb3b3', '#097141'],
  ['#fcff2e', '#665492'],
  ['#ffa3a3', '#327071'],
  ['#1e00ff', '#d1ff99'],
  ['#71ff3d', '#c09eff'],
]
const base_colors = color_harmonies[random(0, color_harmonies.length - 1)]
const base_characters = ['+', '{}', '┋', '⌾', '⌗⌗', '@', '▲', '888', '▤']
const base_patterns = base_characters.map((character) => ({
  character,
  color: get_random_hex_color(),
  background: get_random_hex_color(),
}))

const Wrapper =
  Component.w100vw.h100vh.relative.flex.ai_center.jc_center.article()
const Canvas = Component.none.canvas()

export default Home
