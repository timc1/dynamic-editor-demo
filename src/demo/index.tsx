import React from 'react'
import './index.css'
import { randomId } from '../utils'

import AddButton from './add-button/index'
import Editor from './editor/index'

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
  addNewNote: 'ADD_NEW_NOTE',
  updateNote: 'UPDATE_NOTE',
  deleteNote: 'DELETE_NOTE',
}

export type NotesType = {
  id?: string
  note: string
}

type AppState = {
  notes: NotesType[]
  isAddNewEditorShowing: boolean
  currentEditingIndex: number
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
    case notesAppActions.addNewNote:
      return {
        ...state,
        notes: [
          ...state.notes,
          Note({
            note: action.payload.note,
          }),
        ],
        currentEditingIndex: -1,
        isAddNewEditorShowing: false,
      }
    case notesAppActions.updateNote: {
      const notes = state.notes.map(note => {
        if (note.id === action.payload.id) {
          note = Note({
            id: action.payload.id,
            note: action.payload.note,
          })
        }
        return note
      })

      return {
        ...state,
        notes,
        currentEditingIndex: -1,
        isAddNewEditorShowing: false,
      }
    }
    case notesAppActions.deleteNote: {
      const notes = state.notes.filter(note => note.id !== action.payload.id)

      return {
        ...state,
        notes,
        currentEditingIndex: -1,
        isAddNewEditorShowing: false,
      }
    }

    default:
      throw new Error(`No case for type ${action.type} found.`)
  }
}

export default function NotesApp() {
  const [state, dispatch] = React.useReducer(reducer, initialState)

  React.useEffect(() => {
    console.log('state', state)
  })

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
            index: indexOfComponent,
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
        <ul className="editor-container">
          {state.notes.map(note => (
            <li key={note.id}>
              <Editor note={note} />
            </li>
          ))}
        </ul>
        {state.isAddNewEditorShowing && <Editor />}
        <AddButton
          disabled={state.isAddNewEditorShowing}
          onClick={() => {
            dispatch({
              type: notesAppActions.toggleAddNewEditor,
              payload: {
                editorId: state.notes.length,
              },
            })
          }}
        />
      </div>
    </>
  )
}
