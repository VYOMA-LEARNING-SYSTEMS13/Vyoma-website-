import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default function CosineFunctionGLB({ fallbackSrc = '/images/hero_3d/card_3d_enhanced.png' }) {
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
      console.warn('WebGL not supported for CosineFunctionGLB:', e);
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

    // Perspective camera framed closely so the cosine wave and unit circle are prominent
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
    const baseCamPos = new THREE.Vector3(0.3, 0.65, 2.9);
    camera.position.copy(baseCamPos);
    camera.lookAt(0, 0, 0);

    const rootGroup = new THREE.Group();
    // 3D perspective angle
    rootGroup.rotation.y = -0.24;
    rootGroup.rotation.x = 0.14;
    scene.add(rootGroup);

    // Luminous lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(4, 6, 6);
    scene.add(keyLight);

    const cyanRim = new THREE.DirectionalLight(0x06b6d4, 3.0);
    cyanRim.position.set(-5, -2, 4);
    scene.add(cyanRim);

    const purpleFill = new THREE.DirectionalLight(0xa855f7, 2.4);
    purpleFill.position.set(3, -4, -2);
    scene.add(purpleFill);

    let mixer = null;
    let modelMesh = null;
    const loader = new GLTFLoader();

    loader.load(
      '/3d_models/visualizing_trigonometry_cosine_function.glb',
      (gltf) => {
        modelMesh = gltf.scene;

        // Compute bounds and center the model
        const box = new THREE.Box3().setFromObject(modelMesh);
        const size = new THREE.Vector3();
        box.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z);

        // Scale to 2.45 for prominent framing inside the canvas
        const scale = maxDim > 0 ? 2.45 / maxDim : 1;
        modelMesh.scale.setScalar(scale);

        const center = new THREE.Vector3();
        box.getCenter(center);
        modelMesh.position.sub(center.clone().multiplyScalar(scale));

        // High-contrast, vibrant STEM palette for clear visibility on light backgrounds
        modelMesh.traverse((child) => {
          if (child.isMesh && child.material) {
            const nodeName = (child.name || '').toLowerCase();
            const matName = (child.material.name || '').toLowerCase();

            child.material.roughness = 0.2;
            child.material.metalness = 0.25;

            if (nodeName.includes('pdiscshape') || matName.includes('yellow')) {
              // Wave curve points: vibrant luminous cyan with strong contrast
              child.material.color = new THREE.Color(0x0284c7);
              child.material.emissive = new THREE.Color(0x06b6d4);
              child.material.emissiveIntensity = 0.75;
            } else if (nodeName.includes('ptorus') || matName.includes('material')) {
              // Unit circle torus / sine-cosine indicator: vibrant royal purple
              child.material.color = new THREE.Color(0x7c3aed);
              child.material.emissive = new THREE.Color(0xa855f7);
              child.material.emissiveIntensity = 0.7;
            } else if (nodeName.includes('typemesh')) {
              // Math labels / function text: high contrast deep indigo
              child.material.color = new THREE.Color(0x312e81);
              child.material.emissive = new THREE.Color(0x4338ca);
              child.material.emissiveIntensity = 0.4;
            } else {
              // Axes, grid guides, and frames: clean indigo-blue
              child.material.color = new THREE.Color(0x4f46e5);
              child.material.emissive = new THREE.Color(0x3730a3);
              child.material.emissiveIntensity = 0.4;
            }
            child.material.needsUpdate = true;
          }
        });

        rootGroup.add(modelMesh);

        // Play the cosine wave propagation animation
        if (gltf.animations && gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(modelMesh);
          gltf.animations.forEach((clip) => {
            const action = mixer.clipAction(clip);
            action.timeScale = 0.85;
            action.play();
          });
        }
      },
      undefined,
      (err) => {
        console.warn('Failed to load visualizing_trigonometry_cosine_function.glb:', err);
        setLoadFailed(true);
      }
    );

    // Responsive camera framing adapting dynamically to viewport aspect ratio
    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (w === 0 || h === 0) return;
      const aspect = w / h;
      camera.aspect = aspect;

      const baseDist = 2.9;
      const dist = aspect < 1.1 ? baseDist * (1.1 / Math.max(aspect, 0.55)) : baseDist;
      camera.position.copy(baseCamPos.clone().normalize().multiplyScalar(dist));
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();

      renderer.setSize(w, h, false);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(mount);
    handleResize();

    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      if (mixer) {
        mixer.update(delta);
      }

      // Gentle subtle floating motion
      if (rootGroup) {
        rootGroup.rotation.y = -0.24 + Math.sin(elapsed * 0.7) * 0.07;
        rootGroup.rotation.x = 0.14 + Math.cos(elapsed * 0.6) * 0.04;
        rootGroup.position.y = Math.sin(elapsed * 0.9) * 0.04;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      if (mixer) mixer.stopAllAction();

      scene.traverse((obj) => {
        if (obj.isMesh) {
          if (obj.geometry) obj.geometry.dispose();
          if (obj.material) {
            if (Array.isArray(obj.material)) {
              obj.material.forEach((m) => m.dispose());
            } else {
              obj.material.dispose();
            }
          }
        }
      });

      if (renderer) {
        renderer.dispose();
        if (mount.contains(renderer.domElement)) {
          mount.removeChild(renderer.domElement);
        }
      }
    };
  }, []);

  if (loadFailed) {
    return (
      <div className="hero-3d-canvas-wrap">
        <img
          src={fallbackSrc}
          alt="Cosine Function Math Model"
          className="hero-3d-img"
          loading="eager"
        />
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      className="hero-3d-canvas-wrap"
      aria-label="Interactive 3D Cosine Function Wave Visualization"
    />
  );
}
