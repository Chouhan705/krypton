"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function RotatingCoinCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 8.2);

    // 2. High-Exposure WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.9;
    container.appendChild(renderer.domElement);

    // 3. Crisp Procedural Texture with Upright Orientation
    const createCoinTexture = (title: string, sub: string) => {
      const canvas = document.createElement("canvas");
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext("2d")!;

      // Vibrant Radiant Gold Gradient
      const grad = ctx.createRadialGradient(512, 512, 60, 512, 512, 500);
      grad.addColorStop(0, "#FFFFE0");
      grad.addColorStop(0.25, "#fbec8f");
      grad.addColorStop(0.65, "#f0c52c");
      grad.addColorStop(1, "#c19914");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1024, 1024);

      // Outer rings
      ctx.strokeStyle = "#FFFFDF";
      ctx.lineWidth = 16;
      ctx.beginPath();
      ctx.arc(512, 512, 470, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = "#8A6900";
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(512, 512, 452, 0, Math.PI * 2);
      ctx.stroke();

      // Milled beads
      const numBeads = 80;
      for (let i = 0; i < numBeads; i++) {
        const angle = (i * 2 * Math.PI) / numBeads;
        const bx = 512 + 420 * Math.cos(angle);
        const by = 512 + 420 * Math.sin(angle);
        ctx.fillStyle = i % 2 === 0 ? "#FFFFFF" : "#7C5D00";
        ctx.beginPath();
        ctx.arc(bx, by, 7, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(512, 512, 380, 0, Math.PI * 2);
      ctx.stroke();

      // Clear horizontal typography
      ctx.fillStyle = "#362600";
      ctx.shadowColor = "#FFF6AA";
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = -2;
      ctx.shadowOffsetY = -2;

      ctx.font = "900 115px system-ui, -apple-system, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(title, 512, 480);

      ctx.font = "bold 38px monospace";
      ctx.letterSpacing = "9px";
      ctx.fillStyle = "#4D3600";
      ctx.fillText(sub, 512, 580);

      const texture = new THREE.CanvasTexture(canvas);
      // Set to Math.PI / 2 to make text completely upright
      texture.center.set(0.5, 0.5);
      texture.rotation = Math.PI / 2;
      texture.generateMipmaps = true;
      return texture;
    };

    const frontTexture = createCoinTexture("KRYPTON", "VIRTUAL • ASSET");
    const backTexture = createCoinTexture("KRYPTON", "PAPER • TRADING");

    // 4. Metallic Materials
    const frontFaceMaterial = new THREE.MeshStandardMaterial({
      map: frontTexture,
      metalness: 0.9,
      roughness: 0.12,
      emissive: 0x3d3000,
      emissiveIntensity: 0.25,
    });

    const backFaceMaterial = new THREE.MeshStandardMaterial({
      map: backTexture,
      metalness: 0.9,
      roughness: 0.12,
      emissive: 0x3d3000,
      emissiveIntensity: 0.25,
    });

    const edgeMaterial = new THREE.MeshStandardMaterial({
      color: 0xffdb3b,
      metalness: 0.96,
      roughness: 0.18,
      emissive: 0x382b00,
      emissiveIntensity: 0.2,
    });

    // 5. Coin Geometry
    const geometry = new THREE.CylinderGeometry(2.5, 2.5, 0.32, 96, 1, false);
    geometry.rotateX(Math.PI / 2);

    const coinMesh = new THREE.Mesh(geometry, [edgeMaterial, frontFaceMaterial, backFaceMaterial]);

    const coinGroup = new THREE.Group();
    coinGroup.add(coinMesh);
    scene.add(coinGroup);

    // 6. Lighting Setup
    const keyLight = new THREE.DirectionalLight(0xffffff, 4.0);
    keyLight.position.set(0, 4, 8);
    scene.add(keyLight);

    const bounceLight = new THREE.DirectionalLight(0xffdf6d, 2.8);
    bounceLight.position.set(0, -5, 4);
    scene.add(bounceLight);

    const glintLight = new THREE.PointLight(0xffffff, 6.5, 25);
    glintLight.position.set(3, 3, 6);
    scene.add(glintLight);

    const backRim = new THREE.DirectionalLight(0x758225, 2.0);
    backRim.position.set(-6, 2, -4);
    scene.add(backRim);

    // 7. Interactive Drag & Hover State Management
    let isHovered = false;
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let dragVelocity = 0;

    const handleMouseEnter = () => {
      isHovered = true;
    };

    const handleMouseLeave = () => {
      isHovered = false;
      isDragging = false;
      container.style.cursor = "grab";
    };

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
      container.style.cursor = "grabbing";
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const deltaX = e.clientX - previousMousePosition.x;
      // Rotate coin on vertical axis based on horizontal drag
      coinMesh.rotation.y += deltaX * 0.015;
      dragVelocity = deltaX * 0.015;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging = false;
      container.style.cursor = isHovered ? "grab" : "default";
    };

    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);
    container.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    // 8. Animation Loop
    let clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (!isHovered && !isDragging) {
        // Auto-spin smoothly when mouse is NOT hovering
        coinMesh.rotation.y += 0.015;
      } else if (isDragging) {
        // Drag momentum handles rotation directly
      } else {
        // When hovered (not dragging), damp any leftover velocity to a stop
        dragVelocity *= 0.92;
        coinMesh.rotation.y += dragVelocity;
      }

      // Dynamic glint sweep
      glintLight.position.x = Math.sin(elapsedTime * 2.0) * 5;
      glintLight.position.y = Math.cos(elapsedTime * 1.6) * 3 + 1;

      renderer.render(scene, camera);
    };
    animate();

    // 9. Resize Handling
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
      container.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
      renderer.dispose();
      geometry.dispose();
      frontFaceMaterial.dispose();
      backFaceMaterial.dispose();
      edgeMaterial.dispose();
      frontTexture.dispose();
      backTexture.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[460px] lg:min-h-[620px] flex items-center justify-center cursor-grab active:cursor-grabbing select-none drop-shadow-[0_0_50px_rgba(205,182,26,0.4)]"
    />
  );
}