import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default function FlaskGLB({ fallbackSrc = '/images/hero_3d/flask_3d_enhanced.png' }) {
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
      console.warn('WebGL not supported for FlaskGLB:', e);
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
    camera.position.set(0, 0, 5.4);
    camera.lookAt(0, 0, 0);

    // Root group with slight tilt matching reference composition
    const flaskGroup = new THREE.Group();
    flaskGroup.rotation.z = -0.22;
    flaskGroup.rotation.y = 0.18;
    scene.add(flaskGroup);

    // Studio lighting for crisp glass highlights and luminous liquid
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
    keyLight.position.set(4, 7, 5);
    scene.add(keyLight);

    const rimSpecular = new THREE.DirectionalLight(0x38bdf8, 2.8);
    rimSpecular.position.set(-6, 4, 3);
    scene.add(rimSpecular);

    const purpleGlow = new THREE.DirectionalLight(0xa855f7, 2.6);
    purpleGlow.position.set(2, -4, 3);
    scene.add(purpleGlow);

    const disposables = [];

    // Effervescent Floating Bubbles
    const bubbleGeo = new THREE.SphereGeometry(0.04, 16, 16);
    disposables.push(bubbleGeo);

    const bubbleMat = new THREE.MeshPhysicalMaterial({
      color: 0xe9d5ff,
      emissive: 0xa855f7,
      emissiveIntensity: 0.7,
      roughness: 0.05,
      transmission: 0.8,
      transparent: true,
      opacity: 0.85,
    });
    disposables.push(bubbleMat);

    const bubbles = [];
    const bubbleConfigs = [
      { x: -0.18, z: 0.12, speed: 0.35, phase: 0 },
      { x: 0.22, z: -0.10, speed: 0.42, phase: 1.5 },
      { x: -0.07, z: -0.18, speed: 0.38, phase: 2.8 },
      { x: 0.26, z: 0.15, speed: 0.48, phase: 4.0 },
      { x: 0.04, z: 0.08, speed: 0.32, phase: 5.2 },
    ];

    bubbleConfigs.forEach((cfg) => {
      const mesh = new THREE.Mesh(bubbleGeo, bubbleMat);
      mesh.renderOrder = 2;
      flaskGroup.add(mesh);
      bubbles.push({ mesh, ...cfg });
    });

    // Glowing Cyan Orbital Ring with Satellite Bead
    const ringCurve = new THREE.EllipseCurve(0, 0, 1.25, 0.65, 0, 2 * Math.PI, false, 0);
    const ringPoints = ringCurve.getPoints(80).map((p) => new THREE.Vector3(p.x, 0, p.y));
    const ringGeo = new THREE.BufferGeometry().setFromPoints(ringPoints);
    disposables.push(ringGeo);

    const ringMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.45,
    });
    disposables.push(ringMat);

    const ringMesh = new THREE.LineLoop(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2.6;
    ringMesh.rotation.z = 0.25;
    ringMesh.position.y = -0.15;
    flaskGroup.add(ringMesh);

    // Satellite Bead
    const beadGeo = new THREE.SphereGeometry(0.08, 16, 16);
    disposables.push(beadGeo);
    const beadMat = new THREE.MeshPhysicalMaterial({
      color: 0x22d3ee,
      emissive: 0x06b6d4,
      emissiveIntensity: 0.8,
      roughness: 0.1,
      metalness: 0.1,
      clearcoat: 1.0,
    });
    disposables.push(beadMat);

    const beadMesh = new THREE.Mesh(beadGeo, beadMat);
    flaskGroup.add(beadMesh);

    // Load actual GLB 3D model
    const loader = new GLTFLoader();
    loader.load(
      '/3d_models/chemistry_glassware.glb',
      (gltf) => {
        const erlenNode = gltf.scene.getObjectByName('lab_erlenmeyer_a');
        if (!erlenNode) {
          console.warn('lab_erlenmeyer_a not found in chemistry_glassware.glb');
          setLoadFailed(true);
          return;
        }

        // Isolate the Erlenmeyer flask inside a dedicated container
        const isolateGroup = new THREE.Group();
        isolateGroup.add(erlenNode);

        // Center on local geometry
        const box = new THREE.Box3().setFromObject(isolateGroup);
        const center = new THREE.Vector3();
        box.getCenter(center);
        erlenNode.position.sub(center);

        // Orient upright (glb height was along Z)
        const orientGroup = new THREE.Group();
        orientGroup.rotation.x = -Math.PI / 2;
        orientGroup.add(isolateGroup);

        // Scale to fill framing cleanly without clipping neck or base
        const orientBox = new THREE.Box3().setFromObject(orientGroup);
        const size = new THREE.Vector3();
        orientBox.getSize(size);
        const maxDim = Math.max(size.y, size.x, size.z);
        const scale = maxDim > 0 ? 2.7 / maxDim : 1;
        orientGroup.scale.setScalar(scale);

        // Upgrade glass material on the actual GLB mesh
        erlenNode.traverse((child) => {
          if (child.isMesh) {
            const originalMap = child.material?.map || null;
            child.material = new THREE.MeshPhysicalMaterial({
              map: originalMap,
              color: new THREE.Color(0xffffff),
              transparent: true,
              opacity: 0.72,
              roughness: 0.04,
              metalness: 0.05,
              transmission: 0.86,
              ior: 1.5,
              clearcoat: 1.0,
              clearcoatRoughness: 0.03,
              depthWrite: false,
              side: THREE.DoubleSide,
            });
            child.renderOrder = 3;
          }
        });

        // Add internal glowing purple liquid volume matching Vyoma brand
        const liquidGeo = new THREE.CylinderGeometry(0.52, 0.88, 1.05, 36);
        disposables.push(liquidGeo);
        const liquidMat = new THREE.MeshPhysicalMaterial({
          color: 0x8b5cf6,
          emissive: 0x6d28d9,
          emissiveIntensity: 0.65,
          roughness: 0.12,
          metalness: 0.08,
          transparent: true,
          opacity: 0.85,
          clearcoat: 0.8,
        });
        disposables.push(liquidMat);
        const liquidMesh = new THREE.Mesh(liquidGeo, liquidMat);
        liquidMesh.position.set(0, -0.82, 0);
        liquidMesh.renderOrder = 1;
        flaskGroup.add(liquidMesh);

        // Meniscus surface cap
        const meniscusGeo = new THREE.CircleGeometry(0.52, 36);
        meniscusGeo.rotateX(-Math.PI / 2);
        disposables.push(meniscusGeo);
        const meniscusMat = new THREE.MeshPhysicalMaterial({
          color: 0xa855f7,
          emissive: 0x7c3aed,
          emissiveIntensity: 0.8,
          roughness: 0.05,
          transparent: true,
          opacity: 0.9,
        });
        disposables.push(meniscusMat);
        const meniscusMesh = new THREE.Mesh(meniscusGeo, meniscusMat);
        meniscusMesh.position.set(0, -0.30, 0);
        meniscusMesh.renderOrder = 1;
        flaskGroup.add(meniscusMesh);

        flaskGroup.add(orientGroup);
      },
      undefined,
      (err) => {
        console.warn('Failed to load chemistry_glassware.glb:', err);
        setLoadFailed(true);
      }
    );

    // Responsive resize handling with dynamic camera distance to guarantee full flask visibility
    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (w === 0 || h === 0) return;
      const aspect = w / h;
      camera.aspect = aspect;

      const fovRad = (camera.fov * Math.PI) / 180;
      const distForHeight = (2.9 / 2) / Math.tan(fovRad / 2);
      const distForWidth = (2.6 / 2) / (Math.tan(fovRad / 2) * aspect);
      camera.position.z = Math.max(distForHeight, distForWidth, 5.4);
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

      // Gentle floating bob and slight sway
      flaskGroup.position.y = Math.sin(t * 1.3) * 0.06;
      flaskGroup.rotation.y = 0.2 + Math.sin(t * 0.7) * 0.12;

      // Animate effervescent rising bubbles
      bubbles.forEach((b) => {
        const cycle = ((t * b.speed + b.phase) % 1.0);
        b.mesh.position.y = -1.25 + cycle * 0.95; // Ascend through liquid
        b.mesh.position.x = b.x + Math.sin(t * 2.0 + b.phase) * 0.03;
        b.mesh.position.z = b.z + Math.cos(t * 2.0 + b.phase) * 0.03;
        const scale = 0.5 + cycle * 0.4;
        b.mesh.scale.set(scale, scale, scale);
      });

      // Animate satellite bead along the tilted orbit
      const beadAngle = t * 1.1;
      const bx = Math.cos(beadAngle) * 1.25;
      const bz = Math.sin(beadAngle) * 0.65;
      beadMesh.position.set(
        bx * Math.cos(0.25) - bz * Math.sin(0.25),
        -0.15 + bz * Math.sin(Math.PI / 2.6) * 0.5,
        bz * Math.cos(Math.PI / 2.6)
      );

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
      disposables.forEach((d) => d.dispose());
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
        alt="3D Laboratory Flask"
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
