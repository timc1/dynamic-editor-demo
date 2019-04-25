import React from 'react'
import './index.css'

import { notesAppActions } from '../index'

type EditorProps = {
  isInEditingMode?: boolean
  note?: string
  [k: string]: any
}

export default function Editor(props: EditorProps) {
  const [note, setNote] = React.useState(props.note || '')

  const { isInEditingMode, dispatch, ...rest } = props

  const textarea = React.useRef<HTMLTextAreaElement>(null)
  React.useEffect(() => {
    if (isInEditingMode) {
      if (textarea && textarea.current) {
        textarea.current.focus()
      }
    }
  }, [isInEditingMode])

  return (
    <div {...rest} className="editor">
      {isInEditingMode ? (
        <>
          <Textarea
            ref={textarea}
            value={note}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
              const { value } = e.target

              setNote(value)
            }}
            placeholder="Add a thought..."
          />
          <button
            className="cancel-btn"
            onClick={() => {
              dispatch({
                type: notesAppActions.toggleEditor,
                payload: {
                  editorId: -1,
                },
              })
            }}
          >
            cancel
          </button>
        </>
      ) : (
        <>
          <div {...props} className="editor">
            not editing
          </div>
        </>
      )}
    </div>
  )
}

Editor.displayName = 'Editor'

/**
 * A Textarea that dynamically adjusts input
 * height based on the height of the content.
 */
const Textarea = React.forwardRef((props: any, ref: any) => {
  const handleResize = React.useMemo(
    () => () => {
      if (ref.current) {
        ref.current.style.height = 'auto'
        ref.current.style.height =
          ref.current.offsetHeight <= ref.current.scrollHeight
            ? ref.current.scrollHeight + 'px'
            : '80px'
      }
    },
    [ref]
  )

  React.useLayoutEffect(() => {
    handleResize()
  }, [handleResize])

  const { onChange, ...rest } = props
  return (
    <textarea
      ref={ref}
      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange(e)
        handleResize()
      }}
      {...rest}
    />
  )
})
