import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default function EarthGLB({ fallbackSrc = '/images/hero_3d/earth_3d_enhanced.png' }) {
  const mountRef = useRef(null);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
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
      console.warn('WebGL not supported for EarthGLB:', e);
      setLoadFailed(true);
      return;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    // 3/4 angled camera view showing depth and perspective
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0.4, 4.8);
    camera.lookAt(0, 0, 0);

    // Tilt group for realistic 23.4° Earth axial tilt
    const tiltGroup = new THREE.Group();
    tiltGroup.rotation.z = THREE.MathUtils.degToRad(-23.4);
    tiltGroup.rotation.x = THREE.MathUtils.degToRad(12.0);
    scene.add(tiltGroup);

    // Planet spin group
    const earthGroup = new THREE.Group();
    earthGroup.rotation.y = 2.4; // Face continents toward viewport
    tiltGroup.add(earthGroup);

    // Balanced lighting so Earth's continents and blue oceans are rich and saturated
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.1);
    scene.add(ambientLight);

    const sunKey = new THREE.DirectionalLight(0xfff7ed, 1.8);
    sunKey.position.set(5, 3, 5);
    scene.add(sunKey);

    const cyanAtmosphere = new THREE.DirectionalLight(0x06b6d4, 1.6);
    cyanAtmosphere.position.set(-6, 2, -3);
    scene.add(cyanAtmosphere);

    const purpleGlow = new THREE.DirectionalLight(0xa855f7, 1.2);
    purpleGlow.position.set(2, -5, 3);
    scene.add(purpleGlow);

    // Glowing atmospheric haze shell around Earth
    const atmoGeo = new THREE.SphereGeometry(1.56, 32, 32);
    const atmoMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.18,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
    });
    const atmoMesh = new THREE.Mesh(atmoGeo, atmoMat);
    tiltGroup.add(atmoMesh);

    let modelMesh = null;
    const loader = new GLTFLoader();

    loader.load(
      '/3d_models/earth.glb',
      (gltf) => {
        modelMesh = gltf.scene;

        const box = new THREE.Box3().setFromObject(modelMesh);
        const size = new THREE.Vector3();
        box.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z);
        // Normalize scale to 2.75 so the globe and surrounding glowing atmosphere shell fit comfortably without edge clipping
        const scale = maxDim > 0 ? 2.75 / maxDim : 1;
        modelMesh.scale.setScalar(scale);

        const center = new THREE.Vector3();
        box.getCenter(center);
        modelMesh.position.sub(center.clone().multiplyScalar(scale));

        // Preserve texture and optimize roughness
        modelMesh.traverse((child) => {
          if (child.isMesh && child.material) {
            child.material.roughness = 0.55;
            child.material.metalness = 0.05;
            child.material.needsUpdate = true;
          }
        });

        earthGroup.add(modelMesh);
      },
      undefined,
      (err) => {
        console.warn('Failed to load earth.glb:', err);
        setLoadFailed(true);
      }
    );

    // Responsive resize handling with dynamic camera distance
    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (w === 0 || h === 0) return;
      const aspect = w / h;
      camera.aspect = aspect;

      const baseDist = 5.0;
      const dist = aspect < 1 ? baseDist / Math.max(aspect, 0.75) : baseDist;
      camera.position.set(0, 0.4, dist);
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    handleResize();
    const ro = new ResizeObserver(handleResize);
    ro.observe(mount);

    // Animation Loop
    let animId = null;
    let isVisible = true;
    let isPageVisible = !document.hidden;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.1);

      // Smooth axial rotation around Earth's tilted axis
      earthGroup.rotation.y += 0.32 * delta;

      // Subtle atmospheric pulsation
      const t = clock.getElapsedTime();
      const pulse = 1.0 + Math.sin(t * 1.5) * 0.02;
      atmoMesh.scale.set(pulse, pulse, pulse);

      renderer.render(scene, camera);
    };

    const startLoop = () => {
      if (isVisible && isPageVisible && !animId) {
        clock.getDelta();
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
      atmoGeo.dispose();
      atmoMat.dispose();
      renderer.dispose();
      scene.clear();
    };
  }, []);

  if (loadFailed) {
    return (
      <img
        src={fallbackSrc}
        alt="Earth 3D Globe"
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
