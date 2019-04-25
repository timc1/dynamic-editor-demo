import React from 'react'
import './index.css'
import { randomId } from '../utils'

import AddButton from './add-button/index'
import Editor from './editor/index'

import useFocus from './use-focus'

/**
 * A demo showing how we can combine useReducer and
 * compound components to create a simple notes app.
 *
 * Further, we can combine useReducer with React Context
 * in order to access state anywhere in our component tree.
 */

export const notesAppActions = {
  toggleAddNewEditor: 'TOGGLE_ADD_NEW_EDITOR',
  toggleEditor: 'TOGGLE_EDITOR',
}

export type NotesType = {
  id?: string
  note: string
}

type AppState = {
  notes: NotesType[]
  isAddNewEditorShowing: boolean
  currentEditingIndex: number
  togglerToSetFocusOn: HTMLElement | null
}

type AppActions = {
  type: string
  payload: {
    [k: string]: any
  }
}

// Returns a formatted Note object with a unique id.
function Note({ id, note }: NotesType) {
  return {
    id: id || randomId(),
    note,
  }
}

const initialState: AppState = {
  notes: [],
  isAddNewEditorShowing: false,
  currentEditingIndex: -1,
  togglerToSetFocusOn: null,
}

const reducer = (state: AppState, action: AppActions) => {
  switch (action.type) {
    case notesAppActions.toggleAddNewEditor:
      return {
        ...state,
        isAddNewEditorShowing: true,
        currentEditingIndex: action.payload.editorId,
      }
    case notesAppActions.toggleEditor:
      return {
        ...state,
        isAddNewEditorShowing: false,
        currentEditingIndex: action.payload.editorId,
      }
    default:
      throw new Error(`No case for type ${action.type} found.`)
  }
}

export default function NotesApp() {
  const [state, dispatch] = React.useReducer(reducer, initialState)

  // Allows us to control the flow of focus.
  const { cacheFocusElement, toggleFocus } = useFocus()

  console.log('state', state)

  const initialRender = React.useRef(false)
  React.useEffect(() => {
    // useUpdatedEffect - skips the initial rendered call.
    if (!initialRender.current) {
      initialRender.current = true
      return
    }

    if (!state.isAddNewEditorShowing) {
      // Set focus back to the cached element.
      toggleFocus()
    }
  }, [state.isAddNewEditorShowing])

  // Recursively map through each child; if the child has a displayName
  // of 'Editor', we'll add appropriate props to the component.
  const mapPropsToChildren = (children: React.ReactNode) => {
    let indexOfComponent = 0
    const recursiveMap = (child: React.ReactNode): any => {
      return React.Children.map(child, child => {
        if (!React.isValidElement(child)) {
          return child
        }
        // @ts-ignore
        if (child.type.displayName === 'Editor') {
          child = React.cloneElement(child, {
            // @ts-ignore
            isInEditingMode: indexOfComponent === state.currentEditingIndex,
            dispatch,
          })

          indexOfComponent++
          return child
        }

        // @ts-ignore
        if (child.props.children) {
          child = React.cloneElement(child, {
            // @ts-ignore
            children: recursiveMap(child.props.children),
          })
        }

        return child
      })
    }

    return recursiveMap(children)
  }

  return mapPropsToChildren(
    <>
      <div className="container">
        <h1 className="title">Thoughts n' stuff</h1>
        <p className="subtitle">Click the + to add a note.</p>
        <p className="subtitle">
          This is a demo to show the pairing of useReducer for state management
          and compound components to pass props to children using
          React.Children.map()
        </p>
        <hr />
        {state.isAddNewEditorShowing && <Editor />}
        <AddButton
          disabled={state.isAddNewEditorShowing}
          onClick={(e: React.ChangeEvent<HTMLButtonElement>) => {
            dispatch({
              type: notesAppActions.toggleAddNewEditor,
              payload: {
                editorId: state.notes.length,
              },
            })

            cacheFocusElement(e.target)
          }}
        />
      </div>
    </>
  )
}
