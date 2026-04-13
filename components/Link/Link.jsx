import { forwardRef } from 'react'

export const Link = forwardRef(function Link(props, ref) {
  return (
    <a ref={ref} {...props}>
      {props.children}
    </a>
  )
})