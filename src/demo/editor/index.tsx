import React from 'react'
import './index.css'
import WithConfirmation from '../with-confirmation'

import { NotesType } from '../index'

import { notesAppActions } from '../index'

type EditorProps = {
  isInEditingMode?: boolean
  note?: NotesType
  [k: string]: any
}

export default function Editor(props: EditorProps) {
  const { index, isInEditingMode, dispatch, note, ...rest } = props

  const [text, setText] = React.useState(note ? note.note : '')

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
            value={text}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
              const { value } = e.target

              setText(value)
            }}
            placeholder="Add a thought..."
          />
          <div className="actions">
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
              Cancel
            </button>
            <button
              className="save-btn"
              disabled={text.trim().length === 0}
              onClick={() => {
                // If note exists, send an edit action
                if (note) {
                  dispatch({
                    type: notesAppActions.updateNote,
                    payload: {
                      id: note.id,
                      note: text.trim(),
                    },
                  })
                } else {
                  dispatch({
                    type: notesAppActions.addNewNote,
                    payload: { note: text.trim() },
                  })
                }
              }}
            >
              Save
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="">{note && note.note}</p>
          <div className="actions actions--left">
            <button
              className="edit-btn"
              onClick={() => {
                dispatch({
                  type: notesAppActions.toggleEditor,
                  payload: {
                    editorId: index,
                  },
                })
              }}
            >
              Edit
            </button>
            <WithConfirmation>
              {({ isConfirming, toggleConfirm }) => (
                <div className="delete-btn-container">
                  <button
                    className={`edit-btn${isConfirming ? ' btn-red' : ''}`}
                    onClick={() => {
                      if (!isConfirming) {
                        toggleConfirm(true)
                        return
                      }

                      if (note) {
                        dispatch({
                          type: notesAppActions.deleteNote,
                          payload: { id: note.id },
                        })
                      }
                    }}
                  >
                    {isConfirming ? 'Confirm?' : 'Delete'}
                  </button>
                  {isConfirming && (
                    <button
                      className="exit-icon-btn"
                      onClick={() => toggleConfirm(false)}
                    >
                      Exit
                    </button>
                  )}
                </div>
              )}
            </WithConfirmation>
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
  const { onChange, ...rest } = props

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
