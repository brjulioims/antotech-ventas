import { useEffect, useId } from 'react'
import { tsParticles } from '@tsparticles/engine'
import { loadSlim } from '@tsparticles/slim'

const particlesOptions = {
  fullScreen: {
    enable: false,
  },
  background: {
    color: {
      value: 'transparent',
    },
  },
  fpsLimit: 90,
  particles: {
    color: {
      value: ['#ffffff', '#d15f03', '#93a4d1', '#f8c49b'],
    },
    links: {
      color: '#ffffff',
      distance: 135,
      enable: true,
      opacity: 0.35,
      width: 1,
    },
    move: {
      enable: true,
      speed: 0.9,
      outModes: {
        default: 'out',
      },
    },
    number: {
      density: {
        enable: true,
        area: 800,
      },
      value: 110,
    },
    opacity: {
      value: { min: 0.3, max: 0.7 },
    },
    shape: {
      type: 'circle',
    },
    size: {
      value: { min: 1, max: 3 },
    },
  },
  detectRetina: true,
}

let isInitialized = false

export default function LoginParticles({
  className = 'absolute inset-0 z-2 pointer-events-none',
}) {
  const particleId = useId().replace(/:/g, '')

  useEffect(() => {
    let container
    let cancelled = false

    const init = async () => {
      try {
        if (!isInitialized) {
          await loadSlim(tsParticles)
          isInitialized = true
        }

        if (cancelled) return

        container = await tsParticles.load({
          id: particleId,
          element: document.getElementById(particleId),
          options: particlesOptions,
        })
      } catch (error) {
        console.error('tsParticles load error:', error)
      }
    }

    init()

    return () => {
      cancelled = true
      container?.destroy()
    }
  }, [particleId])

  return (
    <div className={className}>
      <div id={particleId} className="h-full w-full" />
    </div>
  )
}