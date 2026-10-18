import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default function SolarSystemGLB({ fallbackSrc = '/images/hero_3d/solar_3d_enhanced.png' }) {
  const mountRef = useRef(null);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    // Respect reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setLoadFailed(true);
      return;
    }

    const mount = mountRef.current;
    if (!mount) return;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
    } catch (e) {
      console.warn('WebGL not supported for SolarSystemGLB:', e);
      setLoadFailed(true);
      return;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    // Camera with zoomed-in perspective so planets and orbits are clearly noticed
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 8.2, 11.2);
    camera.lookAt(0, 0, 0);

    // Root group for overall tilt and placement
    const rootGroup = new THREE.Group();
    // Tilt the solar system plane toward the camera for depth and perspective
    rootGroup.rotation.x = 0.38;
    rootGroup.rotation.z = -0.14;
    scene.add(rootGroup);

    // Ambient and brand-aligned accent lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const sunPointLight = new THREE.PointLight(0xfff7ed, 3.5, 50, 1.0);
    sunPointLight.position.set(0, 0, 0);
    rootGroup.add(sunPointLight);

    const cyanRim = new THREE.DirectionalLight(0x22d3ee, 2.0);
    cyanRim.position.set(8, 10, 10);
    scene.add(cyanRim);

    const purpleFill = new THREE.DirectionalLight(0xa855f7, 1.6);
    purpleFill.position.set(-10, -6, 5);
    scene.add(purpleFill);

    let modelGroup = null;
    let orbitPivots = [];
    let moonPivot = null;
    let sunNode = null;
    let planetMeshes = [];

    const loader = new GLTFLoader();
    loader.load(
      '/3d_models/solar_system_animation.glb',
      (gltf) => {
        modelGroup = gltf.scene;

        // Collect each planet orbit pivot for smooth, continuous, unending rotation (never stops)
        orbitPivots = [
          { node: modelGroup.getObjectByName('mercury_BezierCircle_4'), speed: 0.92 },
          { node: modelGroup.getObjectByName('venus_BezierCircle_7'), speed: 0.68 },
          { node: modelGroup.getObjectByName('erath_BezierCircle_11'), speed: 0.50 },
          { node: modelGroup.getObjectByName('mars_BezierCircle_14'), speed: 0.38 },
          { node: modelGroup.getObjectByName('jupiter_BezierCircle_17'), speed: 0.25 },
          { node: modelGroup.getObjectByName('saturn_BezierCircle_21'), speed: 0.18 },
          { node: modelGroup.getObjectByName('uranus_BezierCircle_24'), speed: 0.13 },
          { node: modelGroup.getObjectByName('neptune_BezierCircle_27'), speed: 0.10 },
          { node: modelGroup.getObjectByName('pluto_BezierCircle_30'), speed: 0.08 },
        ];

        // Ensure Moon follows Earth smoothly
        const earthMesh = modelGroup.getObjectByName('erath_8');
        moonPivot = modelGroup.getObjectByName('moon_BezierCircle_33');
        if (earthMesh && moonPivot) {
          earthMesh.add(moonPivot);
          moonPivot.position.set(0, 0, 0);
        }

        sunNode = modelGroup.getObjectByName('sun_53');

        // Planet meshes for self-spin
        planetMeshes = [
          modelGroup.getObjectByName('mercury_2'),
          modelGroup.getObjectByName('venus_5'),
          modelGroup.getObjectByName('erath_8'),
          modelGroup.getObjectByName('mars_12'),
          modelGroup.getObjectByName('jupiter_15'),
          modelGroup.getObjectByName('saturn_19'),
          modelGroup.getObjectByName('uranus_22'),
          modelGroup.getObjectByName('neptune_25'),
          modelGroup.getObjectByName('pluto_28'),
        ].filter(Boolean);

        // Slightly boost smaller planets so they are clearly noticed when zoomed in
        const boosts = [
          { name: 'mercury_2', factor: 1.5 },
          { name: 'venus_5', factor: 1.25 },
          { name: 'erath_8', factor: 1.3 },
          { name: 'mars_12', factor: 1.45 },
          { name: 'pluto_28', factor: 1.8 },
        ];
        boosts.forEach(({ name, factor }) => {
          const m = modelGroup.getObjectByName(name);
          if (m) m.scale.multiplyScalar(factor);
        });

        // Calculate bounding box and scale for zoomed-in framing
        const box = new THREE.Box3().setFromObject(modelGroup);
        const size = new THREE.Vector3();
        box.getSize(size);
        const maxDim = Math.max(size.x, size.z);
        // Zoomed in scale (33.0 instead of 25.0)
        const scale = maxDim > 0 ? 33.0 / maxDim : 1;
        modelGroup.scale.setScalar(scale);

        // Position Sun naturally so the planetary orbits sweep across the hero space
        const center = new THREE.Vector3();
        box.getCenter(center);
        modelGroup.position.x = (-center.x + 1.2) * scale;
        modelGroup.position.z = (-center.z + 1.0) * scale;
        modelGroup.position.y = -center.y * scale;

        // Enhance materials with subtle emissive rim and radiant Sun
        modelGroup.traverse((child) => {
          if (child.isMesh && child.material) {
            child.material.roughness = Math.min(child.material.roughness, 0.4);
            const name = (child.name || '').toLowerCase();
            const matName = (child.material.name || '').toLowerCase();
            if (name.includes('sun') || matName.includes('sun')) {
              child.material.emissive = new THREE.Color(0xf59e0b);
              child.material.emissiveIntensity = 2.8;
            } else if (name.includes('saturn_ring') || matName.includes('saturn_ring')) {
              child.material.side = THREE.DoubleSide;
              child.material.transparent = true;
              child.material.opacity = 0.92;
            }
          }
        });

        rootGroup.add(modelGroup);
      },
      undefined,
      (err) => {
        console.warn('Failed to load solar_system_animation.glb:', err);
        setLoadFailed(true);
      }
    );

    // Resize handling with aspect-ratio adaptive camera framing
    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (w === 0 || h === 0) return;
      const aspect = w / h;
      camera.aspect = aspect;

      // Ensure planet orbits and Sun remain framed if aspect ratio changes
      const baseDist = 13.88; // Math.hypot(8.2, 11.2)
      const dist = aspect < 1 ? baseDist / Math.max(aspect, 0.75) : baseDist;
      const camDir = new THREE.Vector3(0, 8.2, 11.2).normalize();
      camera.position.copy(camDir.multiplyScalar(dist));
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    handleResize();
    const ro = new ResizeObserver(handleResize);
    ro.observe(mount);

    // Animation loop with pause on off-screen / tab switch
    let animId = null;
    let isVisible = true;
    let isPageVisible = !document.hidden;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.1);

      if (orbitPivots && orbitPivots.length > 0) {
        // Continuous, unending orbital revolution for all planets (never stops after 1 round)
        orbitPivots.forEach((p) => {
          if (p.node) p.node.rotation.y += p.speed * delta;
        });
        if (moonPivot) moonPivot.rotation.y += 2.0 * delta;
        if (sunNode) sunNode.rotation.y += 0.12 * delta;
        planetMeshes.forEach((m) => {
          m.rotation.y += 0.6 * delta;
        });
      } else if (modelGroup) {
        modelGroup.rotation.y += 0.25 * delta;
      }

      renderer.render(scene, camera);
    };

    const startLoop = () => {
      if (isVisible && isPageVisible && !animId) {
        clock.getDelta(); // reset delta
        animId = requestAnimationFrame(animate);
      }
    };

    const stopLoop = () => {
      if (animId) {
        cancelAnimationFrame(animId);
        animId = null;
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        isVisible ? startLoop() : stopLoop();
      },
      { threshold: 0.05 }
    );
    io.observe(mount);

    const onVisChange = () => {
      isPageVisible = !document.hidden;
      isPageVisible ? startLoop() : stopLoop();
    };
    document.addEventListener('visibilitychange', onVisChange);

    startLoop();

    return () => {
      stopLoop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVisChange);
      if (renderer.domElement && mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      scene.clear();
    };
  }, []);

  if (loadFailed) {
    return (
      <img
        src={fallbackSrc}
        alt="Solar System 3D Model"
        loading="eager"
        className="hero-3d-img"
      />
    );
  }

  return (
    <div
      ref={mountRef}
      className="hero-3d-canvas-wrap"
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        pointerEvents: 'none',
        overflow: 'visible',
      }}
    />
  );
}
