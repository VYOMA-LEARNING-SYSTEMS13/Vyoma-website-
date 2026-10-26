import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default function TrigonometryGLB({ fallbackSrc = '/images/hero_3d/card_3d_enhanced.png' }) {
  const mountRef = useRef(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

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
      console.warn('WebGL not supported for TrigonometryGLB:', e);
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

    // Perspective camera framed with a gentle 3D perspective so the animated circle and wave depth are crystal clear
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
    const baseCamPos = new THREE.Vector3(0.4, 0.45, 3.6);
    camera.position.copy(baseCamPos);
    camera.lookAt(0, 0, 0);

    const rootGroup = new THREE.Group();
    // Subtle fixed 3D tilt to show depth without obscuring the front-facing unit circle
    rootGroup.rotation.x = 0.10;
    rootGroup.rotation.y = -0.16;
    scene.add(rootGroup);

    // Accent lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(4, 5, 5);
    scene.add(keyLight);

    const cyanRim = new THREE.DirectionalLight(0x06b6d4, 3.2);
    cyanRim.position.set(-5, -2, 4);
    scene.add(cyanRim);

    const purpleFill = new THREE.DirectionalLight(0xa855f7, 2.5);
    purpleFill.position.set(3, -4, -3);
    scene.add(purpleFill);

    let mixer = null;
    let modelMesh = null;
    const loader = new GLTFLoader();

    loader.load(
      '/3d_models/trigonometry.glb',
      (gltf) => {
        modelMesh = gltf.scene;

        const box = new THREE.Box3().setFromObject(modelMesh);
        const size = new THREE.Vector3();
        box.getSize(size);
        // Base scale on the XY circle diameter (37.8) so the unit circle is prominent and clear, not shrunk by the Z-extrusion length
        const xyDim = Math.max(size.x, size.y);
        const scale = xyDim > 0 ? 2.35 / xyDim : 1;
        modelMesh.scale.setScalar(scale);

        // Center on the unit circle's origin (0, 0, 0)
        modelMesh.position.set(0, 0, 0);

        // Refine materials for luminous, high-contrast mathematical curves
        modelMesh.traverse((child) => {
          if (child.isMesh && child.material) {
            child.material.roughness = 0.2;
            child.material.metalness = 0.2;
            const name = (child.name || '').toLowerCase();
            const matName = (child.material.name || '').toLowerCase();

            if (name.includes('cos') || matName.includes('cos')) {
              child.material.color = new THREE.Color(0x0284c7);
              child.material.emissive = new THREE.Color(0x06b6d4);
              child.material.emissiveIntensity = 0.7;
            } else if (name.includes('sin') || name.includes('sen') || matName.includes('sin')) {
              child.material.color = new THREE.Color(0x7c3aed);
              child.material.emissive = new THREE.Color(0xa855f7);
              child.material.emissiveIntensity = 0.7;
            } else if (name.includes('circle') || name.includes('circumference') || matName.includes('circle')) {
              child.material.color = new THREE.Color(0xf59e0b);
              child.material.emissive = new THREE.Color(0xd97706);
              child.material.emissiveIntensity = 0.6;
            } else if (name.includes('tang') || matName.includes('tan')) {
              child.material.color = new THREE.Color(0x10b981);
              child.material.emissive = new THREE.Color(0x059669);
              child.material.emissiveIntensity = 0.6;
            } else if (name.includes('sphere') || matName.includes('lambert')) {
              child.material.color = new THREE.Color(0xfbbf24);
              child.material.emissive = new THREE.Color(0xf59e0b);
              child.material.emissiveIntensity = 0.7;
            } else {
              child.material.color = new THREE.Color(0x4f46e5);
              child.material.emissive = new THREE.Color(0x3730a3);
              child.material.emissiveIntensity = 0.45;
            }
            child.material.needsUpdate = true;
          }
        });

        rootGroup.add(modelMesh);

        // Play the unit circle angle/sine/cosine animation
        if (gltf.animations && gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(modelMesh);
          gltf.animations.forEach((clip) => {
            const action = mixer.clipAction(clip);
            action.timeScale = 0.75;
            action.play();
          });
        }

        setIsLoaded(true);
        handleResize();
      },
      undefined,
      (err) => {
        console.warn('Failed to load trigonometry.glb:', err);
        setLoadFailed(true);
      }
    );

    // Responsive resize handling with dynamic camera framing
    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (w === 0 || h === 0) return;
      const aspect = w / h;
      camera.aspect = aspect;

      const baseDist = 3.6;
      const dist = aspect < 1 ? baseDist / Math.max(aspect, 0.65) : baseDist;
      camera.position.copy(baseCamPos.clone().normalize().multiplyScalar(dist));
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };

    handleResize();
    const ro = new ResizeObserver(handleResize);
    ro.observe(mount);

    // Animation Loop: animates the internal trigonometry demonstration WITHOUT the spinning rotation
    let animId = null;
    let isVisible = true;
    let isPageVisible = !document.hidden;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.1);

      // Play the mathematical animation
      if (mixer) mixer.update(delta);

      // Note: Full continuous Y-rotation is intentionally removed so the animated unit circle stays stably facing forward

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
      renderer.dispose();
      scene.clear();
    };
  }, []);

  if (loadFailed) {
    return (
      <img
        src={fallbackSrc}
        alt="Trigonometry Mathematical Model"
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
