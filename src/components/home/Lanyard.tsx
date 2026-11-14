'use client'

// The 3D ID card on its lanyard. Loaded only through next/dynamic from
// HeroCard, so three, drei, rapier and meshline stay out of the page bundle.

import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { Canvas, extend, useFrame, type ThreeElement, type ThreeEvent } from '@react-three/fiber'
import { Environment, Lightformer, RoundedBox } from '@react-three/drei'
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
import {
  BUCKLE_PX,
  CARD_COLORS,
  CARD_PX,
  SHADOW_PX,
  STRAP_PX,
  drawBack,
  drawBuckle,
  drawFront,
  drawShadow,
  drawStrap,
  loadCardFonts,
  loadPhoto,
} from './cardTextures'

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
const CARD_D = 0.02
/** World units per CSS px. Everything visible is laid out in px times S. */
const S = CARD_W / CARD_PX.w
/** The card as drawn: 210x296px. */
const CARD_H = CARD_PX.h * S
/** The physics collider keeps the brief's half extents. */
const COLLIDER: [number, number, number] = [0.8, 1.125, 0.01]
/** The card hangs from a point this far above its centre. */
const JOINT_Y = 1.45
/** The same point in px above the card's top edge. */
const JOINT_PX = JOINT_Y / S - CARD_PX.h / 2

/**
 * The canvas is the 240x470 stage plus 80px each side: 400x630. The camera
 * distance makes one CSS px one px on screen at the card's depth.
 */
const CANVAS_H = 630
const CANVAS_W = 400
const FOV = 25
const CAMERA_Z = (CANVAS_H * S) / 2 / Math.tan(((FOV / 2) * Math.PI) / 180)

/**
 * The static card hangs from a point 40px above the stage (40px below the
 * canvas top), tilted -3deg, with its top edge 176px down the strap. The 3D
 * card rests in the same pose: gravity leans 3 degrees, and the anchor sits
 * up the same line, off the top of the canvas.
 */
const TILT = (3 * Math.PI) / 180
const DOWN = new THREE.Vector3(Math.sin(TILT), -Math.cos(TILT), 0)
const PIVOT = new THREE.Vector3(0, (CANVAS_H / 2 - 40) * S, 0)
const JOINT = PIVOT.clone().addScaledVector(DOWN, (176 - JOINT_PX) * S)
/**
 * The rope joints give a little under the card's weight (measured: 5.5px
 * over the three of them), so the anchor sits that much higher and the
 * bodies start at their stretched rest places. Nothing moves on the swap.
 */
const SEGMENT = 1 + (5.5 * S) / 3
const ANCHOR = JOINT.clone().addScaledVector(DOWN, -3 * SEGMENT)
const GRAVITY: [number, number, number] = [DOWN.x * 40, DOWN.y * 40, 0]
const at = (base: THREE.Vector3, along: number): [number, number, number] => {
  const v = base.clone().addScaledVector(DOWN, along)
  return [v.x, v.y, v.z]
}

/**
 * The two strap lengths. They leave the buckle 5px either side of the centre
 * line and spread by 12px per 104px, as on the static card. Distances are up
 * the strap from the joint.
 */
const STRAP_END = 30 * S
const SPREAD = 12 / 104
const OFFSETS = [5 * S, 5 * S + SPREAD * (1 - STRAP_END), 5 * S + SPREAD * (2 - STRAP_END), 5 * S + SPREAD * (3 - STRAP_END)]
/** meshline widths are in clip space: world units over tan(fov / 2). */
const STRAP_LINE = (STRAP_PX.w * S) / Math.tan(((FOV / 2) * Math.PI) / 180)

/**
 * How far the held card's centre may go from the canvas centre: far enough
 * for a good tug, never so far that an edge of the canvas cuts the card.
 */
const REACH_X = (CANVAS_W / 2 - CARD_PX.w / 2 - 8) * S
const REACH_Y = (CANVAS_H / 2 - CARD_PX.h / 2 - 8) * S

/* --- textures --------------------------------------------------------------- */

interface Textures {
  front: THREE.CanvasTexture
  back: THREE.CanvasTexture
  strap: THREE.CanvasTexture
  buckle: THREE.CanvasTexture
  shadow: THREE.CanvasTexture
}

function toTexture(c: HTMLCanvasElement, mipmaps = true) {
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  if (!mipmaps) {
    t.generateMipmaps = false
    t.minFilter = THREE.LinearFilter
  }
  t.needsUpdate = true
  return t
}

/* --- geometry --------------------------------------------------------------- */

/** The slot (64x8, 7px from the top) and the two holes, as paths. */
function slotPaths() {
  const top = CARD_H / 2
  const slotW = 64 * S
  const sr = 4 * S
  const slotY = top - 11 * S
  const slot = new THREE.Path()
  slot.moveTo(-slotW / 2 + sr, slotY - sr)
  slot.lineTo(slotW / 2 - sr, slotY - sr)
  slot.absarc(slotW / 2 - sr, slotY, sr, -Math.PI / 2, Math.PI / 2, false)
  slot.lineTo(-slotW / 2 + sr, slotY + sr)
  slot.absarc(-slotW / 2 + sr, slotY, sr, Math.PI / 2, (3 * Math.PI) / 2, false)
  const paths = [slot]
  for (const cx of [-43 * S, 43 * S]) {
    const hole = new THREE.Path()
    hole.absarc(cx, slotY, 3 * S, 0, Math.PI * 2, true)
    paths.push(hole)
  }
  return paths
}

function roundedRect(x: number, y: number, w: number, h: number, r: number) {
  const shape = new THREE.Shape()
  shape.moveTo(x + r, y)
  shape.lineTo(x + w - r, y)
  shape.absarc(x + w - r, y + r, r, -Math.PI / 2, 0, false)
  shape.lineTo(x + w, y + h - r)
  shape.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2, false)
  shape.lineTo(x + r, y + h)
  shape.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI, false)
  shape.lineTo(x, y + r)
  shape.absarc(x + r, y + r, r, Math.PI, (3 * Math.PI) / 2, false)
  return shape
}

/** Maps a flat geometry's UVs to 0..1 across a rectangle. */
function fitUvs(geo: THREE.BufferGeometry, x: number, y: number, w: number, h: number) {
  const pos = geo.attributes.position
  const uv = geo.attributes.uv
  for (let i = 0; i < pos.count; i++) uv.setXY(i, (pos.getX(i) - x) / w, (pos.getY(i) - y) / h)
  uv.needsUpdate = true
  return geo
}

function makeGeometries() {
  // The holder: a rounded card with the slot and holes cut through.
  const outline = roundedRect(-CARD_W / 2, -CARD_H / 2, CARD_W, CARD_H, CARD_PX.radius * S)
  outline.holes.push(...slotPaths())
  const body = new THREE.ExtrudeGeometry(outline, { depth: CARD_D, bevelEnabled: false, curveSegments: 12 })
  body.translate(0, 0, -CARD_D / 2)
  const face = fitUvs(new THREE.ShapeGeometry(outline, 12), -CARD_W / 2, -CARD_H / 2, CARD_W, CARD_H)

  // The shadow sheet: 16px lower than the card, with the same cut-outs, so the
  // desk shows through the slot as it does on the static card.
  const m = SHADOW_PX.margin * S
  const drop = SHADOW_PX.offset * S
  const sw = CARD_W + m * 2
  const sh = CARD_H + m * 2
  const sheet = new THREE.Shape()
  sheet.moveTo(-sw / 2, -sh / 2 - drop)
  sheet.lineTo(sw / 2, -sh / 2 - drop)
  sheet.lineTo(sw / 2, sh / 2 - drop)
  sheet.lineTo(-sw / 2, sh / 2 - drop)
  sheet.closePath()
  sheet.holes.push(...slotPaths())
  const shadow = fitUvs(new THREE.ShapeGeometry(sheet, 12), -sw / 2, -sh / 2 - drop, sw, sh)

  // The snap hook's loop: a rounded ring whose lower bar sits in the slot.
  const top = CARD_H / 2
  const ring = roundedRect(-11 * S, top - 11 * S, 22 * S, 30 * S, 8 * S)
  const path = new THREE.CatmullRomCurve3(
    ring.getPoints(10).map((p) => new THREE.Vector3(p.x, p.y, 0)),
    true,
  )
  const hook = new THREE.TubeGeometry(path, 120, 2.1 * S, 10, true)

  return { body, face, shadow, hook }
}

/* --- the strap and card ----------------------------------------------------- */

const segmentProps: RigidBodyProps = {
  type: 'dynamic',
  canSleep: true,
  colliders: false,
  angularDamping: 4,
  linearDamping: 4,
}

const UP = new THREE.Vector3(0, 1, 0)

/**
 * meshline widens a line by the same clip-space amount in x and y, which on
 * a canvas that is not square makes a slanted strap thicker than an upright
 * one. Scaling the y part by the aspect ratio makes the width even.
 */
function evenWidth(material: MeshLineMaterial | null) {
  if (!material || material.userData.evenWidth) return
  material.userData.evenWidth = true
  material.vertexShader = material.vertexShader.replace(
    'finalPosition.xy += normal.xy * side;',
    'normal.y *= aspect; finalPosition.xy += normal.xy * side;',
  )
  material.needsUpdate = true
}
type Line = THREE.Mesh<MeshLineGeometry, MeshLineMaterial>

function Band({
  textures,
  shadowColor,
  onFirstFrame,
  onRest,
}: {
  textures: Textures
  shadowColor: string
  onFirstFrame: () => void
  /** True once the card has hung still for a moment, false when it is picked up. */
  onRest: (resting: boolean) => void
}) {
  const left = useRef<Line>(null)
  const right = useRef<Line>(null)
  const buckle = useRef<THREE.Group>(null)
  const fixed = useRef<RapierRigidBody>(null!)
  const j1 = useRef<RapierRigidBody>(null!)
  const j2 = useRef<RapierRigidBody>(null!)
  const j3 = useRef<RapierRigidBody>(null!)
  const card = useRef<RapierRigidBody>(null!)
  // The drawn (interpolated) positions of the strap's joints.
  const o1 = useRef<THREE.Group>(null)
  const o2 = useRef<THREE.Group>(null)
  const o3 = useRef<THREE.Group>(null)

  const [tmp] = useState(() => ({
    vec: new THREE.Vector3(),
    dir: new THREE.Vector3(),
    ang: new THREE.Vector3(),
    rot: new THREE.Vector3(),
    p1: new THREE.Vector3(),
    p2: new THREE.Vector3(),
    p3: new THREE.Vector3(),
    end: new THREE.Vector3(),
    tan: new THREE.Vector3(),
    side: new THREE.Vector3(),
    /** Smoothed middle points; null until the first frame. */
    s1: null as THREE.Vector3 | null,
    s2: null as THREE.Vector3 | null,
    still: false,
  }))
  const [curves] = useState(() =>
    [0, 1].map(() => {
      const c = new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()])
      c.curveType = 'chordal'
      return c
    }),
  )
  const [dragged, setDragged] = useState<THREE.Vector3 | null>(null)
  const [hovered, setHovered] = useState(false)
  const held = useRef<{ target: Element; id: number } | null>(null)
  const frames = useRef(0)
  const stillFrames = useRef(0)

  const geos = useMemo(makeGeometries, [])
  useEffect(
    () => () => {
      for (const g of Object.values(geos)) g.dispose()
    },
    [geos],
  )

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1])
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1])
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1])
  useSphericalJoint(j3, card, [[0, 0, 0], [0, JOINT_Y, 0]])

  // Cursor: grab over the card, grabbing while held. Reset on the way out.
  useEffect(() => {
    if (!hovered && !dragged) return
    const style = document.body.style
    style.cursor = dragged ? 'grabbing' : 'grab'
    // No text selection on the page while the card is held.
    if (dragged) style.userSelect = 'none'
    return () => {
      style.cursor = ''
      style.userSelect = ''
    }
  }, [hovered, dragged])

  // Let go if the pointer is released or lost anywhere, not only on the card.
  useEffect(() => {
    if (!dragged) return
    const drop = () => {
      const h = held.current
      held.current = null
      try {
        if (h) h.target.releasePointerCapture(h.id)
      } catch {
        // Already released.
      }
      setDragged(null)
    }
    window.addEventListener('pointerup', drop)
    window.addEventListener('pointercancel', drop)
    window.addEventListener('blur', drop)
    return () => {
      window.removeEventListener('pointerup', drop)
      window.removeEventListener('pointercancel', drop)
      window.removeEventListener('blur', drop)
    }
  }, [dragged])

  useFrame((state, delta) => {
    const t = tmp
    if (dragged && card.current) {
      // Where the pointer's ray crosses the plane the card hangs in.
      t.vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera)
      t.dir.copy(t.vec).sub(state.camera.position).normalize()
      t.vec.copy(state.camera.position).addScaledVector(t.dir, -state.camera.position.z / t.dir.z)
      for (const r of [card, j1, j2, j3, fixed]) r.current?.wakeUp()
      // Keep the held card on the canvas, so it is never cut off at an edge.
      card.current.setNextKinematicTranslation({
        x: THREE.MathUtils.clamp(t.vec.x - dragged.x, -REACH_X, REACH_X),
        y: THREE.MathUtils.clamp(t.vec.y - dragged.y, -REACH_Y, REACH_Y),
        z: 0,
      })
    }

    const ready = card.current && o1.current && o2.current && o3.current && left.current && right.current && buckle.current
    if (ready) {
      const moving = Boolean(dragged) || !card.current.isSleeping() || !j3.current.isSleeping() || !j1.current.isSleeping()
      if (moving || !t.still) {
        o1.current!.getWorldPosition(t.p1)
        o2.current!.getWorldPosition(t.p2)
        o3.current!.getWorldPosition(t.p3)
        // Smooth the middle points so the strap doesn't jitter.
        if (!t.s1 || !t.s2) {
          t.s1 = t.p1.clone()
          t.s2 = t.p2.clone()
        }
        const k1 = Math.max(0.1, Math.min(1, t.s1.distanceTo(t.p1)))
        t.s1.lerp(t.p1, Math.min(1, delta * (10 + k1 * 40)))
        const k2 = Math.max(0.1, Math.min(1, t.s2.distanceTo(t.p2)))
        t.s2.lerp(t.p2, Math.min(1, delta * (10 + k2 * 40)))
        t.still = !moving && t.s1.distanceToSquared(t.p1) < 1e-8 && t.s2.distanceToSquared(t.p2) < 1e-8

        // The buckle hangs at the end of the strap and lines up with it.
        t.dir.copy(t.s2).sub(t.p3)
        if (t.dir.lengthSq() < 1e-8) t.dir.copy(UP)
        t.dir.normalize()
        buckle.current!.position.copy(t.p3)
        buckle.current!.quaternion.setFromUnitVectors(UP, t.dir)
        t.end.copy(t.p3).addScaledVector(t.dir, STRAP_END)

        // Two lengths, spreading apart on the way up.
        const centre = [t.end, t.s2, t.s1, ANCHOR]
        for (let i = 0; i < 4; i++) {
          if (i === 0) t.tan.copy(t.dir)
          else t.tan.copy(centre[Math.min(i + 1, 3)]).sub(centre[i - 1])
          t.side.set(t.tan.y, -t.tan.x, 0)
          if (t.side.lengthSq() < 1e-8) t.side.set(1, 0, 0)
          t.side.normalize()
          curves[0].points[i].copy(centre[i]).addScaledVector(t.side, -OFFSETS[i])
          curves[1].points[i].copy(centre[i]).addScaledVector(t.side, OFFSETS[i])
        }
        left.current!.geometry.setPoints(curves[0].getPoints(24))
        right.current!.geometry.setPoints(curves[1].getPoints(24))
      }

      // Damp the spin so the card settles facing forward.
      if (!dragged && !card.current.isSleeping()) {
        t.ang.copy(card.current.angvel())
        t.rot.copy(card.current.rotation())
        card.current.setAngvel({ x: t.ang.x, y: t.ang.y - t.rot.y * 0.25, z: t.ang.z }, false)
      }
    }
    frames.current += 1
    if (frames.current === 2) onFirstFrame()
    // Half a second of stillness: tell the canvas it can stop drawing.
    if (tmp.still && !dragged) {
      stillFrames.current += 1
      if (stillFrames.current === 30) onRest(true)
    } else {
      stillFrames.current = 0
    }
  })

  const onDown = (e: ThreeEvent<PointerEvent>) => {
    if (!card.current || e.button !== 0) return
    e.stopPropagation()
    // Set before the browser's own mousedown handling, so holding the card
    // never starts a text selection. Cleared by the cursor effect.
    document.body.style.userSelect = 'none'
    const target = e.target as Element
    target.setPointerCapture?.(e.pointerId)
    held.current = { target, id: e.pointerId }
    stillFrames.current = 0
    onRest(false)
    // The grab point's offset from the card's centre, in the card's plane.
    const from = card.current.translation()
    setDragged(new THREE.Vector3(e.point.x - from.x, e.point.y - from.y, 0))
  }
  const onUp = (e: ThreeEvent<PointerEvent>) => {
    held.current = null
    ;(e.target as Element).releasePointerCapture?.(e.pointerId)
    setDragged(null)
  }

  const top = CARD_H / 2
  const hookZ = CARD_D / 2 + 2.1 * S + 0.003
  return (
    <>
      <RigidBody ref={fixed} position={at(ANCHOR, 0)} {...segmentProps} type="fixed" />
      <RigidBody ref={j1} position={at(ANCHOR, SEGMENT)} {...segmentProps}>
        <BallCollider args={[0.1]} />
        <group ref={o1} />
      </RigidBody>
      <RigidBody ref={j2} position={at(ANCHOR, 2 * SEGMENT)} {...segmentProps}>
        <BallCollider args={[0.1]} />
        <group ref={o2} />
      </RigidBody>
      <RigidBody ref={j3} position={at(JOINT, 0)} {...segmentProps}>
        <BallCollider args={[0.1]} />
        <group ref={o3} />
      </RigidBody>
      <RigidBody
        ref={card}
        position={at(JOINT, JOINT_Y)}
        rotation={[0, 0, TILT]}
        {...segmentProps}
        type={dragged ? 'kinematicPosition' : 'dynamic'}
      >
        <CuboidCollider args={COLLIDER} />
        {/* Soft shadow under the card; the pointer goes through it. */}
        <mesh geometry={geos.shadow} position={[0, 0, -CARD_D / 2 - 0.004]} raycast={() => null} renderOrder={-1}>
          <meshBasicMaterial
            map={textures.shadow}
            color={shadowColor}
            transparent
            opacity={0.25}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
        <group
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onPointerDown={onDown}
          onPointerUp={onUp}
          onPointerCancel={onUp}
        >
          {/* The crimson holder, with the printed faces just off its surface. */}
          <mesh geometry={geos.body}>
            <meshStandardMaterial color={CARD_COLORS.crimson} roughness={0.55} />
          </mesh>
          <mesh geometry={geos.face} position={[0, 0, CARD_D / 2 + 0.001]}>
            <meshBasicMaterial map={textures.front} toneMapped={false} />
          </mesh>
          <mesh geometry={geos.face} position={[0, 0, -CARD_D / 2 - 0.001]} rotation={[0, Math.PI, 0]}>
            <meshBasicMaterial map={textures.back} toneMapped={false} />
          </mesh>

          {/* Snap hook: the loop through the slot (one on each face), its
              spring gate, the barrel and the swivel ring. */}
          <mesh geometry={geos.hook} position={[0, 0, hookZ]}>
            <Metal />
          </mesh>
          <mesh geometry={geos.hook} position={[0, 0, -hookZ]}>
            <Metal />
          </mesh>
          {[hookZ, -hookZ].map((z) => (
            <mesh key={z} position={[11 * S, top + 8 * S, z]}>
              <capsuleGeometry args={[2.7 * S, 8 * S, 4, 12]} />
              <Metal dark />
            </mesh>
          ))}
          <mesh position={[0, top + 23 * S, 0]}>
            <cylinderGeometry args={[3.6 * S, 3.6 * S, 15 * S, 20]} />
            <Metal />
          </mesh>
          <mesh position={[0, top + (JOINT_PX - 5.5) * S, 0]}>
            <torusGeometry args={[5 * S, 1.6 * S, 10, 28]} />
            <Metal />
          </mesh>
        </group>
      </RigidBody>

      {/* The black plastic buckle, moved every frame to the strap's end.
          Flat black, as on the static card: lit plastic reads as grey. */}
      <group ref={buckle} position={at(JOINT, 0)} rotation={[0, 0, TILT]}>
        <RoundedBox args={[BUCKLE_PX.w * S, BUCKLE_PX.h * S, 8 * S]} radius={3.2 * S} smoothness={4} position={[0, 20 * S, 0]}>
          <meshBasicMaterial color={CARD_COLORS.buckle} toneMapped={false} />
        </RoundedBox>
        {[1, -1].map((f) => (
          <mesh key={f} position={[0, 20 * S, f * (4 * S + 0.001)]} rotation={[0, f === 1 ? 0 : Math.PI, 0]}>
            <planeGeometry args={[(BUCKLE_PX.w - BUCKLE_PX.inset * 2) * S, (BUCKLE_PX.h - BUCKLE_PX.inset * 2) * S]} />
            <meshBasicMaterial map={textures.buckle} toneMapped={false} />
          </mesh>
        ))}
        {/* The tab is thinner than the swivel ring, so the ring shows through it. */}
        <RoundedBox args={[12 * S, 9 * S, 1.8 * S]} radius={0.8 * S} smoothness={3} position={[0, 0.5 * S, 0]}>
          <meshBasicMaterial color={CARD_COLORS.buckle} toneMapped={false} />
        </RoundedBox>
      </group>

      {[left, right].map((ref, i) => (
        <mesh key={i} ref={ref} frustumCulled={false} raycast={() => null}>
          <meshLineGeometry />
          <meshLineMaterial
            ref={evenWidth}
            color="white"
            useMap={1}
            map={textures.strap}
            lineWidth={STRAP_LINE}
            resolution={[CANVAS_W, CANVAS_H]}
            toneMapped={false}
          />
        </mesh>
      ))}
    </>
  )
}

/** Lit metal comes out lighter than its colour, so it starts a shade darker
 *  and lands near the static card's silver. */
function Metal({ dark = false }: { dark?: boolean }) {
  return <meshStandardMaterial color={dark ? '#565E70' : '#808A9E'} metalness={0.6} roughness={0.42} />
}

function Scene({
  textures,
  shadowColor,
  active,
  onReady,
  onRest,
}: {
  textures: Textures
  shadowColor: string
  active: boolean
  onReady: () => void
  onRest: (resting: boolean) => void
}) {
  return (
    <>
      <ambientLight intensity={Math.PI} />
      {/* The physics step runs before the strap is rebuilt (priority -1), so
          the strap meets the hardware exactly as both are drawn. */}
      <Physics gravity={GRAVITY} timeStep={1 / 60} interpolate paused={!active} updatePriority={-1}>
        <Band textures={textures} shadowColor={shadowColor} onFirstFrame={onReady} onRest={onRest} />
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

/** The page's shadow colour (`--shadow-rgb`, "r g b") as a CSS colour. */
function readShadowColor(el: Element) {
  const rgb = getComputedStyle(el).getPropertyValue('--shadow-rgb').trim().split(/[\s,]+/).map(Number)
  return rgb.length === 3 && rgb.every((n) => Number.isFinite(n)) ? `rgb(${rgb.join(',')})` : 'rgb(42,38,34)'
}

export default function Lanyard({
  card,
  backWord,
  photo,
  onReady,
  onError,
}: {
  card: HomeCard
  /** The word on the back of the card. */
  backWord: string
  photo?: string
  /** Called once the card has drawn its first frame with textures ready. */
  onReady: () => void
  /** Called if the card cannot be drawn; the static card stays. */
  onError: () => void
}) {
  const wrap = useRef<HTMLDivElement>(null)
  const alive = useRef(true)
  const [textures, setTextures] = useState<Textures | null>(null)
  const [shadowColor, setShadowColor] = useState('rgb(42,38,34)')
  const [onScreen, setOnScreen] = useState(true)
  const [tabVisible, setTabVisible] = useState(true)
  const [resting, setResting] = useState(false)
  const active = onScreen && tabVisible

  useEffect(() => {
    alive.current = true
    return () => {
      alive.current = false
    }
  }, [])

  // Draw the textures once, after the fonts and the photo are ready.
  useEffect(() => {
    let cancelled = false
    let made: Textures | null = null
    ;(async () => {
      const text = `${card.name}${card.role}${card.location}${backWord}C`
      const [fonts, img] = await Promise.all([loadCardFonts(text), loadPhoto(photo)])
      if (cancelled) return
      if (!fonts) throw new Error('Card fonts did not load')
      // Two texels per screen px, sampled without mipmaps: each screen px
      // averages the four texels under it, which keeps the text sharp.
      const scale = 2 * Math.min(2, Math.max(1, window.devicePixelRatio || 1))
      made = {
        front: toTexture(drawFront(card, img, scale), false),
        back: toTexture(drawBack(backWord, scale), false),
        strap: toTexture(drawStrap()),
        buckle: toTexture(drawBuckle()),
        shadow: toTexture(drawShadow()),
      }
      setTextures(made)
    })().catch(() => {
      if (!cancelled) onError()
    })
    return () => {
      cancelled = true
      if (made) for (const t of Object.values(made)) t.dispose()
    }
  }, [card, backWord, photo, onError])

  // The shadow follows the page theme.
  useEffect(() => {
    const el = wrap.current
    if (!el) return
    const update = () => setShadowColor(readShadowColor(el))
    update()
    const mo = new MutationObserver(update)
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class', 'style'] })
    const scheme = window.matchMedia('(prefers-color-scheme: dark)')
    scheme.addEventListener('change', update)
    return () => {
      mo.disconnect()
      scheme.removeEventListener('change', update)
    }
  }, [])

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
          camera={{ position: [0, 0, CAMERA_Z], fov: FOV, near: 1, far: 60 }}
          dpr={[1, 2]}
          gl={{ alpha: true, antialias: true }}
          // Nothing is drawn while off screen or hidden, and once the card
          // hangs still it is only redrawn when something changes.
          frameloop={!active ? 'never' : resting ? 'demand' : 'always'}
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
            // A lost context leaves a blank canvas: go back to the static
            // card. (R3F also forces a loss on unmount; that one is ignored.)
            state.gl.domElement.addEventListener('webglcontextlost', () => {
              if (alive.current) onError()
            })
          }}
          style={{ pointerEvents: 'none' }}
        >
          <Suspense fallback={null}>
            <Scene textures={textures} shadowColor={shadowColor} active={active} onReady={onReady} onRest={setResting} />
          </Suspense>
        </Canvas>
      ) : null}
    </div>
  )
}
