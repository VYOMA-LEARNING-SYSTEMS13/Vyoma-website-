import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default function MoleculeGLB({ fallbackSrc = '/images/hero_3d/molecule_3d_enhanced.png' }) {
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
      console.warn('WebGL not supported for MoleculeGLB:', e);
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

    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, -0.05, 4.6);
    camera.lookAt(0, 0, 0);

    const moleculeGroup = new THREE.Group();
    scene.add(moleculeGroup);

    // Dynamic specular and fill lights matching the palette
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(4, 5, 5);
    scene.add(keyLight);

    const cyanRim = new THREE.DirectionalLight(0x06b6d4, 2.4);
    cyanRim.position.set(-5, -3, 3);
    scene.add(cyanRim);

    const purpleLight = new THREE.DirectionalLight(0xa855f7, 2.0);
    purpleLight.position.set(3, -4, -3);
    scene.add(purpleLight);

    let modelMesh = null;
    const loader = new GLTFLoader();

    loader.load(
      '/3d_models/cytosine_molecule__dnarna_base_3d_model.glb',
      (gltf) => {
        modelMesh = gltf.scene;

        const box = new THREE.Box3().setFromObject(modelMesh);
        const size = new THREE.Vector3();
        box.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z);
        // Normalize scale to 2.2 so outer atoms remain framed comfortably during 3D rotation
        const scale = maxDim > 0 ? 2.2 / maxDim : 1;
        modelMesh.scale.setScalar(scale);

        // Center molecule
        const center = new THREE.Vector3();
        box.getCenter(center);
        modelMesh.position.sub(center.clone().multiplyScalar(scale));

        // Refine atom glossiness and colors
        modelMesh.traverse((child) => {
          if (child.isMesh && child.material) {
            child.material.roughness = Math.min(child.material.roughness, 0.2);
            child.material.metalness = 0.15;
            if (child.material.isMeshStandardMaterial) {
              child.material.envMapIntensity = 1.5;
            }
          }
        });

        moleculeGroup.add(modelMesh);
      },
      undefined,
      (err) => {
        console.warn('Failed to load cytosine molecule:', err);
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

      const baseDist = 4.6;
      const dist = aspect < 1 ? baseDist / Math.max(aspect, 0.75) : baseDist;
      camera.position.set(0, -0.05, dist);
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
      const t = clock.getElapsedTime();

      // Slow, majestic 3D rotation revealing molecular structure
      moleculeGroup.rotation.y += 0.42 * delta;
      moleculeGroup.rotation.x = Math.sin(t * 0.4) * 0.15;
      moleculeGroup.rotation.z = Math.cos(t * 0.3) * 0.12;

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
        alt="3D Molecule Structure"
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
