import { motion, useMotionValue, useTransform } from 'motion/react'
import { useEffect, useState } from 'react'
import './Stack.css'

function CardRotate({ children, onSendToBack, sensitivity, disableDrag = false }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useTransform(y, [-100, 100], [60, -60])
  const rotateY = useTransform(x, [-100, 100], [-60, 60])

  function handleDragEnd(_, info) {
    if (Math.abs(info.offset.x) > sensitivity || Math.abs(info.offset.y) > sensitivity) {
      onSendToBack()
    } else {
      x.set(0)
      y.set(0)
    }
  }

  if (disableDrag) {
    return (
      <motion.div className="card-rotate-disabled" style={{ x: 0, y: 0 }}>
        {children}
      </motion.div>
    )
  }

  return (
    <motion.div
      className="card-rotate"
      style={{ x, y, rotateX, rotateY }}
      drag
      dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
      dragElastic={0.6}
      whileTap={{ cursor: 'grabbing' }}
      onDragEnd={handleDragEnd}
    >
      {children}
    </motion.div>
  )
}

export default function Stack({
  randomRotation = false,
  sensitivity = 200,
  cards = [],
  animationConfig = { stiffness: 260, damping: 20 },
  sendToBackOnClick = false,
  autoplay = false,
  autoplayDelay = 3000,
  pauseOnHover = false,
  mobileClickOnly = false,
  mobileBreakpoint = 768,
}) {
  const [isMobile, setIsMobile] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < mobileBreakpoint)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [mobileBreakpoint])

  const shouldDisableDrag = mobileClickOnly && isMobile
  const shouldEnableClick = sendToBackOnClick || shouldDisableDrag

  const [stack, setStack] = useState(() => {
    if (cards.length) {
      return cards.map((content, index) => ({ id: index + 1, content }))
    }
    return []
  })

  useEffect(() => {
    if (cards.length) {
      setStack(cards.map((content, index) => ({ id: index + 1, content })))
    }
  }, [cards])

  const sendToBack = (id) => {
    setStack((prev) => {
      const newStack = [...prev]
      const index = newStack.findIndex((card) => card.id === id)
      if (index < 0) return prev
      const [card] = newStack.splice(index, 1)
      newStack.unshift(card)
      return newStack
    })
  }

  useEffect(() => {
    if (!autoplay || stack.length < 2 || isPaused) return undefined

    const interval = setInterval(() => {
      setStack((prev) => {
        if (prev.length < 2) return prev
        const top = prev[prev.length - 1]
        const next = [...prev]
        const index = next.findIndex((c) => c.id === top.id)
        if (index < 0) return prev
        const [card] = next.splice(index, 1)
        next.unshift(card)
        return next
      })
    }, autoplayDelay)

    return () => clearInterval(interval)
  }, [autoplay, autoplayDelay, stack.length, isPaused])

  if (stack.length === 0) return null

  return (
    <div
      className="stack-container"
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      {stack.map((card, index) => {
        const isFront = index === stack.length - 1
        const depthBehindFront = stack.length - index - 1
        let rotateZ = 0
        if (!isFront) {
          const sign = depthBehindFront % 2 === 1 ? 1 : -1
          const baseDeg = 6.5 + (depthBehindFront - 1) * 2.8
          const jitterDeg = randomRotation ? ((card.id * 7) % 5) - 2 : 0
          rotateZ = sign * baseDeg + jitterDeg * 0.25
        }
        return (
          <CardRotate
            key={card.id}
            onSendToBack={() => sendToBack(card.id)}
            sensitivity={sensitivity}
            disableDrag={shouldDisableDrag}
          >
            <motion.div
              className="card"
              onClick={() => shouldEnableClick && sendToBack(card.id)}
              animate={{
                rotateZ,
                x: 0,
                scale: 1 + (index - (stack.length - 1)) * 0.06,
                transformOrigin: 'center center',
              }}
              initial={false}
              transition={{
                type: 'spring',
                stiffness: animationConfig.stiffness,
                damping: animationConfig.damping,
              }}
            >
              {card.content}
            </motion.div>
          </CardRotate>
        )
      })}
    </div>
  )
}
