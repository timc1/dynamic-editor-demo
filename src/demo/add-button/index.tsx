import React from 'react'
import './index.css'

type ButtonProps = {
  [k: string]: any
}

export default function AddButton(props: ButtonProps) {
  return (
    <button className="add-button" {...props}>
      <span />
    </button>
  )
}
