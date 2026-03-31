/* ==========================================================================
   Vintage Floral Engagement Invitation — JavaScript
   GSAP-powered envelope + Performance-first animations
   ========================================================================== */

;(function () {
  'use strict'

  // ---------- Configuration ----------
  const EVENT_DATE = new Date('2026-05-07T17:00:00')
  const PETAL_COUNT = 18
  const CONFETTI_COUNT = 40
  const SPARKLE_COUNT = 30

  // ---------- DOM References ----------
  const $ = (sel) => document.querySelector(sel)
  const $$ = (sel) => document.querySelectorAll(sel)

  const envelopeOverlay = $('#envelope-overlay')
  const openInviteBtn = $('#open-invite-btn')
  const invitation = $('#invitation')
  const petalsCanvas = $('#petals-canvas')
  const ctx = petalsCanvas.getContext('2d')
  const musicToggle = $('#music-toggle')
  const playSongBtn = $('#play-song-btn')
  const bgMusic = $('#bg-music')

  // Countdown refs
  const countdownDays = $('#countdown-days')
  const countdownHours = $('#countdown-hours')
  const countdownMins = $('#countdown-mins')
  const countdownSecs = $('#countdown-secs')

  // Envelope refs
  const envelopeScene = $('#envelope-scene')
  const envelopeFlap = $('#envelope-flap')
  const envelopeLetter = $('#envelope-letter')
  const waxSeal = $('#wax-seal')
  const envelopePretitle = $('#envelope-pretitle')
  const envelopeSubtitle = $('#envelope-subtitle')
  const envelopeSparkles = $('#envelope-sparkles')

  // ---------- Create Sparkle Particles ----------
  function createSparkles() {
    for (let i = 0; i < SPARKLE_COUNT; i++) {
      const sparkle = document.createElement('div')
      sparkle.classList.add('sparkle')
      sparkle.style.left = Math.random() * 100 + '%'
      sparkle.style.top = Math.random() * 100 + '%'
      sparkle.style.animationDelay = Math.random() * 4 + 's'
      sparkle.style.animationDuration = Math.random() * 3 + 3 + 's'
      sparkle.style.width = Math.random() * 4 + 2 + 'px'
      sparkle.style.height = sparkle.style.width

      // Vary colors
      const colors = ['#C9A96E', '#C0887A', '#799A7F', '#d4a99e']
      sparkle.style.background =
        colors[Math.floor(Math.random() * colors.length)]

      envelopeSparkles.appendChild(sparkle)
    }
  }

  // ---------- GSAP Entrance Animation ----------
  function playEntranceAnimation() {
    if (typeof gsap === 'undefined') {
      // Fallback if GSAP fails to load
      envelopePretitle.style.opacity = '1'
      envelopeSubtitle.style.opacity = '1'
      openInviteBtn.style.opacity = '1'
      return
    }

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    // Initial state
    gsap.set(envelopeScene, { scale: 0.8, opacity: 0, y: 30 })
    gsap.set(waxSeal, { scale: 0, rotation: -180 })
    gsap.set(envelopePretitle, { opacity: 0, y: -20 })
    gsap.set(envelopeSubtitle, { opacity: 0, y: 20 })
    gsap.set(openInviteBtn, { opacity: 0, y: 20 })

    tl
      // Fade in envelope
      .to(envelopeScene, {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'back.out(1.4)',
      })
      // Pop in wax seal with spin
      .to(
        waxSeal,
        {
          scale: 1,
          rotation: 0,
          duration: 0.8,
          ease: 'back.out(2)',
        },
        '-=0.4',
      )
      // Fade in pretitle
      .to(
        envelopePretitle,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
        },
        '-=0.3',
      )
      // Fade in subtitle
      .to(
        envelopeSubtitle,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
        },
        '-=0.2',
      )
      // Fade in button
      .to(
        openInviteBtn,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
        },
        '-=0.3',
      )
      // Gentle floating on the envelope
      .to(envelopeScene, {
        y: -8,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })

    // Subtle wax seal pulse
    gsap.to(waxSeal, {
      scale: 1.05,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: 2,
    })
  }

  // ---------- GSAP Opening Animation ----------
  function playOpeningAnimation() {
    if (typeof gsap === 'undefined') {
      // Fallback
      envelopeOverlay.classList.add('hidden')
      invitation.classList.remove('hidden')
      initScrollReveal()
      startCountdown()
      initPetals()
      return
    }

    // Kill any looping animations
    gsap.killTweensOf(envelopeScene)
    gsap.killTweensOf(waxSeal)

    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      onComplete: () => {
        envelopeOverlay.classList.add('hidden')
        invitation.classList.remove('hidden')
        initScrollReveal()
        startCountdown()
        initPetals()

        // Animate the invitation sections in
        playInvitationEntrance()
      },
    })

    tl
      // Hide button & text
      .to([openInviteBtn, envelopeSubtitle, envelopePretitle], {
        opacity: 0,
        y: -10,
        duration: 0.3,
        stagger: 0.05,
      })
      // Break the wax seal — crack & explode
      .to(
        waxSeal,
        {
          scale: 1.4,
          opacity: 0,
          rotation: 30,
          duration: 0.5,
          ease: 'power4.out',
          onStart: () => spawnSealParticles(),
        },
        '-=0.1',
      )
      // Open the flap (rotate upward and back)
      .to(
        envelopeFlap,
        {
          rotateX: -180,
          duration: 0.8,
          ease: 'power2.inOut',
        },
        '-=0.2',
      )
      // Slide the letter out and up
      .to(
        envelopeLetter,
        {
          y: -280,
          scale: 1.15,
          duration: 1,
          ease: 'power2.out',
          onStart: () => {
            envelopeLetter.style.visibility = 'visible'
            envelopeLetter.style.zIndex = '7'
          },
        },
        '-=0.4',
      )
      // Fade the letter larger — zoom into it
      .to(
        envelopeLetter,
        {
          scale: 3.5,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.in',
        },
        '-=0.2',
      )
      // Fade envelope scene
      .to(
        envelopeScene,
        {
          opacity: 0,
          scale: 0.8,
          duration: 0.4,
        },
        '-=0.6',
      )
      // Fade out entire overlay
      .to(
        envelopeOverlay,
        {
          opacity: 0,
          duration: 0.5,
        },
        '-=0.3',
      )
  }

  // Wax seal particles when it breaks
  function spawnSealParticles() {
    const sealRect = waxSeal.getBoundingClientRect()
    const colors = ['#d4736a', '#b85a52', '#8b3a33', '#C9A96E', '#C0887A']

    for (let i = 0; i < 12; i++) {
      const particle = document.createElement('div')
      particle.style.cssText = `
        position: fixed;
        width: ${Math.random() * 8 + 3}px;
        height: ${Math.random() * 8 + 3}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
        left: ${sealRect.left + sealRect.width / 2}px;
        top: ${sealRect.top + sealRect.height / 2}px;
        z-index: 10000;
        pointer-events: none;
      `
      document.body.appendChild(particle)

      gsap.to(particle, {
        x: (Math.random() - 0.5) * 200,
        y: (Math.random() - 0.5) * 200,
        rotation: Math.random() * 720,
        opacity: 0,
        duration: Math.random() * 0.8 + 0.5,
        ease: 'power3.out',
        onComplete: () => particle.remove(),
      })
    }
  }

  // Animate invitation sections in after envelope opens
  function playInvitationEntrance() {
    if (typeof gsap === 'undefined') return

    gsap.from('.header', {
      y: -40,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out',
    })
  }

  // ---------- Event Listeners ----------
  openInviteBtn.addEventListener('click', playOpeningAnimation)
  waxSeal.addEventListener('click', playOpeningAnimation)

  // ---------- Init ----------
  createSparkles()
  // Wait for GSAP to load (it's deferred)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(playEntranceAnimation, 100)
    })
  } else {
    setTimeout(playEntranceAnimation, 100)
  }

  // ---------- Scroll Reveal (IntersectionObserver) ----------
  function initScrollReveal() {
    const reveals = $$('.reveal')

    if (!('IntersectionObserver' in window)) {
      reveals.forEach((el) => el.classList.add('visible'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
    )

    reveals.forEach((el) => observer.observe(el))
  }

  // ---------- Countdown Timer ----------
  let prevValues = { days: null, hours: null, mins: null, secs: null }

  function startCountdown() {
    updateCountdown()
  }

  function updateCountdown() {
    const now = new Date()
    const diff = EVENT_DATE - now

    if (diff <= 0) {
      countdownDays.textContent = '00'
      countdownHours.textContent = '00'
      countdownMins.textContent = '00'
      countdownSecs.textContent = '00'
      return
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
    const mins = Math.floor((diff / (1000 * 60)) % 60)
    const secs = Math.floor((diff / 1000) % 60)

    const formatted = {
      days: String(days).padStart(2, '0'),
      hours: String(hours).padStart(2, '0'),
      mins: String(mins).padStart(2, '0'),
      secs: String(secs).padStart(2, '0'),
    }

    if (formatted.days !== prevValues.days)
      flipNumber(countdownDays, formatted.days)
    if (formatted.hours !== prevValues.hours)
      flipNumber(countdownHours, formatted.hours)
    if (formatted.mins !== prevValues.mins)
      flipNumber(countdownMins, formatted.mins)
    if (formatted.secs !== prevValues.secs)
      flipNumber(countdownSecs, formatted.secs)

    prevValues = formatted
    setTimeout(() => requestAnimationFrame(updateCountdown), 1000)
  }

  function flipNumber(el, value) {
    el.textContent = value
    el.classList.remove('flip')
    void el.offsetWidth
    el.classList.add('flip')
  }

  // ---------- Floating Petals (Canvas) ----------
  let petals = []
  let petalsRunning = false

  function initPetals() {
    resizeCanvas()
    window.addEventListener('resize', debounce(resizeCanvas, 200))
    createPetals()
    petalsRunning = true
    requestAnimationFrame(animatePetals)
  }

  function resizeCanvas() {
    petalsCanvas.width = window.innerWidth
    petalsCanvas.height = window.innerHeight
  }

  function createPetals() {
    petals = []
    for (let i = 0; i < PETAL_COUNT; i++) {
      petals.push(createPetal())
    }
  }

  function createPetal() {
    const colors = [
      'rgba(192, 136, 122, 0.45)',
      'rgba(192, 136, 122, 0.25)',
      'rgba(121, 154, 127, 0.35)',
      'rgba(201, 169, 110, 0.25)',
      'rgba(212, 169, 158, 0.35)',
    ]

    return {
      x: Math.random() * petalsCanvas.width,
      y: Math.random() * petalsCanvas.height - petalsCanvas.height,
      size: Math.random() * 10 + 5,
      speedX: Math.random() * 1 - 0.5,
      speedY: Math.random() * 1.5 + 0.5,
      rotation: Math.random() * 360,
      rotationSpeed: Math.random() * 2 - 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.02 + 0.01,
    }
  }

  function animatePetals() {
    if (!petalsRunning) return

    ctx.clearRect(0, 0, petalsCanvas.width, petalsCanvas.height)

    petals.forEach((petal) => {
      petal.x += petal.speedX + Math.sin(petal.wobble) * 0.5
      petal.y += petal.speedY
      petal.rotation += petal.rotationSpeed
      petal.wobble += petal.wobbleSpeed

      if (petal.y > petalsCanvas.height + 20) {
        petal.y = -20
        petal.x = Math.random() * petalsCanvas.width
      }
      if (petal.x > petalsCanvas.width + 20) petal.x = -20
      if (petal.x < -20) petal.x = petalsCanvas.width + 20

      ctx.save()
      ctx.translate(petal.x, petal.y)
      ctx.rotate((petal.rotation * Math.PI) / 180)
      ctx.fillStyle = petal.color
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.bezierCurveTo(
        petal.size / 2,
        -petal.size / 2,
        petal.size,
        petal.size / 4,
        0,
        petal.size,
      )
      ctx.bezierCurveTo(
        -petal.size,
        petal.size / 4,
        -petal.size / 2,
        -petal.size / 2,
        0,
        0,
      )
      ctx.fill()
      ctx.restore()
    })

    requestAnimationFrame(animatePetals)
  }

  // ---------- Music Toggle ----------
  let musicPlaying = false

  function toggleMusic() {
    if (musicPlaying) {
      bgMusic.pause()
      musicToggle.classList.remove('playing')
      playSongBtn.classList.remove('playing')
    } else {
      bgMusic.play().catch(() => {})
      musicToggle.classList.add('playing')
      playSongBtn.classList.add('playing')
    }
    musicPlaying = !musicPlaying
  }

  musicToggle.addEventListener('click', toggleMusic)
  playSongBtn.addEventListener('click', toggleMusic)

  // ---------- Confetti Effect ----------
  function spawnConfetti() {
    const rsvpCard = $('.rsvp-card')
    const colors = [
      '#C0887A',
      '#799A7F',
      '#3F7A62',
      '#C9A96E',
      '#d4a99e',
      '#a3bfa7',
    ]

    for (let i = 0; i < CONFETTI_COUNT; i++) {
      const confetti = document.createElement('div')
      confetti.classList.add('confetti-piece')
      confetti.style.left = Math.random() * 100 + '%'
      confetti.style.top = Math.random() * 30 + '%'
      confetti.style.backgroundColor =
        colors[Math.floor(Math.random() * colors.length)]
      confetti.style.animationDelay = Math.random() * 0.8 + 's'
      confetti.style.animationDuration = Math.random() * 1.5 + 1 + 's'
      confetti.style.width = Math.random() * 8 + 4 + 'px'
      confetti.style.height = Math.random() * 8 + 4 + 'px'
      confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px'
      rsvpCard.appendChild(confetti)
      confetti.addEventListener('animationend', () => confetti.remove())
    }
  }

  // ---------- Parallax on Scroll ----------
  let lastScrollY = 0
  let ticking = false

  function onScroll() {
    lastScrollY = window.scrollY
    if (!ticking) {
      requestAnimationFrame(() => {
        applyParallax(lastScrollY)
        ticking = false
      })
      ticking = true
    }
  }

  function applyParallax(scrollY) {
    const heroFlorals = $$('.hero-floral')
    heroFlorals.forEach((el) => {
      el.style.transform = `translateY(${scrollY * 0.15}px)`
    })
  }

  window.addEventListener('scroll', onScroll, { passive: true })

  // ---------- Header Shadow on Scroll ----------
  const header = $('#header')
  window.addEventListener(
    'scroll',
    () => {
      if (window.scrollY > 60) {
        header.style.boxShadow = '0 2px 20px rgba(49, 33, 39, 0.08)'
      } else {
        header.style.boxShadow = 'none'
      }
    },
    { passive: true },
  )

  // ---------- Hamburger Nav ----------
  const hamburgerBtn = $('#hamburger-btn')

  hamburgerBtn.addEventListener('click', () => {
    const sections = ['hero', 'event-details', 'countdown', 'rsvp', 'footer']
    const nextSection = sections.find((id) => {
      const el = document.getElementById(id)
      if (!el) return false
      return el.getBoundingClientRect().top > 100
    })

    if (nextSection) {
      document
        .getElementById(nextSection)
        .scrollIntoView({ behavior: 'smooth' })
    } else {
      document.getElementById('hero').scrollIntoView({ behavior: 'smooth' })
    }
  })

  // ---------- Utilities ----------
  function debounce(fn, delay) {
    let timer
    return function (...args) {
      clearTimeout(timer)
      timer = setTimeout(() => fn.apply(this, args), delay)
    }
  }

  // ---------- Preload ----------
  function preloadImages() {
    ;[
      'assets/floral-corner.png',
      'assets/floral-divider.png',
      'assets/floral-wreath.png',
    ].forEach((src) => {
      const img = new Image()
      img.src = src
    })
  }

  preloadImages()
})()
