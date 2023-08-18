import { Fragment, useState } from 'react'
import { Component, Div } from '../utils/flags'
import { random, get_random_hex_color } from '../utils/toolbox'
import { ascii_characters } from '../utils/toolbox'

export const Parameters = (params_states) => {
  const { image, set_image } = params_states
  const { multicolor_mode_on, set_multicolor_mode_on } = params_states
  const { colors, set_colors, patterns, set_patterns } = params_states
  const { patterns_per_line, set_patterns_per_line } = params_states

  return (
    <Wrapper>
      <ImportImage image={image} set_image={set_image} />

      <MulticolorMode
        multicolor_mode_on={multicolor_mode_on}
        set_multicolor_mode_on={set_multicolor_mode_on}
      />

      <GlobalColors
        colors={colors}
        set_colors={set_colors}
        multicolor_mode_on={multicolor_mode_on}
      />

      <CharactersPerLine
        patterns_per_line={patterns_per_line}
        set_patterns_per_line={set_patterns_per_line}
      />

      <Patterns
        patterns={patterns}
        set_patterns={set_patterns}
        multicolor_mode_on={multicolor_mode_on}
      />
    </Wrapper>
  )
}

const ImportImage = ({ image, set_image }) => (
  <ImageInput>
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
  </ImageInput>
)

const MulticolorMode = ({ multicolor_mode_on, set_multicolor_mode_on }) => (
  <Div mt10 flex ai_center>
    Multicolor mode
    <ModeOption
      o30={multicolor_mode_on}
      b_white={multicolor_mode_on}
      hover_o50={multicolor_mode_on}
      onClick={() => set_multicolor_mode_on(false)}
    >
      OFF
    </ModeOption>
    <ModeOption
      o30={!multicolor_mode_on}
      b_white={!multicolor_mode_on}
      hover_o50={!multicolor_mode_on}
      onClick={() => set_multicolor_mode_on(true)}
    >
      ON
    </ModeOption>
  </Div>
)

const GlobalColors = ({ colors, set_colors, multicolor_mode_on }) => (
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
      c_pointer={!multicolor_mode_on}
      onClick={() => !multicolor_mode_on && set_colors([colors[1], colors[0]])}
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
)

const CharactersPerLine = ({ patterns_per_line, set_patterns_per_line }) => (
  <ValueInput
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
)

const Patterns = ({ patterns, set_patterns, multicolor_mode_on }) => (
  <Fragment>
    {patterns.map((pattern, index) => (
      <ValueInput
        type="text"
        index={index}
        original_value={pattern}
        label={`Pattern #${index + 1}`}
        key={`${index}-${pattern.character}`}
        multicolor_mode_on={multicolor_mode_on}
        remove_pattern={() =>
          set_patterns(patterns.filter((p) => p !== pattern))
        }
        set_value={(value, key) => {
          const first_half = patterns.slice(0, index)
          const second_half = patterns.slice(index + 1, patterns.length)
          const updated_pattern = { ...pattern, [key]: value }
          const new_patterns = [...first_half, updated_pattern, ...second_half]
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
  </Fragment>
)

const ValueInput = ({ original_value, set_value, label, ...props }) => {
  const { remove_pattern, multicolor_mode_on, ...rest } = props
  const is_pattern_value = rest.type === 'text'
  const value = is_pattern_value ? original_value.character : original_value

  const [input_value, set_input_value] = useState(value)
  const has_typed = value.toString() !== input_value.toString()

  return (
    <ValueInputWrapper
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
        <InputButton
          o50={!has_typed}
          c_pointer={has_typed}
          onClick={() => has_typed && set_value(input_value, 'character')}
        >
          OK
        </InputButton>
        {label}
      </Div>

      {is_pattern_value && (
        <PatternColors
          set_value={set_value}
          original_value={original_value}
          multicolor_mode_on={multicolor_mode_on}
        />
      )}

      {is_pattern_value && (
        <RemoveButton onClick={remove_pattern}>-</RemoveButton>
      )}
    </ValueInputWrapper>
  )
}

const PatternColors = ({ original_value, set_value, multicolor_mode_on }) => (
  <ColorsInputs
    relative
    o25={!multicolor_mode_on}
    f_saturate0={!multicolor_mode_on}
  >
    <PatternColor
      type="color"
      value={original_value.color}
      set_value={set_value}
      multicolor_mode_on={multicolor_mode_on}
    />
    <PatternColor
      type="background"
      value={original_value.background}
      set_value={set_value}
      multicolor_mode_on={multicolor_mode_on}
    />
  </ColorsInputs>
)

const PatternColor = ({ type, value, set_value, multicolor_mode_on }) => (
  <Fragment>
    {type === 'color' && (
      <Letter grey2={value === 'transparent'} white={value !== 'transparent'}>
        A
      </Letter>
    )}
    <ColorInput
      mr3
      type="color"
      disabled={!multicolor_mode_on}
      onInput={(event) => set_value(event.target.value, type)}
      value={value === 'transparent' ? '#ffffff' : value}
    />

    <EmptyColor
      c_pointer={multicolor_mode_on}
      onClick={() => multicolor_mode_on && set_value('transparent', type)}
    />
  </Fragment>
)

const Wrapper =
  Component.scale__xs.max_h85p.ba.b_rad5.fs12.flex.flex_column.ai_flex_start.absolute.t30.t15__xs.l30.l15__xs.bg_white.pa20.w320.of_scroll.mr30.flex_shrink0.div()

const ModeOption = Component.bb.ml15.c_pointer.div()
const Svg = Component.svg()

const ImageInput = Component.w100p.mb10.relative.flex.ai_center.jc_center.div()
const LoadedImage = Component.fit_cover.h140.w100p.img()
const Label =
  Component.blend_difference.white.fs18.w100p.h100p.absolute.flex.ai_center.jc_center.label()
const LabelText = Component.ba.b_rad20.b_white.ph25.pv5.span()
const UploadInput = Component.o0.w100p.h100p.absolute.c_pointer.input()

const ValueInputWrapper = Component.w100p.mt10.flex.ai_center.jc_between.div()
const Input =
  Component.outline_button.b_rad10.ba.h20.w45.text_center.fs11.input()
const InputButton =
  Component.ml5.mr10.ls1.hover_shadow.b_rad10.h20.bg_white.ba.fs10.ph10.mono.button()
const RemoveButton =
  Component.c_pointer.flex_shrink0.ba.h15.w15.flex.ai_center.jc_center.b_rad50p.div()
const AddButton =
  Component.mt20.pv5.fs13.c_pointer.w100p.b_rad25.sans.bg_white.ba.button()

const ColorsInputs = Component.flex.ai_center.div()
const ColorInput = Component.input()
const Letter =
  Component.no_events.fs8.absolute.w15.h15.flex.ai_center.jc_center.div()
const EmptyColor =
  Component.bg_line_through.mr10.w15.h15.ba.b_rad50p.b_grey2.div()
