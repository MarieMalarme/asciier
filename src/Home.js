import { Fragment, useState, useEffect } from 'react'
import { Component, Div } from './flags'
import glitch from './grey_gradient.jpeg'

export const Home = () => {
  const [canvas, set_canvas] = useState(null)
  const [wrapper, set_wrapper] = useState(null)
  const [image, set_image] = useState(glitch)
  const [ascii_lines, set_ascii_lines] = useState([])
  const [copy_text, set_copy_text] = useState('Copy ASCII image')
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
      <ControlsPanel
        image={image}
        set_image={set_image}
        colors={colors}
        set_colors={set_colors}
        patterns={patterns}
        set_patterns={set_patterns}
        copy_text={copy_text}
        set_copy_text={set_copy_text}
        patterns_per_line={patterns_per_line}
        set_patterns_per_line={set_patterns_per_line}
        multicolor_mode_on={multicolor_mode_on}
        set_multicolor_mode_on={set_multicolor_mode_on}
        set_canvas={set_canvas}
        ascii_lines={ascii_lines}
      />

      <Canvas none elemRef={set_canvas} width="0" height="0" />

      <AsciiImage>
        {ascii_lines.map((line, index) => (
          <Line key={index}>
            {line.map((pattern, index) => {
              const background = multicolor_mode_on ? pattern.background : ''
              const color = multicolor_mode_on ? pattern.color : colors[1]
              return (
                <Character key={index} style={{ background, color }}>
                  {pattern.character}
                </Character>
              )
            })}
          </Line>
        ))}
      </AsciiImage>
    </Wrapper>
  )
}

const ControlsPanel = (props) => {
  const { patterns_per_line, set_patterns_per_line } = props
  const { multicolor_mode_on, set_multicolor_mode_on } = props
  const { patterns, set_patterns, ascii_lines } = props
  const { image, set_image, copy_text, set_copy_text } = props
  const { colors, set_colors } = props

  const [is_open, set_is_open] = useState(false)

  return (
    <Fragment>
      <Toggle
        onClick={() => set_is_open(!is_open)}
        style={{ left: is_open ? 355 : 30 }}
        pv10={!is_open}
        ph20={!is_open}
        fs15={is_open}
        w20={is_open}
        h20={is_open}
      >
        {is_open ? '×' : 'Open settings'}
      </Toggle>

      {is_open && (
        <Controls>
          <Div mb10 relative flex ai_center jc_center>
            <LoadedImage src={image} />
            <Label>
              <LabelText>Import image</LabelText>
              <UploadInput
                type="file"
                onChange={(event) => {
                  const reader = new FileReader()
                  reader.onload = (event) => set_image(event.target.result)
                  if (event.target.files[0]) {
                    reader.readAsDataURL(event.target.files[0])
                  }
                }}
              />
            </Label>
          </Div>

          <Div mt10 flex ai_center>
            Multicolor mode
            <Div
              bb
              b_white={multicolor_mode_on}
              ml15
              c_pointer
              o30={multicolor_mode_on}
              hover_o50={multicolor_mode_on}
              onClick={() => set_multicolor_mode_on(false)}
            >
              OFF
            </Div>
            <Div
              bb
              b_white={!multicolor_mode_on}
              ml10
              c_pointer
              o30={!multicolor_mode_on}
              hover_o50={!multicolor_mode_on}
              onClick={() => set_multicolor_mode_on(true)}
            >
              ON
            </Div>
          </Div>

          <ColorsInputs flex w100p jc_between mb5 mt10>
            <Div flex ai_center>
              Background color
              <ColorInput
                ml10
                type="color"
                value={colors[0]}
                onInput={(event) => set_colors([event.target.value, colors[1]])}
              />
            </Div>
            <Svg
              width={12}
              viewBox="0 0 160 200"
              xmlns="http://www.w3.org/2000/svg"
              o25={multicolor_mode_on}
              c_pointer={multicolor_mode_on}
              onClick={() =>
                !multicolor_mode_on && set_colors([colors[1], colors[0]])
              }
            >
              <path
                fill="none"
                stroke="black"
                strokeWidth={8.5}
                d="m101.6 101.85 47.65 47.65-47.65 47.65M10.75 149.5h137.84M57.9 98.15 10.25 50.5 57.9 2.85M149.75 50.5H10.91"
              />
            </Svg>
            <Div o25={multicolor_mode_on} flex ai_center>
              Characters color
              <ColorInput
                ml10
                type="color"
                value={colors[1]}
                disabled={multicolor_mode_on}
                f_saturate0={multicolor_mode_on}
                onInput={(event) => set_colors([colors[0], event.target.value])}
              />
            </Div>
          </ColorsInputs>

          <Parameter
            type="number"
            min={10}
            max={window.innerWidth}
            label="Characters p/ line"
            original_value={patterns_per_line}
            set_value={(value) =>
              value > 10 &&
              value <= window.innerWidth &&
              set_patterns_per_line(Number(value))
            }
          />

          {patterns.map((pattern, index) => (
            <Parameter
              type="text"
              index={index}
              original_value={pattern}
              key={`${index}-${pattern.character}`}
              label={`Pattern #${index + 1}`}
              remove_pattern={() =>
                set_patterns(patterns.filter((p) => p !== pattern))
              }
              multicolor_mode_on={multicolor_mode_on}
              set_value={(value, key) => {
                const first_half = patterns.slice(0, index)
                const second_half = patterns.slice(index + 1, patterns.length)
                const updated_pattern = { ...pattern, [key]: value }
                const new_patterns = [
                  ...first_half,
                  updated_pattern,
                  ...second_half,
                ]
                if (updated_pattern === pattern) return
                set_patterns(new_patterns)
              }}
            />
          ))}

          <AddButton
            onClick={() => {
              const random_index = random(0, ascii_characters.length - 1)
              const character = ascii_characters.at(random_index)
              const background = get_random_hex_color()
              const color = get_random_hex_color()
              set_patterns([...patterns, { character, background, color }])
            }}
          >
            + Add a new pattern
          </AddButton>
        </Controls>
      )}

      <CopyButton
        onClick={() => {
          const ascii_string = ascii_lines
            .map((line) => `${line.map((c) => c.character[0]).join('')}\n`)
            .join('')

          navigator.clipboard.writeText(ascii_string)
          set_copy_text('ASCII image copied!')
          setTimeout(() => set_copy_text('Copy ASCII image'), 2000)
        }}
      >
        {copy_text}
      </CopyButton>
    </Fragment>
  )
}

const Parameter = ({ original_value, set_value, label, ...props }) => {
  const { remove_pattern, multicolor_mode_on, ...rest } = props
  const is_pattern_value = rest.type === 'text'
  const value = is_pattern_value ? original_value.character : original_value

  const [input_value, set_input_value] = useState(value)
  const has_typed = value.toString() !== input_value.toString()

  return (
    <ParameterWrapper
      mb7={!remove_pattern}
      onKeyDown={({ key }) =>
        key === 'Enter' && set_value(input_value, 'character')
      }
    >
      <Div flex ai_center w165={is_pattern_value}>
        <Input
          defaultValue={value}
          className="outline_button"
          onInput={({ target }) => set_input_value(target.value)}
          {...rest}
        />
        <Button
          ml5
          mr10
          o50={!has_typed}
          c_pointer={has_typed}
          onClick={() => has_typed && set_value(input_value, 'character')}
        >
          OK
        </Button>
        {label}
      </Div>

      {is_pattern_value && (
        <ColorsInputs
          relative
          o25={!multicolor_mode_on}
          f_saturate0={!multicolor_mode_on}
        >
          <Letter
            grey2={original_value.color === 'transparent'}
            white={original_value.color !== 'transparent'}
          >
            A
          </Letter>
          <ColorInput
            mr3
            type="color"
            disabled={!multicolor_mode_on}
            onInput={(event) => set_value(event.target.value, 'color')}
            value={
              original_value.color === 'transparent'
                ? '#ffffff'
                : original_value.color
            }
          />
          <Circle
            c_pointer={multicolor_mode_on}
            onClick={() =>
              multicolor_mode_on && set_value('transparent', 'color')
            }
          />

          <ColorInput
            mr3
            type="color"
            disabled={!multicolor_mode_on}
            onInput={(event) => set_value(event.target.value, 'background')}
            value={
              original_value.background === 'transparent'
                ? '#ffffff'
                : original_value.background
            }
          />
          <Circle
            c_pointer={multicolor_mode_on}
            onClick={() =>
              multicolor_mode_on && set_value('transparent', 'background')
            }
          />
        </ColorsInputs>
      )}

      {remove_pattern && (
        <RemoveButton onClick={remove_pattern}>-</RemoveButton>
      )}
    </ParameterWrapper>
  )
}

const random = (min, max) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const get_random_hex_color = () => {
  const random_color = Math.floor(Math.random() * 16777215).toString(16)
  return `#${random_color.padEnd(6, 0)}`
}

const base_colors = [get_random_hex_color(), get_random_hex_color()]
const ascii_characters = `~!@#$%^&*()_-+={}[]|\\'":;?/,.><o0`
const base_characters = ['+', '{', '//', '0', '#', '@', 'A', 'mmm', '88']
const base_patterns = base_characters.map((character) => ({
  character,
  color: get_random_hex_color(),
  background: get_random_hex_color(),
}))

const Wrapper =
  Component.w100vw.h100vh.relative.flex.ai_center.jc_center.article()
const Canvas = Component.canvas()
const Button =
  Component.ls1.hover_shadow.b_rad10.h20.bg_white.ba.fs10.ph10.mono.button()
const RemoveButton =
  Component.c_pointer.flex_shrink0.ba.h15.w15.flex.ai_center.jc_center.b_rad50p.div()
const AddButton =
  Component.mt20.pv5.fs13.c_pointer.w100p.b_rad25.sans.bg_white.ba.button()
const CopyButton =
  Component.ba.ph20.absolute.b30.l30.pv5.fs15.ph20.pv10.c_pointer.b_rad25.sans.bg_white.button()
const Controls =
  Component.max_h85p.ba.b_rad5.fs12.flex.flex_column.ai_flex_start.absolute.t30.l30.bg_white.pa20.w320.of_scroll.mr30.flex_shrink0.div()
const ParameterWrapper = Component.w100p.mt10.flex.ai_center.jc_between.div()
const Input =
  Component.outline_button.b_rad10.ba.h20.w45.text_center.fs11.input()
const AsciiImage =
  Component.max_w100p.max_h100p.of_scroll.fs8.mono.ws_nowrap.div()
const Line = Component.flex.div()
const Character =
  Component.flex.ai_center.jc_center.w10.h10.flex_shrink0.text_center.span()
const LoadedImage = Component.fit_cover.h140.w100p.img()
const Label =
  Component.blend_difference.white.fs18.w100p.h100p.absolute.flex.ai_center.jc_center.label()
const LabelText = Component.ba.b_rad20.b_white.ph25.pv5.span()
const UploadInput = Component.o0.w100p.h100p.absolute.c_pointer.input()
const Toggle =
  Component.ba.c_pointer.lh15.t30.absolute.bg_white.b_rad25.fs15.flex.ai_center.jc_center.div()
const ColorsInputs = Component.flex.ai_center.div()
const ColorInput = Component.input()
const Circle = Component.bg_line_through.mr10.w15.h15.ba.b_rad50p.b_grey2.div()
const Letter =
  Component.no_events.fs8.absolute.w15.h15.flex.ai_center.jc_center.div()
const Svg = Component.svg()

export default Home
