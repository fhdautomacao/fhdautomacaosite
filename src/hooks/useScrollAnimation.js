import { useEffect, useRef, useState } from 'react'

export const useScrollAnimation = (threshold = 0.1, rootMargin = '0px') => {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          // Uma vez visível, para de observar para evitar re-animações
          observer.unobserve(entry.target)
        }
      },
      {
        threshold,
        rootMargin,
      }
    )

    const currentRef = ref.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [threshold, rootMargin])

  return [ref, isVisible]
}

export const useCountAnimation = (endValue, duration = 2000, startDelay = 0) => {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
          
          setTimeout(() => {
            const startTime = Date.now()
            const animate = () => {
              const elapsed = Date.now() - startTime
              const progress = Math.min(elapsed / duration, 1)
              
              // Easing function para animação mais suave
              const easeOutQuart = 1 - Math.pow(1 - progress, 4)
              const currentCount = Math.floor(easeOutQuart * endValue)
              
              setCount(currentCount)
              
              if (progress < 1) {
                requestAnimationFrame(animate)
              } else {
                setCount(endValue)
              }
            }
            animate()
          }, startDelay)
        }
      },
      { threshold: 0.3 }
    )

    const currentRef = ref.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [endValue, duration, startDelay, isVisible])

  return [ref, count]
}

