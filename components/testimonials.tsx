'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Testimonial {
  id: number
  quote: string
  author: string
  role: string
  avatar: string
  initials: string
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    quote: 'Bit trading has transformed my trading experience. The platform is fast, reliable, and the fees are unbeatable. Highly recommended!',
    author: 'Sarah Chen',
    role: 'Professional Trader',
    avatar: 'SC',
    initials: 'SC'
  },
  {
    id: 2,
    quote: 'The security features give me peace of mind, and the user interface is intuitive. Bit trading platform I\'ve used.',
    author: 'Michael Rodriguez',
    role: 'Crypto Investor',
    avatar: 'MR',
    initials: 'MR'
  },
  {
    id: 3,
    quote: 'Real-time data and lightning-fast execution. This is exactly what I needed for my trading strategy. Excellent service!',
    author: 'Emma Thompson',
    role: 'Day Trader',
    avatar: 'ET',
    initials: 'ET'
  }
]

export function TestimonialsSection() {
  const [current, setCurrent] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)

  useEffect(() => {
    if (!isAutoPlay) return

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [isAutoPlay])

  const goToPrevious = () => {
    setIsAutoPlay(false)
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const goToNext = () => {
    setIsAutoPlay(false)
    setCurrent((prev) => (prev + 1) % testimonials.length)
  }

  const goToSlide = (index: number) => {
    setIsAutoPlay(false)
    setCurrent(index)
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="text-blue-400">What </span>
            <span className="text-slate-100">Traders </span>
            <span className="text-orange-400">Say</span>
          </h2>
          <p className="text-slate-400">
            Join thousands of satisfied traders worldwide
          </p>
        </div>

        {/* Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <div className="relative h-80 flex items-center">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`absolute inset-0 transition-all duration-500 ${
                  index === current
                    ? 'opacity-100 scale-100'
                    : 'opacity-0 scale-95 pointer-events-none'
                }`}
              >
                <div className="border border-slate-700 rounded-lg p-8 bg-slate-900/50 h-full flex flex-col justify-center">
                  {/* Rating */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-orange-400 text-orange-400"
                      />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-slate-300 italic mb-6 text-lg">
                    "{testimonial.quote}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-pink-400 flex items-center justify-center text-white font-bold">
                      {testimonial.initials[0]}
                    </div>
                    <div>
                      <div className="font-semibold text-white">
                        {testimonial.author}
                      </div>
                      <div className="text-sm text-slate-400">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={goToPrevious}
            className="absolute -left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 text-white flex items-center justify-center hover:shadow-lg transition hidden sm:flex"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={goToNext}
            className="absolute -right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 text-white flex items-center justify-center hover:shadow-lg transition hidden sm:flex"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all ${
                  index === current
                    ? 'bg-blue-500 w-8 h-2'
                    : 'bg-slate-600 w-2 h-2 hover:bg-slate-500'
                }`}
                style={{ borderRadius: '9999px' }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
