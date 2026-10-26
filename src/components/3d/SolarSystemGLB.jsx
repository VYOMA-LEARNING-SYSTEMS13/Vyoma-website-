import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default function SolarSystemGLB({ fallbackSrc = '/images/hero_3d/solar_3d_enhanced.png' }) {
  const mountRef = useRef(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

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

    // Perspective camera with dynamic framing
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    const camDir = new THREE.Vector3(0, 7.5, 12.0).normalize();
    camera.position.copy(camDir.clone().multiplyScalar(36.0));
    camera.lookAt(0, 0, 0);

    // Root group for subtle planar tilt toward camera for depth
    const rootGroup = new THREE.Group();
    rootGroup.rotation.x = 0.32;
    rootGroup.rotation.z = -0.10;
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

        // Collect each planet orbit pivot for smooth, continuous revolution
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
        if (sunNode) {
          // Slightly boost radiant Sun scale for prominence
          sunNode.scale.multiplyScalar(1.25);
        }

        // Harmonize orbital radii and matching static orbit rings
        // so all 9 planets remain comfortably framed within the visible area
        const orbitScaleAdjustments = [
          { orbit: 'mercury_BezierCircle_4', line: 'mercury_BezierCircle.001_34', scale: 9.8 },
          { orbit: 'venus_BezierCircle_7', line: 'venus_BezierCircle.001_35', scale: 13.2 },
          { orbit: 'erath_BezierCircle_11', line: 'erath_BezierCircle.001_36', scale: 17.2 },
          { orbit: 'mars_BezierCircle_14', line: 'mars_BezierCircle.001_37', scale: 21.6 },
          { orbit: 'jupiter_BezierCircle_17', line: 'jupiter_BezierCircle.001_38', scale: 27.2 },
          { orbit: 'saturn_BezierCircle_21', line: 'saturn_BezierCircle.001_39', scale: 32.8 },
          { orbit: 'uranus_BezierCircle_24', line: 'uranus_BezierCircle.001_40', scale: 38.0 },
          { orbit: 'neptune_BezierCircle_27', line: 'neptune_BezierCircle.001_41', scale: 43.0 },
          { orbit: 'pluto_BezierCircle_30', line: 'pluto_BezierCircle.001_42', scale: 47.5 },
        ];
        orbitScaleAdjustments.forEach(({ orbit, line, scale }) => {
          const oNode = modelGroup.getObjectByName(orbit);
          const lNode = modelGroup.getObjectByName(line);
          if (oNode) oNode.scale.setScalar(scale);
          if (lNode) lNode.scale.setScalar(scale);
        });

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

        // Boost smaller planets so details are visible
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

        // Scale model group: outermost orbit radius is 47.5
        // Scale to world units: 47.5 * 0.22 = 10.45 units radius
        const worldScale = 0.22;
        modelGroup.scale.setScalar(worldScale);

        // Center modelGroup symmetrically at origin
        modelGroup.position.set(0, 0, 0);

        // Enhance materials
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
        setIsLoaded(true);
        handleResize();
      },
      undefined,
      (err) => {
        console.warn('Failed to load solar_system_animation.glb:', err);
        setLoadFailed(true);
      }
    );

    // Responsive resize handling with aspect-ratio adaptive camera framing
    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (w === 0 || h === 0) return;
      const aspect = w / h;
      camera.aspect = aspect;

      // Ensure planet orbits and Sun remain fully framed throughout 360° revolutions
      const fovRad = (camera.fov * Math.PI) / 180;
      const tanHalfFov = Math.tan(fovRad / 2);

      // Max orbital boundary in world units (Pluto ~10.45, plus Saturn's ring/orbit margin = ~11.2)
      const maxOrbitExtent = 11.2;
      const margin = 1.12;
      const targetRadius = maxOrbitExtent * margin;

      const distV = targetRadius / tanHalfFov;
      const distH = targetRadius / (tanHalfFov * aspect);
      const requiredDist = Math.max(distV, distH, 35.0);

      camera.position.copy(camDir.clone().multiplyScalar(requiredDist));
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
        opacity: isLoaded ? 1 : 0,
        transition: 'opacity 0.45s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    />
  );
}
