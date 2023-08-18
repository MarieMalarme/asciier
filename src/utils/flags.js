import { atomizify, flagify } from 'atomizify'

// generate the atomic CSS classes
atomizify({
  custom_classes: {
    no_events: 'pointer-events: none',
    fit_cover: 'object-fit: cover',
    mono: 'font-family: "mono"',
    mr3: 'margin-right: 3px',
    mb7: 'margin-bottom: 7px',
    l355: 'left: 355px',
    l310: 'left: 310px',
    l15: 'left: 15px',
    t15: 'top: 15px',
    b15: 'bottom: 15px',
    scale: 'transform: scale(0.9); transform-origin: top left',
    bg_line_through:
      'background: linear-gradient(-45deg, white 47%, var(--grey2) 47%, var(--grey2) 53%, white 53%)',
  },

  media_queries: {
    __xs: {
      query: 'max-width: 700px',
      description: 'extra small screens',
    },
  },
})

// generate classes flags to use on react components
export const { Component, Div, Span } = flagify()
