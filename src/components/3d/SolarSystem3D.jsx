import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const PLANETS = [
    {
        name: 'Mercury',
        radius: 0.18,
        color: '#93c5fd',
        emissive: '#3b82f6',
        orbitRadiusX: 2.3,
        orbitRadiusZ: 1.6,
        speed: 1.3,
        startAngle: 0.5,
    },
    {
        name: 'Venus',
        radius: 0.28,
        color: '#fbbf24',
        emissive: '#d97706',
        orbitRadiusX: 3.3,
        orbitRadiusZ: 2.2,
        speed: 0.95,
        startAngle: 2.1,
    },
    {
        name: 'Earth',
        radius: 0.36,
        color: '#38bdf8',
        emissive: '#0284c7',
        orbitRadiusX: 4.5,
        orbitRadiusZ: 2.9,
        speed: 0.72,
        startAngle: 3.8,
        hasAtmosphere: true,
        hasMoon: true,
    },
    {
        name: 'Mars',
        radius: 0.24,
        color: '#f97316',
        emissive: '#c2410c',
        orbitRadiusX: 5.7,
        orbitRadiusZ: 3.6,
        speed: 0.54,
        startAngle: 5.0,
    },
    {
        name: 'Jupiter',
        radius: 0.62,
        color: '#a855f7',
        emissive: '#7e22ce',
        orbitRadiusX: 7.1,
        orbitRadiusZ: 4.4,
        speed: 0.36,
        startAngle: 1.2,
    },
    {
        name: 'Saturn',
        radius: 0.52,
        color: '#fde047',
        emissive: '#ca8a04',
        orbitRadiusX: 8.6,
        orbitRadiusZ: 5.3,
        speed: 0.26,
        startAngle: 2.8,
        hasRings: true,
    },
    {
        name: 'Uranus',
        radius: 0.35,
        color: '#22d3ee',
        emissive: '#0891b2',
        orbitRadiusX: 10.0,
        orbitRadiusZ: 6.1,
        speed: 0.18,
        startAngle: 4.4,
    },
    {
        name: 'Neptune',
        radius: 0.34,
        color: '#818cf8',
        emissive: '#4f46e5',
        orbitRadiusX: 11.4,
        orbitRadiusZ: 6.9,
        speed: 0.13,
        startAngle: 0.8,
    },
];

export default function SolarSystem3D({ fallbackSrc = '/images/hero_3d/solar_3d_enhanced.png' }) {
    const mountRef = useRef(null);
    const [webglFailed, setWebglFailed] = useState(false);

    useEffect(() => {
        // Respect prefers-reduced-motion
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
            console.warn('WebGL not available for SolarSystem3D:', e);
            setWebglFailed(true);
            return;
        }

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        renderer.setPixelRatio(dpr);
        renderer.setClearColor(0x000000, 0);
        mount.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
        camera.position.set(0, 14, 18);
        camera.lookAt(0, 0, 0);

        // Main tilt group to align orbits with the landing hero perspective
        const systemGroup = new THREE.Group();
        systemGroup.rotation.x = 0.52;
        systemGroup.rotation.z = -0.18;
        systemGroup.position.set(-1.2, 0, 0); // Position sun slightly offset like reference
        scene.add(systemGroup);

        // Ambient and accent lighting matching Vyoma palette
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
        scene.add(ambientLight);

        const sunLight = new THREE.PointLight(0xfffbeb, 4.0, 35, 1.2);
        sunLight.position.set(0, 0, 0);
        systemGroup.add(sunLight);

        const cyanRim = new THREE.DirectionalLight(0x06b6d4, 1.8);
        cyanRim.position.set(10, 8, 12);
        scene.add(cyanRim);

        const purpleFill = new THREE.DirectionalLight(0x8b5cf6, 1.2);
        purpleFill.position.set(-8, -4, 5);
        scene.add(purpleFill);

        // Disposables tracking
        const geometries = [];
        const materials = [];

        // ── 1. THE SUN ──
        const sunGeo = new THREE.SphereGeometry(1.05, 32, 32);
        geometries.push(sunGeo);
        const sunMat = new THREE.MeshStandardMaterial({
            color: 0xffedd5,
            emissive: 0xf59e0b,
            emissiveIntensity: 1.6,
            roughness: 0.2,
            metalness: 0.1,
        });
        materials.push(sunMat);
        const sunMesh = new THREE.Mesh(sunGeo, sunMat);
        systemGroup.add(sunMesh);

        // Sun glowing corona shell
        const coronaGeo = new THREE.SphereGeometry(1.22, 24, 24);
        geometries.push(coronaGeo);
        const coronaMat = new THREE.MeshBasicMaterial({
            color: 0xfbbf24,
            transparent: true,
            opacity: 0.35,
            blending: THREE.AdditiveBlending,
        });
        materials.push(coronaMat);
        const coronaMesh = new THREE.Mesh(coronaGeo, coronaMat);
        systemGroup.add(coronaMesh);

        // Outer cyan-purple ambient aura
        const auraGeo = new THREE.SphereGeometry(1.42, 24, 24);
        geometries.push(auraGeo);
        const auraMat = new THREE.MeshBasicMaterial({
            color: 0x818cf8,
            transparent: true,
            opacity: 0.2,
            blending: THREE.AdditiveBlending,
        });
        materials.push(auraMat);
        const auraMesh = new THREE.Mesh(auraGeo, auraMat);
        systemGroup.add(auraMesh);

        // ── 2. ORBITS & PLANETS ──
        const planetObjects = [];

        PLANETS.forEach((p, idx) => {
            // Draw smooth elliptical orbit line
            const curve = new THREE.EllipseCurve(
                0, 0,
                p.orbitRadiusX, p.orbitRadiusZ,
                0, 2 * Math.PI,
                false, 0
            );
            const points = curve.getPoints(120);
            const orbitPoints3D = points.map(pt => new THREE.Vector3(pt.x, 0, pt.y));
            const orbitGeo = new THREE.BufferGeometry().setFromPoints(orbitPoints3D);
            geometries.push(orbitGeo);

            const orbitMat = new THREE.LineBasicMaterial({
                color: idx % 2 === 0 ? 0x22d3ee : 0xa855f7,
                transparent: true,
                opacity: 0.28,
            });
            materials.push(orbitMat);
            const orbitLine = new THREE.LineLoop(orbitGeo, orbitMat);
            systemGroup.add(orbitLine);

            // Planet Body
            const pGeo = new THREE.SphereGeometry(p.radius, 24, 24);
            geometries.push(pGeo);
            const pMat = new THREE.MeshPhysicalMaterial({
                color: new THREE.Color(p.color),
                emissive: new THREE.Color(p.emissive),
                emissiveIntensity: 0.3,
                roughness: 0.35,
                metalness: 0.15,
                clearcoat: 0.6,
                clearcoatRoughness: 0.2,
            });
            materials.push(pMat);

            const pMesh = new THREE.Mesh(pGeo, pMat);
            systemGroup.add(pMesh);

            const pData = {
                mesh: pMesh,
                orbitRadiusX: p.orbitRadiusX,
                orbitRadiusZ: p.orbitRadiusZ,
                speed: p.speed,
                angle: p.startAngle,
                saturnRings: null,
                moonMesh: null,
                moonAngle: 0,
            };

            // Saturn Rings
            if (p.hasRings) {
                const ringGeo = new THREE.RingGeometry(p.radius * 1.5, p.radius * 2.5, 32);
                geometries.push(ringGeo);
                const ringMat = new THREE.MeshStandardMaterial({
                    color: 0xfef08a,
                    emissive: 0xca8a04,
                    emissiveIntensity: 0.2,
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: 0.85,
                    roughness: 0.4,
                });
                materials.push(ringMat);
                const ringMesh = new THREE.Mesh(ringGeo, ringMat);
                ringMesh.rotation.x = Math.PI / 2.8;
                ringMesh.rotation.y = 0.2;
                pMesh.add(ringMesh);
                pData.saturnRings = ringMesh;
            }

            // Earth Moon
            if (p.hasMoon) {
                const moonGeo = new THREE.SphereGeometry(0.09, 16, 16);
                geometries.push(moonGeo);
                const moonMat = new THREE.MeshStandardMaterial({
                    color: 0xe2e8f0,
                    roughness: 0.6,
                });
                materials.push(moonMat);
                const moonMesh = new THREE.Mesh(moonGeo, moonMat);
                systemGroup.add(moonMesh);
                pData.moonMesh = moonMesh;
            }

            planetObjects.push(pData);
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

            // Rotate Sun
            sunMesh.rotation.y += 0.4 * dt;
            const pulse = 1 + Math.sin(time * 0.002) * 0.03;
            coronaMesh.scale.set(pulse, pulse, pulse);

            // Orbit Planets
            for (let i = 0; i < planetObjects.length; i++) {
                const p = planetObjects[i];
                p.angle += p.speed * 0.35 * dt;
                const px = Math.cos(p.angle) * p.orbitRadiusX;
                const pz = Math.sin(p.angle) * p.orbitRadiusZ;
                p.mesh.position.set(px, 0, pz);
                p.mesh.rotation.y += 1.5 * dt;

                if (p.moonMesh) {
                    p.moonAngle += 2.2 * dt;
                    p.moonMesh.position.set(
                        px + Math.cos(p.moonAngle) * 0.75,
                        Math.sin(p.moonAngle * 0.5) * 0.15,
                        pz + Math.sin(p.moonAngle) * 0.55
                    );
                }
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
                overflow: 'visible',
            }}
        />
    );
}
