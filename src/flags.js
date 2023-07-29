import { atomizify, flagify } from 'atomizify'

// generate the atomic CSS classes
atomizify({
  custom_classes: {
    mono: 'font-family: "mono"',
    mb7: 'margin-bottom: 7px',
  },
})

// generate classes flags to use on react components
export const { Component, Div, Span } = flagify()
