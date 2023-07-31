import { Component } from '../utils/flags'

export const AsciiImage = ({ ascii_lines, colors, multicolor_mode_on }) => (
  <Wrapper>
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
  </Wrapper>
)

const Wrapper = Component.max_w100p.max_h100p.of_scroll.fs8.mono.ws_nowrap.div()
const Line = Component.flex.div()
const Character =
  Component.flex.ai_center.jc_center.w10.h10.flex_shrink0.text_center.span()
