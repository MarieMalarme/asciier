import { Fragment, useState } from 'react'
import { Component } from '../utils/flags'
import { Parameters } from './Parameters'

export const ControlPanel = (props) => {
  const { ascii_lines, ...params_states } = props

  const [is_open, set_is_open] = useState(false)
  const [copy_text, set_copy_text] = useState('Copy ASCII image')

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

      {is_open && <Parameters {...params_states} />}

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

const Toggle =
  Component.ba.c_pointer.lh15.t30.absolute.bg_white.b_rad25.fs15.flex.ai_center.jc_center.div()

const CopyButton =
  Component.ba.ph20.absolute.b30.l30.pv5.fs15.ph20.pv10.c_pointer.b_rad25.sans.bg_white.button()
