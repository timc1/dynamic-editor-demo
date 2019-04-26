import React from 'react'

export default function WithConfirmation({
  children,
}: {
  children: ({
    isConfirming,
    toggleConfirm,
  }: {
    isConfirming: boolean
    toggleConfirm: React.Dispatch<React.SetStateAction<boolean>>
  }) => React.ReactNode
}) {
  const [isConfirming, toggleConfirm] = React.useState(false)

  return (
    <>
      {children({
        isConfirming,
        toggleConfirm,
      })}
    </>
  )
}
