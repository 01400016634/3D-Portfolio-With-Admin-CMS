import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import * as THREE from 'three';
import {
    Globe, Mail, ExternalLink, ChevronLeft, ChevronRight, Code2, Monitor, Cpu, Database, Zap, Smartphone, Briefcase, TrendingUp, Link as LinkIcon, Palette, Users, Download
} from 'lucide-react';

// --- FALLBACK DATA ---
const FALLBACK_DATA = {
    profile: {
        name: "Reajul Hasan",
        role: "Front-End Web Developer & Data Specialist",
        tagline: "Transforming digital experiences through robust web development, data-driven insights, and strategic marketing.",
        about: "As a professional in the field of computer science and technology, I bring a combination of technical skills and creative problem-solving to every project. My goal is to join a company that will allow me to leverage my abilities while providing opportunities for professional growth.",
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
        cvUrl: ""
    },
    skills: [
        { name: "Web Development", description: "React, Node.js, JS, & Responsive Design.", level: 95 },
        { name: "Web Development", icon: <Monitor className="w-6 h-6" />, description: "React, Node.js, Vue.js, Angular, HTML/CSS, JS, WordPress & Responsive Design." },
        { name: "KOBO Toolbox & Data", icon: <Database className="w-6 h-6" />, description: "Expertise in Data Survey, Data entry, Data analysis, and Database Management." },
        { name: "Python & JavaScript", icon: <Code2 className="w-6 h-6" />, description: "Scripting, Automation, Data Processing, DOM Manipulation & Interactive Web Apps." }
    ],
    projects: [
        {
            id: "project-1",
            title: "E-Commerce Platform",
            shortDesc: "Complete online shopping solution with robust product management.",
            tech: ["React", "Node.js", "TensorFlow.js", "MongoDB", "Stripe API"],
            image: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)",
            overview: "A comprehensive online shopping solution encompassing advanced product management, an intuitive cart system, and secure checkout processing.",
            problem: "Building a scalable architecture that could handle complex inventory updates in real-time.",
            solutions: "Integrated TensorFlow.js for dynamic, client-side recommendations and built a resilient Node.js/MongoDB backend.",
            screenshots: [],
            liveUrl: "#"
        }
    ],
    timeline: [
        {
            year: "2024 - Present",
            category: "Experience",
            title: "Digital Marketing Officer & Video Editor",
            organization: "Digital MEL Hub",
            desc: "Creating digital marketing content, managing social media presence, and editing promotional videos.",
            icon: <TrendingUp className="w-5 h-5" />,
            color: "from-blue-400 to-cyan-300"
        }
    ],
    socials: {
        email: "mailto:reaj.hasan786@gmail.com",
        whatsapp: "https://wa.me/8801400016634",
        fiverr: "https://fiverr.com/reajulhasan",
        linkedin: "https://linkedin.com/in/",
    }
};

// --- 3D SCENE COMPONENT ---
const AdvancedGalaxyBackground = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2('#020617', 0.045);
        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
        camera.position.z = 12;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor('#020617', 1);
        containerRef.current.innerHTML = '';
        containerRef.current.appendChild(renderer.domElement);

        const particleCount = 5000;
        const posArray = new Float32Array(particleCount * 3);
        const originalPosArray = new Float32Array(particleCount * 3);
        const colArray = new Float32Array(particleCount * 3);
        const color1 = new THREE.Color('#7dd3fc');
        const color2 = new THREE.Color('#d8b4fe');

        for (let i = 0; i < particleCount; i++) {
            const radius = Math.random() * 25;
            const spinAngle = radius * 0.3;
            const branchAngle = ((i % 3) * Math.PI * 2) / 3;
            const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 3;
            const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 3;
            const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 3;

            posArray[i * 3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
            posArray[i * 3 + 1] = randomY * (25 - radius) * 0.05;
            posArray[i * 3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

            originalPosArray[i * 3] = posArray[i * 3];
            originalPosArray[i * 3 + 1] = posArray[i * 3 + 1];
            originalPosArray[i * 3 + 2] = posArray[i * 3 + 2];

            const mixedColor = color1.clone().lerp(color2, Math.random());
            colArray[i * 3] = mixedColor.r; colArray[i * 3 + 1] = mixedColor.g; colArray[i * 3 + 2] = mixedColor.b;
        }

        const particlesGeometry = new THREE.BufferGeometry();
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colArray, 3));

        const circleCanvas = document.createElement('canvas');
        circleCanvas.width = 64; circleCanvas.height = 64;
        const ctx = circleCanvas.getContext('2d');
        const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, 'rgba(255,255,255,1)');
        gradient.addColorStop(0.1, 'rgba(255,255,255,0.8)');
        gradient.addColorStop(0.4, 'rgba(255,255,255,0.2)');
        gradient.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = gradient; ctx.fillRect(0, 0, 64, 64);
        const particleTexture = new THREE.CanvasTexture(circleCanvas);

        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.25, vertexColors: true, transparent: true, opacity: 0.9, map: particleTexture, depthWrite: false, blending: THREE.AdditiveBlending
        });

        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);

        const nodeCount = 60;
        const nodes = []; const velocities = [];
        for (let i = 0; i < nodeCount; i++) {
            nodes.push(new THREE.Vector3((Math.random() - 0.5) * 20, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 20));
            velocities.push(new THREE.Vector3((Math.random() - 0.5) * 0.02, (Math.random() - 0.5) * 0.02, (Math.random() - 0.5) * 0.02));
        }

        const linesGeometry = new THREE.BufferGeometry();
        const linesMaterial = new THREE.LineBasicMaterial({ color: 0x60a5fa, transparent: true, opacity: 0.25, blending: THREE.AdditiveBlending });
        const linesMesh = new THREE.LineSegments(linesGeometry, linesMaterial);

        const nodesGeometry = new THREE.BufferGeometry();
        const nodesMaterial = new THREE.PointsMaterial({ color: 0xc084fc, size: 0.3, map: particleTexture, transparent: true, opacity: 0.9, depthWrite: false, blending: THREE.AdditiveBlending });
        const nodesMesh = new THREE.Points(nodesGeometry, nodesMaterial);

        scene.add(linesMesh);
        scene.add(nodesMesh);

        const createTextSprite = (text, color, fontSize = '40px') => {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = 512; canvas.height = 256;
            context.font = `Bold ${fontSize} Arial`;
            context.fillStyle = color;
            context.textAlign = 'center'; context.textBaseline = 'middle';
            context.fillText(text, 256, 128);
            return new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(canvas), transparent: true }));
        };

        const floaters = [
            { mesh: createTextSprite('< Web Dev />', '#38bdf8', '50px'), pos: new THREE.Vector3(5, 2, -3), speed: 1.5 },
            { mesh: createTextSprite('Data', '#a78bfa', '50px'), pos: new THREE.Vector3(-6, -1, -5), speed: 2 },
            { mesh: createTextSprite('{ KOBO }', '#2dd4bf', '60px'), pos: new THREE.Vector3(4, -4, -6), speed: 1 },
        ];

        floaters.forEach(f => {
            f.mesh.position.copy(f.pos);
            f.mesh.scale.set(4, 2, 1);
            scene.add(f.mesh);
        });

        let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0, isMouseIn = false;
        const mouseVec = new THREE.Vector2(9999, 9999);
        const raycaster = new THREE.Raycaster();
        const mousePos3D = new THREE.Vector3();
        const localMousePos = new THREE.Vector3();

        const handleMouseMove = (event) => {
            mouseX = (event.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
            mouseY = (event.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
            mouseVec.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouseVec.y = -(event.clientY / window.innerHeight) * 2 + 1;
            isMouseIn = true;
        };

        window.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseleave', () => isMouseIn = false);

        const clock = new THREE.Clock();
        let animationFrameId;

        const animate = () => {
            const time = clock.getElapsedTime();
            particlesMesh.rotation.y += 0.001;
            particlesMesh.rotation.x = Math.sin(time * 0.1) * 0.1;

            if (isMouseIn) {
                raycaster.setFromCamera(mouseVec, camera);
                const distanceToZZero = -camera.position.z / raycaster.ray.direction.z;
                mousePos3D.copy(camera.position).add(raycaster.ray.direction.multiplyScalar(distanceToZZero));
                localMousePos.copy(mousePos3D);
                particlesMesh.worldToLocal(localMousePos);
            }

            const positions = particlesGeometry.attributes.position.array;
            const interactRadiusSq = 30;

            for (let i = 0; i < particleCount; i++) {
                const ix = i * 3, iy = i * 3 + 1, iz = i * 3 + 2;
                const origX = originalPosArray[ix], origY = originalPosArray[iy], origZ = originalPosArray[iz];

                if (isMouseIn) {
                    const dx = positions[ix] - localMousePos.x;
                    const dy = positions[iy] - localMousePos.y;
                    const dz = positions[iz] - localMousePos.z;
                    const distSq = dx * dx + dy * dy + dz * dz;

                    if (distSq < interactRadiusSq) {
                        const dist = Math.sqrt(distSq);
                        const force = (interactRadiusSq - distSq) / interactRadiusSq;
                        positions[ix] += (dx / dist) * force * 0.2;
                        positions[iy] += (dy / dist) * force * 0.2;
                        positions[iz] += (dz / dist) * force * 0.2;
                    }
                }

                positions[ix] += (origX - positions[ix]) * 0.04;
                positions[iy] += (origY - positions[iy]) * 0.04;
                positions[iz] += (origZ - positions[iz]) * 0.04;
            }
            particlesGeometry.attributes.position.needsUpdate = true;

            const linePositions = [];
            const ptPositions = [];

            for (let i = 0; i < nodeCount; i++) {
                velocities[i].x += (Math.random() - 0.5) * 0.002;
                velocities[i].y += (Math.random() - 0.5) * 0.002;
                velocities[i].z += (Math.random() - 0.5) * 0.002;

                if (isMouseIn) {
                    const ndx = nodes[i].x - mousePos3D.x;
                    const ndy = nodes[i].y - mousePos3D.y;
                    const ndz = nodes[i].z - mousePos3D.z;
                    const ndistSq = ndx * ndx + ndy * ndy + ndz * ndz;
                    if (ndistSq < 15) {
                        const ndist = Math.sqrt(ndistSq);
                        velocities[i].x += (ndx / ndist) * 0.005;
                        velocities[i].y += (ndy / ndist) * 0.005;
                        velocities[i].z += (ndz / ndist) * 0.005;
                    }
                }

                velocities[i].multiplyScalar(0.98);
                nodes[i].add(velocities[i]);

                if (Math.abs(nodes[i].x) > 10) velocities[i].x *= -1;
                if (Math.abs(nodes[i].y) > 5) velocities[i].y *= -1;
                if (Math.abs(nodes[i].z) > 10) velocities[i].z *= -1;

                ptPositions.push(nodes[i].x, nodes[i].y, nodes[i].z);

                for (let j = i + 1; j < nodeCount; j++) {
                    if (nodes[i].distanceTo(nodes[j]) < 4) {
                        linePositions.push(nodes[i].x, nodes[i].y, nodes[i].z, nodes[j].x, nodes[j].y, nodes[j].z);
                    }
                }
            }

            linesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
            nodesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(ptPositions, 3));

            floaters.forEach((f, idx) => {
                f.mesh.position.y = f.pos.y + Math.sin(time * f.speed + idx) * 0.6;
                f.mesh.position.x = f.pos.x + Math.cos(time * f.speed * 0.8 + idx) * 0.4;
                f.mesh.material.rotation = Math.sin(time * f.speed * 0.5 + idx) * 0.1;
                const scaleBase = 4;
                const scalePulse = Math.sin(time * f.speed * 1.2 + idx) * 0.2;
                f.mesh.scale.set(scaleBase + scalePulse, (scaleBase + scalePulse) * 0.5, 1);
            });

            targetX = mouseX * 2; targetY = -mouseY * 2;
            camera.position.x += (targetX - camera.position.x) * 0.05;
            camera.position.y += (targetY - camera.position.y) * 0.05;
            camera.lookAt(scene.position);

            renderer.render(scene, camera);
            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseleave', () => isMouseIn = false);
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
            if (containerRef.current) containerRef.current.innerHTML = '';
        };
    }, []);

    return (
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
            <div ref={containerRef} className="absolute top-0 left-0 w-full h-full bg-[#020617]" />
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{
                background: 'radial-gradient(circle at center, transparent 30%, #020617 120%)'
            }}></div>
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none mix-blend-overlay opacity-[0.15]" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'repeat'
            }}></div>
        </div>
    );
};

// --- NAVIGATION ---
const Navigation = ({ scrollToSection }) => (
    <motion.nav
        initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4 md:p-6"
    >
        <div className="flex flex-wrap justify-center gap-4 md:space-x-6 px-6 md:px-8 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.1)]">
            {['Hero', 'About', 'Skills', 'Projects', 'Contact'].map((item) => (
                <button key={item} onClick={() => scrollToSection(item.toLowerCase())} className="text-xs md:text-sm font-medium text-slate-300 hover:text-blue-400 transition-colors tracking-wide">
                    {item}
                </button>
            ))}
        </div>
    </motion.nav>
);

// --- TIMELINE COMPONENT ---
const InteractiveTimeline = ({ timeline }) => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start center", "end center"] });
    const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

    return (
        <div ref={containerRef} className="relative max-w-5xl mx-auto py-10">
            <div className="absolute left-[28px] md:left-1/2 top-0 bottom-0 w-1 bg-white/5 md:-translate-x-1/2 rounded-full"></div>
            <motion.div style={{ height: lineHeight }} className="absolute left-[28px] md:left-1/2 top-0 w-1 bg-gradient-to-b from-blue-500 to-cyan-400 md:-translate-x-1/2 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.8)] origin-top"></motion.div>

            <div className="space-y-20">
                {timeline.map((item, index) => {
                    const isEven = index % 2 === 0;
                    return (
                        <motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ margin: "-20% 0px" }} className={`relative flex flex-col md:flex-row items-center gap-8 md:gap-16 ${isEven ? 'md:flex-row-reverse' : ''}`}>
                            <motion.div className="absolute left-0 md:left-1/2 w-14 h-14 rounded-full border-4 flex items-center justify-center z-10 md:-translate-x-1/2 transition-colors duration-300 bg-[#020617] border-blue-500 text-blue-400">
                                {item.icon || <Briefcase className="w-6 h-6" />}
                            </motion.div>
                            <motion.div className={`w-full md:w-1/2 pl-20 md:pl-0 ${isEven ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'}`}>
                                <div className="p-6 md:p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md hover:border-blue-500/30 transition-colors group relative overflow-hidden">
                                    <div className={`inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-wider ${isEven ? 'md:flex-row-reverse' : ''}`}>
                                        <span className="text-slate-300">{item.category}</span>
                                    </div>
                                    <h3 className="text-xl md:text-2xl font-bold text-white mb-1">{item.title}</h3>
                                    <div className={`text-blue-400 font-mono text-xs md:text-sm mb-4 flex items-center gap-2 ${isEven ? 'md:justify-end' : ''}`}>
                                        <span>{item.organization}</span><span className="text-slate-600">•</span><span>{item.year}</span>
                                    </div>
                                    <p className="text-slate-400 leading-relaxed font-light text-base md:text-lg">{item.desc}</p>
                                </div>
                            </motion.div>
                            <div className="hidden md:block md:w-1/2"></div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

// --- PROJECTS COMPONENT (GALAXIFY AI STYLE + STICKY SCROLL) ---
const ProjectsSection = ({ projects, setView }) => {
    const targetRef = useRef(null);

    // Track vertical scroll to convert to horizontal movement
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end end"]
    });

    // Map the scroll progress to the X-axis
    const x = useTransform(scrollYProgress, [0, 1], ["0%", `-${(projects.length - 1) * 100}vw`]);

    return (
        // THE WRAPPER: Creates the vertical scroll height
        <section ref={targetRef} id="projects" className="relative" style={{ height: `${projects.length * 100}vh` }}>

            {/* THE STICKY CONTAINER: Locks to the screen while you scroll */}
            <div className="sticky top-0 h-screen w-full flex flex-col overflow-hidden bg-transparent">

                {/* Fixed "Selected Works" Header */}
                <div className="absolute top-24 md:top-32 left-6 md:left-12 z-20 pointer-events-none">
                    <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-2 tracking-tight">
                        Selected <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Works</span>
                    </h2>
                    <div className="w-24 md:w-32 h-1.5 mt-2 md:mt-4 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"></div>
                </div>

                {/* THE SLIDING TRACK */}
                <motion.div style={{ x, width: `${projects.length * 100}vw` }} className="flex flex-1 relative z-10 items-center h-full will-change-transform">
                    {projects.map((project, index) => {
                        const bgImage = project.screenshots && project.screenshots.length > 0
                            ? `url(${project.screenshots[0]})`
                            : project.image || 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)';

                        const safeUrl = project.liveUrl?.startsWith('http') ? project.liveUrl : `https://${project.liveUrl || 'example.com'}`;

                        return (
                            <div key={index} className="w-screen h-full flex items-center justify-center pt-32 pb-12 px-4 md:px-12 shrink-0">

                                {/* GALAXIFY AI STYLE CARD */}
                                <div className="w-full max-w-6xl flex flex-col lg:flex-row bg-[#080d1a]/90 backdrop-blur-2xl border border-white/10 rounded-[2rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">

                                    {/* 🔴 IMAGE HALF (Inside the card) */}
                                    <div className="w-full lg:w-1/2 h-64 sm:h-80 lg:h-auto relative border-b lg:border-b-0 lg:border-r border-white/10 overflow-hidden group">
                                        <div
                                            className="absolute inset-0 transition-transform duration-[2000ms] ease-out group-hover:scale-110"
                                            style={{ background: bgImage, backgroundSize: 'cover', backgroundPosition: 'center' }}
                                        ></div>
                                        {/* Subtle overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#080d1a] to-transparent opacity-60 lg:opacity-30"></div>
                                    </div>

                                    {/* 🔴 CONTENT HALF */}
                                    <div className="w-full lg:w-1/2 p-8 md:p-12 flex flex-col justify-center relative">

                                        <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-3 tracking-tighter uppercase">
                                            {project.title}
                                        </h3>

                                        <p className="text-lg md:text-xl text-slate-300 mb-8 font-light">
                                            {project.shortDesc || project.overview}
                                        </p>

                                        {/* Tech Stack Pills */}
                                        <div className="flex flex-wrap gap-3 mb-10">
                                            {(Array.isArray(project.tech) ? project.tech : project.tech?.split(',') || []).map((t, i) => (
                                                <span key={i} className="text-xs md:text-sm font-semibold px-5 py-2 rounded-full bg-white/5 border border-white/10 text-slate-200 tracking-wide hover:bg-white/10 transition-colors">
                                                    {t.trim()}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex flex-wrap items-center gap-4">
                                            <button
                                                onClick={() => setView({ type: 'case-study', id: index })}
                                                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] active:scale-95 text-sm md:text-base w-full sm:w-auto justify-center"
                                            >
                                                View Case Study <ChevronRight className="w-5 h-5" />
                                            </button>

                                            {/* 🔴 RESTORED LIVE DEMO BUTTON */}
                                            <a
                                                href={safeUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-transparent border border-white/20 hover:bg-white/10 text-white font-bold transition-all active:scale-95 text-sm md:text-base w-full sm:w-auto justify-center"
                                            >
                                                Live Demo <ExternalLink className="w-5 h-5" />
                                            </a>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
};
// --- HOME VIEW (RESPONSIVE TYPOGRAPHY) --- 
const HomeView = ({ data, setView }) => {
    const scrollToSection = (id) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="relative z-10 w-full overflow-clip">            <Navigation scrollToSection={scrollToSection} />

            <section id="hero" className="min-h-[100svh] flex flex-col items-center justify-center text-center px-4 sm:px-8 pt-20">
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} className="max-w-5xl flex flex-col items-center w-full">
                    <motion.div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 mb-8 rounded-full p-1 bg-gradient-to-tr from-cyan-400 to-purple-500 shadow-[0_0_40px_rgba(59,130,246,0.3)] group">
                        <div className="w-full h-full rounded-full overflow-hidden border-4 border-slate-950 bg-slate-900 relative">
                            <img src={data.profile.imageUrl} alt="Reajul Hasan Profile" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                    </motion.div>

                    <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white mb-6 tracking-tighter drop-shadow-2xl leading-[1.1] w-full break-words">
                        Hi, I'm <br className="sm:hidden" /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">{data.profile.name}</span>
                    </h1>

                    <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-slate-300 mb-10 md:mb-12 max-w-3xl mx-auto font-light leading-relaxed md:leading-normal">
                        {data.profile.tagline}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-4">
                        <button onClick={() => scrollToSection('projects')} className="w-full sm:w-auto px-8 py-4 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-xl text-sm md:text-base">View Projects</button>
                        <button onClick={() => scrollToSection('contact')} className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold backdrop-blur-md transition-all text-sm md:text-base">Get in Touch</button>
                    </div>
                </motion.div>
            </section>

            <section id="about" className="py-20 md:py-32 px-4 md:px-12 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16 mb-24 md:mb-40">
                    <div className="lg:col-span-8 bg-white/[0.03] border border-white/10 rounded-[2rem] md:rounded-[3rem] p-8 md:p-16 backdrop-blur-xl">
                        <h3 className="text-3xl md:text-5xl font-black text-white mb-6 md:mb-10 tracking-tight">Biography</h3>
                        <p className="text-base md:text-xl lg:text-2xl text-slate-300 leading-relaxed md:leading-loose font-light opacity-90">
                            {data.profile.about}
                        </p>

                        {/* 🔴 CV DOWNLOAD BUTTON ADDED HERE */}
                        {data.profile.cvUrl && (
                            <div className="mt-8 md:mt-12">
                                <a href={data.profile.cvUrl} download="Reajul_Hasan_CV" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-xl text-sm md:text-base w-full sm:w-auto justify-center">
                                    <Download className="w-5 h-5" /> Download My CV
                                </a>
                            </div>
                        )}
                    </div>
                </div>
                <div className="text-center mb-12 md:mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">My <span className="text-blue-400">Evolution</span></h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 mx-auto rounded-full"></div>
                </div>
                <InteractiveTimeline timeline={data.timeline} />
            </section>

            <section id="skills" className="py-20 md:py-32 px-4 md:px-12 max-w-7xl mx-auto">
                <div className="text-center mb-12 md:mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">Core <span className="text-blue-400">Competencies</span></h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 mx-auto rounded-full"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {data.skills.map((skill, index) => (
                        <motion.div key={index} className="p-6 md:p-8 rounded-2xl md:rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-md flex flex-col items-center justify-center text-center gap-4 hover:border-blue-500/50 transition-all duration-300">
                            <span className="text-slate-200 font-bold text-lg md:text-xl">{skill.name}</span>
                            <span className="text-slate-400 text-sm md:text-base font-light leading-relaxed">{skill.description}</span>
                        </motion.div>
                    ))}
                </div>
            </section>

            <ProjectsSection projects={data.projects} setView={setView} />

            <section id="contact" className="py-20 md:py-32 px-4 md:px-12 max-w-4xl mx-auto mb-20">
                <motion.div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-xl rounded-[2rem] md:rounded-[3rem] p-8 md:p-16 text-center relative overflow-hidden">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 relative z-10 tracking-tight">Let's Build Something <span className="text-blue-400">Amazing</span></h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
                        {[
                            { icon: <Mail />, label: "Email", href: `mailto:${data.socials.email}` },
                            { icon: <Users />, label: "LinkedIn", href: data.socials.linkedin },
                            { icon: <LinkIcon />, label: "Fiverr", href: data.socials.fiverr },
                            { icon: <Smartphone />, label: "WhatsApp", href: data.socials.whatsapp },
                        ].map((social, i) => (
                            <a key={i} href={social.href?.startsWith('http') || social.href?.startsWith('mailto') ? social.href : `https://${social.href}`} target="_blank" rel="noreferrer" className="flex flex-col items-center justify-center p-4 md:p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300 group">
                                <div className="text-slate-300 group-hover:text-blue-400 mb-2 md:mb-3">{social.icon}</div>
                                <span className="text-xs md:text-sm font-medium text-slate-300">{social.label}</span>
                            </a>
                        ))}
                    </div>
                </motion.div>
            </section>
        </div>
    );
};

// --- CASE STUDY VIEW --- 
const CaseStudyView = ({ projectId, setView, data }) => {
    // 🔴 CASE STUDY FIX: Now strictly pulls using the index matched from the button
    const project = data.projects[projectId] || data.projects[0];

    useEffect(() => { window.scrollTo(0, 0); }, []);
    if (!project) return null;

    // 🔴 PROJECT IMAGE FIX: Prioritizes uploaded admin screenshots for the hero!
    const bgImage = project.screenshots && project.screenshots.length > 0
        ? `url(${project.screenshots[0]})`
        : project.image || 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)';

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative z-20 w-full min-h-screen bg-[#020617] text-slate-200">
            <nav className="absolute top-0 left-0 w-full p-4 md:p-12 z-30 flex justify-between items-center">
                <button onClick={() => setView({ type: 'home' })} className="flex items-center gap-2 md:gap-3 text-slate-400 hover:text-white transition-colors group">
                    <div className="p-2 md:p-3 rounded-full bg-white/5 backdrop-blur-md border border-white/10"><ChevronLeft className="w-4 h-4 md:w-5 md:h-5" /></div>
                    <span className="font-semibold uppercase text-xs md:text-sm">Back</span>
                </button>
            </nav>

            <motion.div className="w-full h-[60vh] md:h-[70vh] relative flex items-end pb-12 md:pb-24 px-6 md:px-12">
                {/* 🔴 Uses actual uploaded image */}
                <div className="absolute inset-0 z-0" style={{ background: bgImage, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#020617] via-[#020617]/50 to-transparent"></div>
                <div className="relative z-20 max-w-6xl mx-auto w-full">
                    <h1 className="text-4xl sm:text-5xl md:text-8xl font-black text-white mb-4 md:mb-6 tracking-tighter">{project.title}</h1>
                    <p className="text-lg sm:text-xl md:text-3xl text-slate-300 font-light max-w-3xl leading-relaxed">{project.shortDesc}</p>
                </div>
            </motion.div>

            <main className="max-w-6xl mx-auto px-6 md:px-12 py-16 md:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16">
                    <div className="lg:col-span-8 space-y-16 md:space-y-24">
                        <section>
                            <h2 className="text-2xl md:text-4xl font-bold text-white mb-6">Overview</h2>
                            <p className="text-lg md:text-xl leading-relaxed text-slate-300 font-light">{project.overview}</p>
                        </section>

                        {/* Render all other screenshots if they uploaded more than one */}
                        {project.screenshots && project.screenshots.length > 1 && (
                            <section>
                                <h2 className="text-2xl md:text-4xl font-bold text-white mb-6">Project Gallery</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {project.screenshots.slice(1).map((src, i) => (
                                        <img key={i} src={src} alt={`${project.title} Screenshot ${i + 2}`} className="w-full rounded-2xl border border-white/10 shadow-2xl" />
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </main>
        </motion.div>
    );
};

// --- MAIN EXPORT COMPONENT --- 
export default function Portfolio() {
    const [view, setView] = useState({ type: 'home', id: null });
    const [portfolioData, setPortfolioData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // 🔴 CACHE TRAP FIX: Forced URL timestamp stops browser from hiding new data
        fetch(`https://my3dportfolio-de1v.onrender.com/api/portfolio?t=${new Date().getTime()}`, { cache: 'no-store' })
            .then(res => res.json())
            .then(dbData => {
                if (dbData && dbData.profile) {
                    setPortfolioData(dbData);
                }
            })
            .catch(err => console.error("Database error:", err))
            .finally(() => setIsLoading(false));
    }, []);

    const data = portfolioData || FALLBACK_DATA;

    if (isLoading) {
        return <div className="min-h-screen bg-[#020617] flex items-center justify-center text-blue-500 font-bold tracking-widest animate-pulse text-sm md:text-base">Initializing Data...</div>;
    }

    return (
        // 🔴 FIX: Must use 'overflow-clip' instead of 'overflow-x-hidden'
        <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-blue-500/30 selection:text-blue-200 w-full overflow-clip">
            <AdvancedGalaxyBackground />

            <AnimatePresence mode="wait">
                {view.type === 'home' ? (
                    <motion.div key="home-view" exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.4 }}>
                        <HomeView data={data} setView={setView} />
                    </motion.div>
                ) : (
                    <motion.div key="case-study-view" exit={{ opacity: 0, y: 50 }} transition={{ duration: 0.4 }}>
                        <CaseStudyView projectId={view.id} data={data} setView={setView} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}