'use client'

import { useEffect, useRef } from 'react'

class Particle {
  x: number
  y: number
  baseVx: number
  baseVy: number
  vx: number
  vy: number
  radius: number

  constructor(width: number, height: number) {
    this.x = Math.random() * width
    this.y = Math.random() * height
    this.baseVx = (Math.random() - 0.5) * 1.2
    this.baseVy = (Math.random() - 0.5) * 1.2
    this.vx = this.baseVx
    this.vy = this.baseVy
    this.radius = Math.random() * 2 + 1
  }

  update(width: number, height: number) {
    this.x += this.vx
    this.y += this.vy
    
    // Dampen back to base velocities slowly
    this.vx += (this.baseVx - this.vx) * 0.05
    this.vy += (this.baseVy - this.vy) * 0.05

    if (this.x < 0) {
      this.x = 0
      this.baseVx = Math.abs(this.baseVx)
    } else if (this.x > width) {
      this.x = width
      this.baseVx = -Math.abs(this.baseVx)
    }

    if (this.y < 0) {
      this.y = 0
      this.baseVy = Math.abs(this.baseVy)
    } else if (this.y > height) {
      this.y = height
      this.baseVy = -Math.abs(this.baseVy)
    }
  }
}

export default function NodeGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = canvas.width = window.innerWidth
    let height = canvas.height = window.innerHeight

    const handleResize = () => {
      if (!canvas) return
      const newWidth = window.innerWidth
      const newHeight = window.innerHeight
      
      const scaleX = newWidth / width
      const scaleY = newHeight / height
      
      nodes.forEach(node => {
        node.x *= scaleX
        node.y *= scaleY
      })
      
      width = canvas.width = newWidth
      height = canvas.height = newHeight
    }
    window.addEventListener('resize', handleResize)

    const nodes: Particle[] = []
    const nodeCount = 200
    const connectionDistance = 130

    for (let i = 0; i < nodeCount; i++) {
      nodes.push(new Particle(width, height))
    }

    const mouse = { x: null as number | null, y: null as number | null, radius: 150 }

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }
    const handleMouseLeave = () => {
      mouse.x = null
      mouse.y = null
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)

    let animationFrameId: number

    const animate = () => {
      ctx.clearRect(0, 0, width, height)
      
      const isDark = document.documentElement.classList.contains('dark')
      
      for (let i = 0; i < nodes.length; i++) {
        const n1 = nodes[i]
        
        // Cursor interaction - Repulsion Force
        if (mouse.x !== null && mouse.y !== null) {
          const dx = n1.x - mouse.x
          const dy = n1.y - mouse.y
          const dist = Math.hypot(dx, dy)
          
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius
            const forceX = (dx / dist) * force * 1.5
            const forceY = (dy / dist) * force * 1.5
            
            n1.vx += forceX
            n1.vy += forceY
          }
        }
        
        n1.update(width, height)
        
        ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.45)' : 'rgba(15, 23, 42, 0.35)'
        ctx.beginPath()
        ctx.arc(n1.x, n1.y, n1.radius, 0, Math.PI * 2)
        ctx.fill()

        let closest1: Particle | null = null;
        let closest2: Particle | null = null;
        let closest3: Particle | null = null;
        let minDist1 = Infinity;
        let minDist2 = Infinity;
        let minDist3 = Infinity;

        for (let j = 0; j < nodes.length; j++) {
          if (i === j) continue;
          const n2 = nodes[j];
          const dist = Math.hypot(n1.x - n2.x, n1.y - n2.y);
          
          if (dist < minDist1) {
            minDist3 = minDist2;
            closest3 = closest2;
            minDist2 = minDist1;
            closest2 = closest1;
            minDist1 = dist;
            closest1 = n2;
          } else if (dist < minDist2) {
            minDist3 = minDist2;
            closest3 = closest2;
            minDist2 = dist;
            closest2 = n2;
          } else if (dist < minDist3) {
            minDist3 = dist;
            closest3 = n2;
          }
        }

        const maxDist = connectionDistance * 1.5;
        const drawEdge = (target: Particle | null, d: number) => {
          if (target && d < maxDist) {
            const distRatio = Math.min(d / maxDist, 1);
            ctx.lineWidth = (1 - distRatio) * 1.0;
            const opacity = (1 - distRatio) * (isDark ? 0.35 : 0.28);
            ctx.strokeStyle = isDark ? `rgba(255, 255, 255, ${opacity})` : `rgba(15, 23, 42, ${opacity})`;
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(target.x, target.y);
            ctx.stroke();
          }
        };

        drawEdge(closest1, minDist1);
        drawEdge(closest2, minDist2);
        drawEdge(closest3, minDist3);
      }
      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none -z-20"
    />
  )
}
