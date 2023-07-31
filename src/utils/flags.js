import { atomizify, flagify } from 'atomizify'

// generate the atomic CSS classes
atomizify({
  custom_classes: {
    no_events: 'pointer-events: none',
    fit_cover: 'object-fit: cover',
    mono: 'font-family: "mono"',
    mr3: 'margin-right: 3px',
    mb7: 'margin-bottom: 7px',
    bg_line_through:
      'background: linear-gradient(-45deg, white 47%, var(--grey2) 47%, var(--grey2) 53%, white 53%)',
  },
})

// generate classes flags to use on react components
export const { Component, Div, Span } = flagify()
