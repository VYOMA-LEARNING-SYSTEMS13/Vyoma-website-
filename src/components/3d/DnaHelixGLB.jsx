import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default function DnaHelixGLB({ fallbackSrc = '/images/hero_3d/dna_3d_enhanced.png' }) {
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
      console.warn('WebGL not supported for DnaHelixGLB:', e);
      setLoadFailed(true);
      return;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    // Perspective camera framing the full vertical length of the double helix
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0, 5.0);
    camera.lookAt(0, 0, 0);

    // Root group with slight aesthetic tilt
    const rootGroup = new THREE.Group();
    rootGroup.rotation.z = -0.16;
    rootGroup.rotation.x = 0.08;
    scene.add(rootGroup);

    // Vertical spin group (rotates around vertical Y axis)
    const spinGroup = new THREE.Group();
    rootGroup.add(spinGroup);

    // Lighting for luminous bioluminescent look matching Vyoma brand
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.6);
    keyLight.position.set(5, 8, 8);
    scene.add(keyLight);

    const cyanRim = new THREE.DirectionalLight(0x06b6d4, 3.0);
    cyanRim.position.set(-6, 2, 4);
    scene.add(cyanRim);

    const purpleGlow = new THREE.DirectionalLight(0xa855f7, 2.5);
    purpleGlow.position.set(6, -4, 4);
    scene.add(purpleGlow);

    let mixer = null;
    let modelMesh = null;
    const loader = new GLTFLoader();

    loader.load(
      '/3d_models/dna_smoother_mesh.glb',
      (gltf) => {
        modelMesh = gltf.scene;

        // The source model's long axis is horizontal along X.
        // Reorient to align the long double-helix axis strictly vertical along Y:
        const orientGroup = new THREE.Group();
        orientGroup.rotation.z = Math.PI / 2;
        orientGroup.add(modelMesh);

        // Compute bounds after orientation
        const box = new THREE.Box3().setFromObject(orientGroup);
        const size = new THREE.Vector3();
        box.getSize(size);
        const maxDim = Math.max(size.y, size.x, size.z);
        // Scale so the helix extends into the fading zone, giving the seamless emergence & dissolution look
        const scale = maxDim > 0 ? 3.35 / maxDim : 1;
        orientGroup.scale.setScalar(scale);

        // Center on the visual midpoint
        box.setFromObject(orientGroup);
        const center = new THREE.Vector3();
        box.getCenter(center);
        orientGroup.position.sub(center);

        // Rich, solid luminous Vyoma cyan and purple materials for strands & rungs
        modelMesh.traverse((child) => {
          if (child.isMesh) {
            const name = child.name || '';
            if (name === 'Cylinder_1') {
              // Main Strand A: Vibrant Sky Cyan
              child.material = new THREE.MeshPhysicalMaterial({
                color: new THREE.Color(0x38bdf8),
                emissive: new THREE.Color(0x0284c7),
                emissiveIntensity: 0.6,
                roughness: 0.15,
                metalness: 0.15,
                clearcoat: 1.0,
                clearcoatRoughness: 0.1,
                side: THREE.DoubleSide,
              });
            } else if (name === 'Cylinder_3') {
              // Main Strand B: Vibrant Royal Purple
              child.material = new THREE.MeshPhysicalMaterial({
                color: new THREE.Color(0xa855f7),
                emissive: new THREE.Color(0x7e22ce),
                emissiveIntensity: 0.6,
                roughness: 0.15,
                metalness: 0.15,
                clearcoat: 1.0,
                clearcoatRoughness: 0.1,
                side: THREE.DoubleSide,
              });
            } else {
              // Connecting base-pair rungs: Luminous glowing bridges
              child.material = new THREE.MeshPhysicalMaterial({
                color: new THREE.Color(0x67e8f9),
                emissive: new THREE.Color(0x06b6d4),
                emissiveIntensity: 0.5,
                roughness: 0.2,
                metalness: 0.2,
                clearcoat: 0.8,
                side: THREE.DoubleSide,
              });
            }
            child.material.needsUpdate = true;
          }
        });

        spinGroup.add(orientGroup);

        if (gltf.animations && gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(modelMesh);
          gltf.animations.forEach((clip) => {
            const action = mixer.clipAction(clip);
            action.timeScale = 0.2;
            action.play();
          });
        }

        setIsLoaded(true);
        handleResize();
      },
      undefined,
      (err) => {
        console.warn('Failed to load dna_smoother_mesh.glb:', err);
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

      const fovRad = (camera.fov * Math.PI) / 180;
      const tanHalfFov = Math.tan(fovRad / 2);

      const targetHeight = 2.90 * 1.15; // ~3.33
      const targetWidth = 1.30 * 1.15;  // ~1.50

      const distV = (targetHeight / 2) / tanHalfFov;
      const distH = (targetWidth / 2) / (tanHalfFov * aspect);
      const dist = Math.max(distV, distH, 5.0);

      camera.position.set(0, 0, dist);
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
      const elapsed = clock.getElapsedTime();

      if (mixer) mixer.update(delta);

      // Smooth rotation around vertical longitudinal axis
      spinGroup.rotation.y += 0.10 * delta;
      // Gentle floating oscillation
      rootGroup.position.y = Math.sin(elapsed * 0.8) * 0.04;

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
        alt="DNA Double Helix"
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
        WebkitMaskImage:
          'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.2) 6%, rgba(0,0,0,0.85) 18%, #000 28%, #000 72%, rgba(0,0,0,0.85) 82%, rgba(0,0,0,0.2) 94%, transparent 100%)',
        maskImage:
          'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.2) 6%, rgba(0,0,0,0.85) 18%, #000 28%, #000 72%, rgba(0,0,0,0.85) 82%, rgba(0,0,0,0.2) 94%, transparent 100%)',
      }}
    />
  );
}
