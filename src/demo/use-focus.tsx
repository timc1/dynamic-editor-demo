import React from 'react'

// @ts-ignore
export const FocusContext = React.createContext()

export function FocusProvider({ children }: { children: React.ReactNode }) {
  const focusElement = React.useRef<any>(null)

  const cacheFocusElement = (element: any) => (focusElement.current = element)

  const toggleFocus = () => {
    if (focusElement.current) {
      focusElement.current.focus()
    }
  }

  return (
    <FocusContext.Provider
      value={{
        cacheFocusElement,
        toggleFocus,
      }}
    >
      {children}
    </FocusContext.Provider>
  )
}

export default function useFocus() {
  const { cacheFocusElement, toggleFocus } = React.useContext(FocusContext)
  return { cacheFocusElement, toggleFocus }
}
