'use client'

// The 3D ID card on its strap. Loaded only through next/dynamic from
// HeroCard, so three, drei, rapier and meshline stay out of the page bundle.

import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { Canvas, extend, useFrame, useThree, type ThreeElement, type ThreeEvent } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
  type RapierRigidBody,
  type RigidBodyProps,
} from '@react-three/rapier'
import { MeshLineGeometry, MeshLineMaterial } from 'meshline'
import type { HomeCard } from '@/content/home'
import { CARD_COLORS, CARD_PX, drawBack, drawFront, drawStrap, loadCardFonts, loadPhoto } from './cardTextures'

extend({ MeshLineGeometry, MeshLineMaterial })

declare module '@react-three/fiber' {
  interface ThreeElements {
    meshLineGeometry: ThreeElement<typeof MeshLineGeometry>
    // The constructor works without parameters; R3F sets props afterwards.
    meshLineMaterial: Omit<ThreeElement<typeof MeshLineMaterial>, 'args'> & {
      args?: ConstructorParameters<typeof MeshLineMaterial>
    }
  }
}

/* --- sizes ------------------------------------------------------------------ */

const CARD_W = 1.6
const CARD_H = 2.25
const CARD_D = 0.02
/** World units per CSS px on the card. */
const S = CARD_W / CARD_PX.w

/**
 * The canvas is the 240x470 stage plus 80px each side: 400x630.
 * The camera distance makes the card 296px tall, the static card's size, and
 * the anchor puts the resting card where the static one hangs.
 */
const CANVAS_H = 630
const FOV = 25
const CAMERA_Z = (CANVAS_H * (CARD_H / CARD_PX.h)) / 2 / Math.tan(((FOV / 2) * Math.PI) / 180)
/** Static card centre is 49px below the canvas centre. */
const ANCHOR_Y = -49 * (CARD_H / CARD_PX.h) + 3 + 1.45

/* --- textures --------------------------------------------------------------- */

interface Textures {
  front: THREE.CanvasTexture
  back: THREE.CanvasTexture
  strap: THREE.CanvasTexture
}

function toTexture(c: HTMLCanvasElement, anisotropy = 4) {
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = anisotropy
  t.needsUpdate = true
  return t
}

/* --- card geometry ---------------------------------------------------------- */

/** The card outline with its slot and two holes, centred on the origin. */
function cardShape() {
  const w = CARD_W
  const h = CARD_H
  const r = CARD_PX.radius * S
  const x = -w / 2
  const y = -h / 2
  const shape = new THREE.Shape()
  shape.moveTo(x + r, y)
  shape.lineTo(x + w - r, y)
  shape.quadraticCurveTo(x + w, y, x + w, y + r)
  shape.lineTo(x + w, y + h - r)
  shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  shape.lineTo(x + r, y + h)
  shape.quadraticCurveTo(x, y + h, x, y + h - r)
  shape.lineTo(x, y + r)
  shape.quadraticCurveTo(x, y, x + r, y)

  // Slot 64x8 at 7px from the top; holes 6px either side.
  const top = h / 2
  const slotW = 64 * S
  const slotH = 8 * S
  const slotY = top - 7 * S - slotH / 2
  const slot = new THREE.Path()
  const sr = slotH / 2
  slot.moveTo(-slotW / 2 + sr, slotY - sr)
  slot.lineTo(slotW / 2 - sr, slotY - sr)
  slot.absarc(slotW / 2 - sr, slotY, sr, -Math.PI / 2, Math.PI / 2, false)
  slot.lineTo(-slotW / 2 + sr, slotY + sr)
  slot.absarc(-slotW / 2 + sr, slotY, sr, Math.PI / 2, (3 * Math.PI) / 2, false)
  shape.holes.push(slot)
  for (const cx of [-43 * S, 43 * S]) {
    const hole = new THREE.Path()
    hole.absarc(cx, top - 11 * S, 3 * S, 0, Math.PI * 2, true)
    shape.holes.push(hole)
  }
  return shape
}

/** Maps a flat shape geometry's UVs to 0..1 across the card. */
function fitUvs(geo: THREE.BufferGeometry) {
  const pos = geo.attributes.position
  const uv = geo.attributes.uv
  for (let i = 0; i < pos.count; i++) {
    uv.setXY(i, (pos.getX(i) + CARD_W / 2) / CARD_W, (pos.getY(i) + CARD_H / 2) / CARD_H)
  }
  uv.needsUpdate = true
  return geo
}

/* --- the strap and card ----------------------------------------------------- */

const segmentProps: RigidBodyProps = {
  type: 'dynamic',
  canSleep: true,
  colliders: false,
  angularDamping: 4,
  linearDamping: 4,
}

type Body = RapierRigidBody & { lerped?: THREE.Vector3 }

function Band({ textures, onFirstFrame }: { textures: Textures; onFirstFrame: () => void }) {
  const band = useRef<THREE.Mesh<MeshLineGeometry, MeshLineMaterial>>(null)
  const fixed = useRef<Body>(null!)
  const j1 = useRef<Body>(null!)
  const j2 = useRef<Body>(null!)
  const j3 = useRef<Body>(null!)
  const card = useRef<Body>(null!)

  const [vec] = useState(() => new THREE.Vector3())
  const [ang] = useState(() => new THREE.Vector3())
  const [rot] = useState(() => new THREE.Vector3())
  const [dir] = useState(() => new THREE.Vector3())
  const [curve] = useState(() => {
    const c = new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()])
    c.curveType = 'chordal'
    return c
  })
  const [dragged, setDragged] = useState<THREE.Vector3 | null>(null)
  const [hovered, setHovered] = useState(false)
  const frames = useRef(0)
  const size = useThree((s) => s.size)

  const geos = useMemo(() => {
    const shape = cardShape()
    const body = new THREE.ExtrudeGeometry(shape, { depth: CARD_D, bevelEnabled: false, curveSegments: 12 })
    body.translate(0, 0, -CARD_D / 2)
    const face = fitUvs(new THREE.ShapeGeometry(shape, 12))
    return { body, face }
  }, [])
  useEffect(() => () => {
    geos.body.dispose()
    geos.face.dispose()
  }, [geos])

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1])
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1])
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1])
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.45, 0]])

  // Cursor: grab over the card, grabbing while held. Reset on the way out.
  useEffect(() => {
    if (!hovered && !dragged) return
    document.body.style.cursor = dragged ? 'grabbing' : 'grab'
    return () => {
      document.body.style.cursor = ''
    }
  }, [hovered, dragged])

  useFrame((state, delta) => {
    if (dragged && card.current) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera)
      dir.copy(vec).sub(state.camera.position).normalize()
      vec.add(dir.multiplyScalar(state.camera.position.length()))
      for (const r of [card, j1, j2, j3, fixed]) r.current?.wakeUp()
      card.current.setNextKinematicTranslation({ x: vec.x - dragged.x, y: vec.y - dragged.y, z: vec.z - dragged.z })
    }
    if (fixed.current && j1.current && j2.current && j3.current && card.current && band.current) {
      // Smooth the middle points so the strap doesn't jitter.
      for (const r of [j1.current, j2.current]) {
        if (!r.lerped) r.lerped = new THREE.Vector3().copy(r.translation())
        const d = Math.max(0.1, Math.min(1, r.lerped.distanceTo(r.translation())))
        r.lerped.lerp(r.translation(), Math.min(1, delta * (10 + d * 40)))
      }
      curve.points[0].copy(j3.current.translation())
      curve.points[1].copy(j2.current.lerped!)
      curve.points[2].copy(j1.current.lerped!)
      curve.points[3].copy(fixed.current.translation())
      band.current.geometry.setPoints(curve.getPoints(32))
      // Damp the spin so the card settles facing forward.
      ang.copy(card.current.angvel())
      rot.copy(card.current.rotation())
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z }, true)
    }
    frames.current += 1
    if (frames.current === 2) onFirstFrame()
  })

  const onDown = (e: ThreeEvent<PointerEvent>) => {
    if (!card.current) return
    e.stopPropagation()
    // No text selection while the card is held.
    e.nativeEvent.preventDefault()
    ;(e.target as Element).setPointerCapture?.(e.pointerId)
    setDragged(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())))
  }
  const onUp = (e: ThreeEvent<PointerEvent>) => {
    ;(e.target as Element).releasePointerCapture?.(e.pointerId)
    setDragged(null)
  }

  return (
    <>
      <group position={[0, ANCHOR_Y, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0, -1, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[0, -2, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[0, -3, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[0, -4.45, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? 'kinematicPosition' : 'dynamic'}
        >
          <CuboidCollider args={[CARD_W / 2, CARD_H / 2, CARD_D / 2]} />
          <group
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            onPointerDown={onDown}
            onPointerUp={onUp}
          >
            {/* Card body: the crimson holder. */}
            <mesh geometry={geos.body}>
              <meshStandardMaterial color={CARD_COLORS.crimson} roughness={0.55} />
            </mesh>
            <mesh geometry={geos.face} position={[0, 0, CARD_D / 2 + 0.001]}>
              <meshBasicMaterial map={textures.front} toneMapped={false} />
            </mesh>
            <mesh geometry={geos.face} position={[0, 0, -CARD_D / 2 - 0.001]} rotation={[0, Math.PI, 0]}>
              <meshBasicMaterial map={textures.back} toneMapped={false} />
            </mesh>
            <Hardware />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={[size.width, size.height]}
          useMap={1}
          map={textures.strap}
          repeat={[-3, 1]}
          lineWidth={0.75}
          transparent
          alphaTest={0.5}
        />
      </mesh>
    </>
  )
}

/** Metal clip through the slot, a swivel ring and stem, and the black buckle
 *  where the strap meets them. Card-local units; the card top is y 1.125. */
function Hardware() {
  const top = CARD_H / 2
  return (
    <group>
      {/* Clip, 44x24px. */}
      <mesh position={[0, top + 5.5 * S, 0]}>
        <boxGeometry args={[44 * S, 24 * S, 0.035]} />
        <meshStandardMaterial color={CARD_COLORS.metal} metalness={0.85} roughness={0.3} />
      </mesh>
      {/* Stem. */}
      <mesh position={[0, top + 0.17, 0]}>
        <cylinderGeometry args={[0.022, 0.022, 0.12, 12]} />
        <meshStandardMaterial color={CARD_COLORS.metal} metalness={0.85} roughness={0.3} />
      </mesh>
      {/* Swivel ring. */}
      <mesh position={[0, top + 0.25, 0]}>
        <torusGeometry args={[0.04, 0.012, 8, 20]} />
        <meshStandardMaterial color={CARD_COLORS.metal} metalness={0.85} roughness={0.3} />
      </mesh>
      {/* Buckle. */}
      <mesh position={[0, top + 0.36, 0]}>
        <boxGeometry args={[0.2, 0.16, 0.06]} />
        <meshStandardMaterial color={CARD_COLORS.buckle} roughness={0.5} />
      </mesh>
    </group>
  )
}

/** Calls `onReady` once, after the second frame (the first one drawn). */
function Scene({
  textures,
  active,
  onReady,
}: {
  textures: Textures
  active: boolean
  onReady: () => void
}) {
  return (
    <>
      <ambientLight intensity={Math.PI} />
      <Physics gravity={[0, -40, 0]} timeStep={1 / 60} interpolate paused={!active}>
        <Band textures={textures} onFirstFrame={onReady} />
      </Physics>
      <Environment blur={0.75}>
        <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
      </Environment>
    </>
  )
}

/* --- entry ------------------------------------------------------------------ */

export default function Lanyard({
  card,
  backWord,
  photo,
  onReady,
}: {
  card: HomeCard
  /** The word on the back of the card. */
  backWord: string
  photo?: string
  /** Called once the card has drawn its first frame with textures ready. */
  onReady: () => void
}) {
  const wrap = useRef<HTMLDivElement>(null)
  const [textures, setTextures] = useState<Textures | null>(null)
  const [onScreen, setOnScreen] = useState(true)
  const [tabVisible, setTabVisible] = useState(true)
  const active = onScreen && tabVisible

  // Draw the textures once, after the fonts and the photo are ready.
  useEffect(() => {
    let cancelled = false
    let made: Textures | null = null
    ;(async () => {
      const [, img] = await Promise.all([loadCardFonts(), loadPhoto(photo)])
      if (cancelled) return
      made = {
        front: toTexture(drawFront(card, img), 8),
        back: toTexture(drawBack(backWord), 8),
        strap: toTexture(drawStrap()),
      }
      made.strap.wrapS = made.strap.wrapT = THREE.RepeatWrapping
      setTextures(made)
    })()
    return () => {
      cancelled = true
      if (made) for (const t of Object.values(made)) t.dispose()
    }
  }, [card, backWord, photo])

  // Pause while off screen or while the tab is hidden.
  useEffect(() => {
    const el = wrap.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting))
    io.observe(el)
    const onVis = () => setTabVisible(document.visibilityState === 'visible')
    onVis()
    document.addEventListener('visibilitychange', onVis)
    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  return (
    <div ref={wrap} aria-hidden className="pointer-events-none absolute -inset-[80px]">
      {textures ? (
        <Canvas
          camera={{ position: [0, 0, CAMERA_Z], fov: FOV }}
          dpr={[1, 2]}
          gl={{ alpha: true, antialias: true }}
          frameloop={active ? 'always' : 'never'}
          // Events come from the whole page, so the canvas itself can ignore
          // the pointer: only a hit on the card does anything.
          eventSource={document.body}
          onCreated={(state) => {
            state.setEvents({
              compute: (event, s) => {
                const r = s.gl.domElement.getBoundingClientRect()
                s.pointer.set(((event.clientX - r.left) / r.width) * 2 - 1, -((event.clientY - r.top) / r.height) * 2 + 1)
                s.raycaster.setFromCamera(s.pointer, s.camera)
              },
            })
          }}
          style={{ pointerEvents: 'none' }}
        >
          <Suspense fallback={null}>
            <Scene textures={textures} active={active} onReady={onReady} />
          </Suspense>
        </Canvas>
      ) : null}
    </div>
  )
}
