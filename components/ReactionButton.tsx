'use client'

import { useState, useCallback } from 'react'

type Props = {
  type: 'like' | 'dislike'
  count: number
  active: boolean
  onClick: () => void
}

const ICONS = {
  like: {
    inactive: (
      <svg
        width='16'
        height='16'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <path d='M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z' />
        <path d='M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3' />
      </svg>
    ),
    active: (
      <svg
        width='16'
        height='16'
        viewBox='0 0 24 24'
        fill='currentColor'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <path d='M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z' />
        <path d='M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3' />
      </svg>
    )
  },
  dislike: {
    inactive: (
      <svg
        width='16'
        height='16'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <path d='M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z' />
        <path d='M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17' />
      </svg>
    ),
    active: (
      <svg
        width='16'
        height='16'
        viewBox='0 0 24 24'
        fill='currentColor'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <path d='M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z' />
        <path d='M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17' />
      </svg>
    )
  }
}

export default function ReactionButton ({
  type,
  count,
  active,
  onClick
}: Props) {
  const [popClass, setPopClass] = useState('')
  const [countClass, setCountClass] = useState('')
  const [prevCount, setPrevCount] = useState(count)

  const handleClick = useCallback(() => {
    const popAnim =
      type === 'like' ? 'react-btn--like-pop' : 'react-btn--dislike-pop'
    setPopClass(popAnim)
    setCountClass(
      count < prevCount + 1 ? 'react-btn__count--down' : 'react-btn__count--up'
    )
    setPrevCount(count)
    setTimeout(() => setPopClass(''), 400)
    setTimeout(() => setCountClass(''), 200)
    onClick()
  }, [type, count, prevCount, onClick])

  return (
    <button
      onClick={handleClick}
      className={[
        'react-btn',
        type === 'dislike' ? 'react-btn--dislike' : '',
        active ? 'react-btn--active' : '',
        popClass
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label={type === 'like' ? 'Like' : 'Dislike'}
    >
      <span className='react-btn__icon'>
        {active ? ICONS[type].active : ICONS[type].inactive}
      </span>
      <span className={`react-btn__count ${countClass}`}>{count}</span>
    </button>
  )
}
