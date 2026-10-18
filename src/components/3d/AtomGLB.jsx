import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default function AtomGLB({ fallbackSrc = '/images/hero_3d/atom_3d_enhanced.png' }) {
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
      console.warn('WebGL not supported for AtomGLB:', e);
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

    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(0, 0.5, 6.2);
    camera.lookAt(0, 0, 0);

    const atomGroup = new THREE.Group();
    scene.add(atomGroup);

    // Dynamic accent lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(4, 6, 6);
    scene.add(keyLight);

    const cyanRim = new THREE.DirectionalLight(0x06b6d4, 2.5);
    cyanRim.position.set(-6, -3, 3);
    scene.add(cyanRim);

    const purpleLight = new THREE.DirectionalLight(0xa855f7, 2.0);
    purpleLight.position.set(5, -5, -3);
    scene.add(purpleLight);

    let mixer = null;
    let modelMesh = null;
    const loader = new GLTFLoader();

    loader.load(
      '/3d_models/animated_atom_blender_cycles.glb',
      (gltf) => {
        modelMesh = gltf.scene;

        const box = new THREE.Box3().setFromObject(modelMesh);
        const size = new THREE.Vector3();
        box.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z);
        // Normalize scale so rotating electron orbit rings remain completely inside camera view
        const scale = maxDim > 0 ? 3.5 / maxDim : 1;
        modelMesh.scale.setScalar(scale);

        // Center nucleus
        const center = new THREE.Vector3();
        box.getCenter(center);
        modelMesh.position.sub(center.clone().multiplyScalar(scale));

        // Shading touchups for neon electron trails
        modelMesh.traverse((child) => {
          if (child.isMesh && child.material) {
            child.material.roughness = Math.min(child.material.roughness, 0.3);
            if (child.material.color) {
              child.material.emissive = child.material.color.clone().multiplyScalar(0.2);
            }
          }
        });

        atomGroup.add(modelMesh);

        if (gltf.animations && gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(modelMesh);
          gltf.animations.forEach((clip) => {
            const action = mixer.clipAction(clip);
            action.timeScale = 0.65;
            action.play();
          });
        }
      },
      undefined,
      (err) => {
        console.warn('Failed to load animated_atom_blender_cycles.glb:', err);
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

      const baseDist = 6.2;
      const dist = aspect < 1 ? baseDist / Math.max(aspect, 0.7) : baseDist;
      camera.position.set(0, 0.5, dist);
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

      if (mixer) mixer.update(delta);

      // Subtle slow precession for depth
      atomGroup.rotation.y += 0.35 * delta;
      atomGroup.rotation.x = Math.sin(clock.getElapsedTime() * 0.8) * 0.15;

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
        alt="3D Atom Model"
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
