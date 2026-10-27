import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

// 3D Atomic coordinates matching the reference molecular composition
const ATOMS_DEF = [
    // Core hub
    { id: 0, base: [0, 0.35, 0], radius: 0.52, color: '#a855f7', emissive: '#7e22ce' }, // Central large purple
    { id: 1, base: [0.85, -0.4, 0.45], radius: 0.42, color: '#06b6d4', emissive: '#0891b2' }, // Cyan node
    { id: 2, base: [-0.95, 0.05, -0.3], radius: 0.46, color: '#9333ea', emissive: '#6b21a8' }, // Left purple
    { id: 3, base: [0.15, -0.85, -0.5], radius: 0.38, color: '#38bdf8', emissive: '#0284c7' }, // Lower blue node

    // Outer branching spheres
    { id: 4, base: [0.35, 1.6, 0.25], radius: 0.45, color: '#8b5cf6', emissive: '#6d28d9' }, // Top purple
    { id: 5, base: [0.55, 2.1, 0.4], radius: 0.22, color: '#c084fc', emissive: '#9333ea' }, // Tiny top cap
    { id: 6, base: [1.8, 0.95, -0.35], radius: 0.50, color: '#0ea5e9', emissive: '#0284c7' }, // Top-right large cyan
    { id: 7, base: [-1.85, -0.9, 0.35], radius: 0.54, color: '#0284c7', emissive: '#0369a1' }, // Bottom-left large blue
    { id: 8, base: [0.1, -1.8, 0.25], radius: 0.48, color: '#7c3aed', emissive: '#5b21b6' }, // Bottom purple
    { id: 9, base: [1.65, -0.75, 0.65], radius: 0.44, color: '#c026d3', emissive: '#a21caf' }, // Right-lower magenta
    { id: 10, base: [1.3, -0.2, -0.55], radius: 0.36, color: '#38bdf8', emissive: '#0284c7' }, // Right-mid cyan
];

// Chemical bonds connecting atom pairs
const BONDS_DEF = [
    [0, 1],
    [0, 2],
    [0, 4],
    [1, 3],
    [4, 5],
    [0, 6],
    [2, 7],
    [1, 8],
    [1, 9],
    [1, 10],
    [3, 8],
];

export default function Molecule3D({ fallbackSrc = '/images/hero_3d/molecule_3d_enhanced.png' }) {
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
            console.warn('WebGL not available for Molecule3D:', e);
            setWebglFailed(true);
            return;
        }

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        renderer.setPixelRatio(dpr);
        renderer.setClearColor(0x000000, 0);
        mount.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
        camera.position.set(0, 0, 8.2);

        const moleculeGroup = new THREE.Group();
        scene.add(moleculeGroup);

        // Lighting for rich glassy specular highlights
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
        scene.add(ambientLight);

        const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
        keyLight.position.set(5, 8, 7);
        scene.add(keyLight);

        const cyanRim = new THREE.DirectionalLight(0x06b6d4, 2.2);
        cyanRim.position.set(-6, -4, 4);
        scene.add(cyanRim);

        const purpleFill = new THREE.DirectionalLight(0xa855f7, 1.8);
        purpleFill.position.set(4, -6, -3);
        scene.add(purpleFill);

        const geometries = [];
        const materials = [];

        // 1. Build Atoms
        const atomMeshes = [];
        ATOMS_DEF.forEach((def, index) => {
            const geo = new THREE.SphereGeometry(def.radius, 28, 28);
            geometries.push(geo);

            const mat = new THREE.MeshPhysicalMaterial({
                color: new THREE.Color(def.color),
                emissive: new THREE.Color(def.emissive),
                emissiveIntensity: 0.35,
                roughness: 0.08,
                metalness: 0.12,
                transmission: 0.35,
                ior: 1.45,
                clearcoat: 1.0,
                clearcoatRoughness: 0.1,
            });
            materials.push(mat);

            const mesh = new THREE.Mesh(geo, mat);
            mesh.position.set(...def.base);
            moleculeGroup.add(mesh);

            atomMeshes.push({
                mesh,
                basePos: new THREE.Vector3(...def.base),
                currentPos: new THREE.Vector3(...def.base),
                phase: index * 0.9,
                freq: 1.4 + (index % 3) * 0.4,
            });
        });

        // 2. Build Cylindrical Bonds
        const bondMeshes = [];
        const unitY = new THREE.Vector3(0, 1, 0);

        BONDS_DEF.forEach(([idxA, idxB]) => {
            // Unit cylinder: radius 0.085, height 1.0, centered at origin
            const bondGeo = new THREE.CylinderGeometry(0.085, 0.085, 1.0, 16);
            geometries.push(bondGeo);

            const bondMat = new THREE.MeshPhysicalMaterial({
                color: 0x93c5fd,
                emissive: 0x38bdf8,
                emissiveIntensity: 0.2,
                roughness: 0.15,
                metalness: 0.1,
                transmission: 0.55,
                ior: 1.4,
                clearcoat: 0.8,
                transparent: true,
                opacity: 0.9,
            });
            materials.push(bondMat);

            const bondMesh = new THREE.Mesh(bondGeo, bondMat);
            moleculeGroup.add(bondMesh);

            bondMeshes.push({
                mesh: bondMesh,
                idxA,
                idxB,
            });
        });

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
            const tSec = time * 0.001;

            // Slow, majestic 3D rotation
            moleculeGroup.rotation.y += 0.45 * dt;
            moleculeGroup.rotation.x = Math.sin(tSec * 0.45) * 0.18;
            moleculeGroup.rotation.z = Math.cos(tSec * 0.35) * 0.12;

            // Subtle thermal atom vibration while maintaining strict topology
            for (let i = 0; i < atomMeshes.length; i++) {
                const atom = atomMeshes[i];
                const vibX = Math.sin(tSec * atom.freq + atom.phase) * 0.04;
                const vibY = Math.cos(tSec * (atom.freq * 1.1) + atom.phase) * 0.04;
                const vibZ = Math.sin(tSec * (atom.freq * 0.9) + atom.phase * 1.5) * 0.035;

                atom.currentPos.set(
                    atom.basePos.x + vibX,
                    atom.basePos.y + vibY,
                    atom.basePos.z + vibZ
                );
                atom.mesh.position.copy(atom.currentPos);
            }

            // Keep all bonds strictly attached between moving atoms
            for (let b = 0; b < bondMeshes.length; b++) {
                const { mesh, idxA, idxB } = bondMeshes[b];
                const posA = atomMeshes[idxA].currentPos;
                const posB = atomMeshes[idxB].currentPos;

                // Midpoint
                mesh.position.set(
                    (posA.x + posB.x) * 0.5,
                    (posA.y + posB.y) * 0.5,
                    (posA.z + posB.z) * 0.5
                );

                // Length & scale
                const dist = posA.distanceTo(posB);
                mesh.scale.set(1, dist, 1);

                // Direction quaternion
                const dir = new THREE.Vector3().subVectors(posB, posA).normalize();
                mesh.quaternion.setFromUnitVectors(unitY, dir);
            }

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
                alt="Molecule 3D Model"
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
