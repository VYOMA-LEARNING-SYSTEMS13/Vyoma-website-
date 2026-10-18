import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function DnaHelix3D({ fallbackSrc = '/images/hero_3d/dna_3d_enhanced.png' }) {
    const mountRef = useRef(null);
    const [webglFailed, setWebglFailed] = useState(false);

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            setWebglFailed(true);
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
            console.warn('WebGL not available for DnaHelix3D:', e);
            setWebglFailed(true);
            return;
        }

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        renderer.setPixelRatio(dpr);
        renderer.setClearColor(0x000000, 0);
        mount.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
        camera.position.set(0, 0, 7.8);

        const dnaGroup = new THREE.Group();
        // Slight tilt matching the reference image's diagonal orientation
        dnaGroup.rotation.z = -0.22;
        dnaGroup.rotation.x = 0.12;
        scene.add(dnaGroup);

        // Lighting for luminous, transparent bioluminescent materials
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
        scene.add(ambientLight);

        const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
        keyLight.position.set(4, 6, 8);
        scene.add(keyLight);

        const cyanLight = new THREE.DirectionalLight(0x06b6d4, 2.5);
        cyanLight.position.set(-6, 2, 4);
        scene.add(cyanLight);

        const purpleLight = new THREE.DirectionalLight(0xa855f7, 2.2);
        purpleLight.position.set(5, -4, 4);
        scene.add(purpleLight);

        const geometries = [];
        const materials = [];

        // ── 1. DOUBLE HELIX BACKBONES (TUBES) ──
        const turns = 2.2;
        const totalHeight = 5.6;
        const radius = 1.05;
        const samples = 140;

        const pointsA = [];
        const pointsB = [];

        for (let i = 0; i <= samples; i++) {
            const frac = i / samples;
            const angle = frac * turns * 2 * Math.PI;
            const y = (frac - 0.5) * totalHeight;

            // Strand A
            pointsA.push(new THREE.Vector3(
                Math.cos(angle) * radius,
                y,
                Math.sin(angle) * radius
            ));

            // Strand B (offset by 180 degrees)
            pointsB.push(new THREE.Vector3(
                Math.cos(angle + Math.PI) * radius,
                y,
                Math.sin(angle + Math.PI) * radius
            ));
        }

        const curveA = new THREE.CatmullRomCurve3(pointsA);
        const curveB = new THREE.CatmullRomCurve3(pointsB);

        const tubeGeoA = new THREE.TubeGeometry(curveA, 120, 0.09, 16, false);
        const tubeGeoB = new THREE.TubeGeometry(curveB, 120, 0.09, 16, false);
        geometries.push(tubeGeoA, tubeGeoB);

        // Cyan glass strand
        const matStrandA = new THREE.MeshPhysicalMaterial({
            color: 0x38bdf8,
            emissive: 0x0284c7,
            emissiveIntensity: 0.35,
            roughness: 0.1,
            metalness: 0.1,
            transmission: 0.5,
            ior: 1.45,
            clearcoat: 1.0,
            transparent: true,
            opacity: 0.95,
        });

        // Purple glass strand
        const matStrandB = new THREE.MeshPhysicalMaterial({
            color: 0xa855f7,
            emissive: 0x7e22ce,
            emissiveIntensity: 0.35,
            roughness: 0.1,
            metalness: 0.1,
            transmission: 0.5,
            ior: 1.45,
            clearcoat: 1.0,
            transparent: true,
            opacity: 0.95,
        });
        materials.push(matStrandA, matStrandB);

        const meshStrandA = new THREE.Mesh(tubeGeoA, matStrandA);
        const meshStrandB = new THREE.Mesh(tubeGeoB, matStrandB);
        dnaGroup.add(meshStrandA);
        dnaGroup.add(meshStrandB);

        // ── 2. BASE-PAIR RUNGS & NODE SPHERES ──
        const rungCount = 24;
        const unitY = new THREE.Vector3(0, 1, 0);

        const nodeGeo = new THREE.SphereGeometry(0.12, 16, 16);
        geometries.push(nodeGeo);

        for (let r = 0; r < rungCount; r++) {
            const frac = (r + 0.5) / rungCount;
            const angle = frac * turns * 2 * Math.PI;
            const y = (frac - 0.5) * totalHeight;

            const posA = new THREE.Vector3(
                Math.cos(angle) * radius,
                y,
                Math.sin(angle) * radius
            );
            const posB = new THREE.Vector3(
                Math.cos(angle + Math.PI) * radius,
                y,
                Math.sin(angle + Math.PI) * radius
            );

            // Connective rung cylinder
            const dist = posA.distanceTo(posB);
            const rungGeo = new THREE.CylinderGeometry(0.045, 0.045, dist, 12);
            geometries.push(rungGeo);

            const rungMat = new THREE.MeshPhysicalMaterial({
                color: r % 2 === 0 ? 0x67e8f9 : 0xc084fc,
                emissive: r % 2 === 0 ? 0x06b6d4 : 0x8b5cf6,
                emissiveIntensity: 0.25,
                roughness: 0.15,
                transmission: 0.6,
                clearcoat: 0.8,
                transparent: true,
                opacity: 0.88,
            });
            materials.push(rungMat);

            const rungMesh = new THREE.Mesh(rungGeo, rungMat);
            const midpoint = new THREE.Vector3().addVectors(posA, posB).multiplyScalar(0.5);
            rungMesh.position.copy(midpoint);

            const dir = new THREE.Vector3().subVectors(posB, posA).normalize();
            rungMesh.quaternion.setFromUnitVectors(unitY, dir);
            dnaGroup.add(rungMesh);

            // Glowing connection beads at strand junctions
            const beadA = new THREE.Mesh(nodeGeo, matStrandA);
            beadA.position.copy(posA);
            dnaGroup.add(beadA);

            const beadB = new THREE.Mesh(nodeGeo, matStrandB);
            beadB.position.copy(posB);
            dnaGroup.add(beadB);
        }

        // Floating accent particle near DNA (like the cyan bead in reference)
        const floatBeadGeo = new THREE.SphereGeometry(0.16, 20, 20);
        geometries.push(floatBeadGeo);
        const floatBeadMat = new THREE.MeshPhysicalMaterial({
            color: 0x38bdf8,
            emissive: 0x0284c7,
            emissiveIntensity: 0.5,
            roughness: 0.1,
            metalness: 0.2,
            clearcoat: 1.0,
        });
        materials.push(floatBeadMat);
        const floatBead = new THREE.Mesh(floatBeadGeo, floatBeadMat);
        floatBead.position.set(1.6, -0.4, 0.8);
        dnaGroup.add(floatBead);

        // Resize handler
        const handleResize = () => {
            if (!mount) return;
            const w = mount.clientWidth;
            const h = mount.clientHeight;
            if (w === 0 || h === 0) return;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h, false);
        };
        handleResize();
        const ro = new ResizeObserver(handleResize);
        ro.observe(mount);

        // Animation Loop with Visibility & Intersection guards
        let animId = null;
        let isVisible = true;
        let isPageVisible = !document.hidden;
        let lastTime = 0;

        const animate = (time) => {
            animId = requestAnimationFrame(animate);
            if (lastTime === 0) {
                lastTime = time;
                return;
            }
            const dt = Math.min((time - lastTime) / 1000, 0.1);
            lastTime = time;

            // Genuine 3D vertical axis rotation
            dnaGroup.rotation.y += 0.52 * dt;

            // Subtle gentle float oscillation for the satellite bead
            floatBead.position.y = -0.4 + Math.sin(time * 0.002) * 0.12;
            floatBead.position.x = 1.6 + Math.cos(time * 0.0018) * 0.08;

            renderer.render(scene, camera);
        };

        const startLoop = () => {
            if (isVisible && isPageVisible && !animId) {
                lastTime = 0;
                animId = requestAnimationFrame(animate);
            }
        };

        const stopLoop = () => {
            if (animId) {
                cancelAnimationFrame(animId);
                animId = null;
            }
        };

        const io = new IntersectionObserver(([entry]) => {
            isVisible = entry.isIntersecting;
            isVisible ? startLoop() : stopLoop();
        }, { threshold: 0.05 });
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
            geometries.forEach(g => g.dispose());
            materials.forEach(m => m.dispose());
            if (renderer.domElement && mount.contains(renderer.domElement)) {
                mount.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };
    }, []);

    if (webglFailed) {
        return (
            <img
                src={fallbackSrc}
                alt="DNA Helix 3D Model"
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
