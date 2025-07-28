import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeBackground = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    stars: THREE.Points;
    gridPlane: THREE.Mesh;
    mazeGroup: THREE.Group;
    cursorDot: THREE.Mesh;
    cursorLight: THREE.PointLight;
    cursorTrail: THREE.Line;
    mazePath: THREE.Vector3[];
    collectibles: Array<{ pos: THREE.Vector3; collected: boolean; mesh: THREE.LineSegments; }>;
    cursor: {
      pathIndex: number;
      t: number;
      speed: number;
      brightness: number;
      baseIntensity: number;
      glowIntensity: number;
      scale: number;
      baseScale: number;
      glowScale: number;
    };
    clock: THREE.Clock;
  } | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 50;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // Starfield
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 3000;
    const positions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 800;
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const starMaterial = new THREE.PointsMaterial({ 
      color: 0x8b5cf6, 
      size: 1.5,
      transparent: true,
      opacity: 0.8
    });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // Moving grid plane
    const planeGeometry = new THREE.PlaneGeometry(500, 500, 50, 50);
    const planeMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0.0 },
        color: { value: new THREE.Color(0x1e1b4b) }
      },
      vertexShader: `
        varying vec2 vUv;
        uniform float time;
        void main() {
          vUv = uv;
          vec3 pos = position;
          pos.z += sin(pos.x * 0.1 + time) * 2.0;
          pos.z += sin(pos.y * 0.1 + time * 0.7) * 1.5;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color;
        varying vec2 vUv;
        void main() {
          float speed = 0.03;
          vec2 uv = vUv;
          uv.y += time * speed;
          float line_width = 0.02;
          float line_freq = 15.0;
          float grid = max(
            step(1.0 - line_width, fract(uv.x * line_freq)),
            step(1.0 - line_width, fract(uv.y * line_freq))
          );
          float pulse = sin(time * 2.0) * 0.5 + 0.5;
          gl_FragColor = vec4(color, grid * 0.3 * (0.5 + pulse * 0.3));
        }
      `,
      transparent: true
    });
    const gridPlane = new THREE.Mesh(planeGeometry, planeMaterial);
    gridPlane.rotation.x = -Math.PI / 2;
    gridPlane.position.y = -20;
    scene.add(gridPlane);

    // Gaming maze path
    const mazeGroup = new THREE.Group();
    mazeGroup.rotation.x = 0.3;
    
    const w = 300;
    const h = 40;
    const mazePath = [
      new THREE.Vector3(-w/2, 0, 0),
      new THREE.Vector3(-w/2 + 40, 0, 0),
      new THREE.Vector3(-w/2 + 40, h*0.4, 0),
      new THREE.Vector3(-w/2 + 80, h*0.4, 0),
      new THREE.Vector3(-w/2 + 80, -h*0.3, 0),
      new THREE.Vector3(-w/2 + 120, -h*0.3, 0),
      new THREE.Vector3(-w/2 + 120, h*0.5, 0),
      new THREE.Vector3(-w/2 + 160, h*0.5, 0),
      new THREE.Vector3(-w/2 + 160, -h*0.2, 0),
      new THREE.Vector3(-w/2 + 200, -h*0.2, 0),
      new THREE.Vector3(-w/2 + 200, h*0.3, 0),
      new THREE.Vector3(-w/2 + 240, h*0.3, 0),
      new THREE.Vector3(-w/2 + 240, 0, 0),
      new THREE.Vector3(w/2, 0, 0),
    ];

    // Path line
    const pathGeometry = new THREE.BufferGeometry().setFromPoints(mazePath);
    const pathMaterial = new THREE.LineBasicMaterial({ 
      color: 0x6366f1,
      transparent: true,
      opacity: 0.6
    });
    const mazePathLine = new THREE.Line(pathGeometry, pathMaterial);
    mazeGroup.add(mazePathLine);

    // Gaming collectibles
    const collectibles: Array<{ pos: THREE.Vector3; collected: boolean; mesh: THREE.LineSegments; }> = [];
    [2, 4, 6, 8, 10].forEach((index) => {
      const pos = mazePath[index];
      const size = 6;
      const collectibleGeometry = new THREE.EdgesGeometry(new THREE.BoxGeometry(size, size, size));
      const collectibleMaterial = new THREE.LineBasicMaterial({ 
        color: 0x22d3ee,
        transparent: true,
        opacity: 0.8
      });
      const collectible = new THREE.LineSegments(collectibleGeometry, collectibleMaterial);
      collectible.position.copy(pos);
      collectible.rotation.x = Math.PI / 4;
      collectible.rotation.y = Math.PI / 4;
      
      collectibles.push({
        pos,
        collected: false,
        mesh: collectible
      });
      
      mazeGroup.add(collectible);
    });

    // Cursor (player)
    const cursorGeometry = new THREE.SphereGeometry(0.8, 16, 16);
    const cursorMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xa855f7,
      emissive: 0xa855f7,
      emissiveIntensity: 0.5
    });
    const cursorDot = new THREE.Mesh(cursorGeometry, cursorMaterial);
    
    const cursorLight = new THREE.PointLight(0xa855f7, 3, 30);
    cursorDot.add(cursorLight);
    
    // Trail
    const trailGeometry = new THREE.BufferGeometry();
    const trailLength = 100;
    const trailPositions = new Float32Array(trailLength * 3);
    const trailColors = new Float32Array(trailLength * 3);
    trailGeometry.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
    trailGeometry.setAttribute('color', new THREE.BufferAttribute(trailColors, 3));
    const trailMaterial = new THREE.LineBasicMaterial({ 
      vertexColors: true, 
      transparent: true 
    });
    const cursorTrail = new THREE.Line(trailGeometry, trailMaterial);
    
    mazeGroup.add(cursorDot);
    mazeGroup.add(cursorTrail);
    scene.add(mazeGroup);

    // Cursor animation state
    const cursor = {
      pathIndex: 0,
      t: 0,
      speed: 0.008,
      brightness: 0,
      baseIntensity: 3,
      glowIntensity: 8,
      scale: 1,
      baseScale: 1,
      glowScale: 1.5,
    };

    const clock = new THREE.Clock();

    // Store references
    sceneRef.current = {
      scene,
      camera,
      renderer,
      stars,
      gridPlane,
      mazeGroup,
      cursorDot,
      cursorLight,
      cursorTrail,
      mazePath,
      collectibles,
      cursor,
      clock
    };

    // Animation functions
    const updateMazeAnimation = () => {
      const refs = sceneRef.current!;
      
      if (refs.cursor.pathIndex >= refs.mazePath.length - 1) {
        refs.cursor.pathIndex = 0;
        refs.cursor.t = 0;
        refs.cursorDot.position.copy(refs.mazePath[0]);
        refs.camera.position.x = refs.cursorDot.position.x;
        refs.collectibles.forEach(data => { 
          data.collected = false; 
          data.mesh.visible = true; 
        });
      }

      const p0 = refs.mazePath[refs.cursor.pathIndex];
      const p1 = refs.mazePath[refs.cursor.pathIndex + 1];
      refs.cursorDot.position.lerpVectors(p0, p1, refs.cursor.t);
      refs.cursor.t += refs.cursor.speed;
      
      if (refs.cursor.t >= 1) { 
        refs.cursor.t = 0; 
        refs.cursor.pathIndex++; 
      }

      // Check collectibles
      refs.collectibles.forEach(data => {
        if (!data.collected && refs.cursorDot.position.distanceTo(data.pos) < 5) {
          data.collected = true;
          data.mesh.visible = false;
          refs.cursor.brightness = refs.cursor.glowIntensity;
          refs.cursor.scale = refs.cursor.glowScale;
        }
        
        if (data.mesh.visible) {
          data.mesh.rotation.x += 0.02;
          data.mesh.rotation.y += 0.02;
        }
      });

      // Update cursor effects
      refs.cursorLight.intensity = refs.cursor.baseIntensity + refs.cursor.brightness;
      if (refs.cursor.brightness > 0) refs.cursor.brightness *= 0.95;
      
      refs.cursorDot.scale.set(refs.cursor.scale, refs.cursor.scale, refs.cursor.scale);
      if (refs.cursor.scale > refs.cursor.baseScale) {
        refs.cursor.scale -= 0.05;
      } else {
        refs.cursor.scale = refs.cursor.baseScale;
      }

      // Update trail
      const positions = refs.cursorTrail.geometry.attributes.position.array;
      const colors = refs.cursorTrail.geometry.attributes.color.array;
      
      for (let i = 100 - 1; i > 0; i--) {
        const i3 = i * 3;
        const prev_i3 = (i - 1) * 3;
        positions[i3] = positions[prev_i3];
        positions[i3 + 1] = positions[prev_i3 + 1];
        positions[i3 + 2] = positions[prev_i3 + 2];
        colors[i3] = colors[prev_i3];
        colors[i3 + 1] = colors[prev_i3 + 1];
        colors[i3 + 2] = colors[prev_i3 + 2];
      }
      
      positions[0] = refs.cursorDot.position.x;
      positions[1] = refs.cursorDot.position.y;
      positions[2] = refs.cursorDot.position.z;
      
      const trailColor = new THREE.Color(0xa855f7);
      for (let i = 0; i < 100; i++) {
        const alpha = 1.0 - (i / 100);
        colors[i * 3] = trailColor.r * alpha;
        colors[i * 3 + 1] = trailColor.g * alpha;
        colors[i * 3 + 2] = trailColor.b * alpha;
      }
      
      refs.cursorTrail.geometry.attributes.position.needsUpdate = true;
      refs.cursorTrail.geometry.attributes.color.needsUpdate = true;
      
      // Smooth camera follow
      refs.camera.position.x = THREE.MathUtils.lerp(refs.camera.position.x, refs.cursorDot.position.x, 0.03);
    };

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      const refs = sceneRef.current;
      if (!refs) return;
      
      const delta = refs.clock.getDelta();
      
      // Rotate stars
      refs.stars.rotation.z -= 0.0002;
      refs.stars.rotation.y -= 0.0001;
      
      // Update grid
      (refs.gridPlane.material as THREE.ShaderMaterial).uniforms.time.value += delta;
      
      // Update maze animation
      updateMazeAnimation();
      
      refs.renderer.render(refs.scene, refs.camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      const refs = sceneRef.current;
      if (!refs) return;
      
      refs.camera.aspect = window.innerWidth / window.innerHeight;
      refs.camera.updateProjectionMatrix();
      refs.renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="fixed inset-0 -z-10"
      style={{ pointerEvents: 'none' }}
    />
  );
};

export default ThreeBackground;