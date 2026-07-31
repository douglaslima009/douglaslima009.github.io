document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('globe-container');
    if (!container) return;

    const tooltip = document.getElementById('globe-tooltip');

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 18;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false;

    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Wireframe
    const sphereGeo = new THREE.SphereGeometry(6, 24, 24);
    const wireMat = new THREE.MeshBasicMaterial({ 
        color: 0x333333, 
        wireframe: true,
        transparent: true,
        opacity: 0.6
    });
    globeGroup.add(new THREE.Mesh(sphereGeo, wireMat));

    // Mapa Alpha
    const textureLoader = new THREE.TextureLoader();
    textureLoader.crossOrigin = 'Anonymous';
    const earthTex = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg');

    const continentMat = new THREE.MeshBasicMaterial({
        color: 0x4a4a4a,
        transparent: true,
        alphaMap: earthTex,
        opacity: 0.85
    });
    
    const continentGlobe = new THREE.Mesh(new THREE.SphereGeometry(5.95, 32, 32), continentMat);
    globeGroup.add(continentGlobe);

    const gridHelper = new THREE.GridHelper(30, 30, 0x222222, 0x111111);
    gridHelper.position.y = -7;
    scene.add(gridHelper);

    // GOOGLE MAPS
    const experiences = [
        { id: 'exp1', lat: -4.96, lon: -37.97, title: "Lead Game Designer", company: "LearningLab", year: "2025 - PRES" },
        { id: 'exp2', lat: -3.73, lon: -38.52, title: "Lead Game Director", company: "VORTEX UFC", year: "2025 - PRES" },
        { id: 'exp3', lat: 34.084759, lon: -118.337290, title: "Junior Backend Eng.", company: "YEEZY (USA)", year: "2024" },
        { id: 'exp4', lat: 60.1699, lon: 24.9384, title: "QA & Tech Tester", company: "AAA Studio (NDA)", year: "2025" }
    ];
    function calcPosFromLatLonRad(lat, lon, radius) {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = lon * (Math.PI / 180);

        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.cos(phi);
        const z = -radius * Math.sin(phi) * Math.sin(theta);
        
        return new THREE.Vector3(x, y, z);
    }

    const markers = [];
    const markerGeo = new THREE.BoxGeometry(0.4, 0.4, 0.4); 
    const markerMat = new THREE.MeshBasicMaterial({ color: 0xff3333 }); 

    experiences.forEach(exp => {
        const pos = calcPosFromLatLonRad(exp.lat, exp.lon, 6);
        const marker = new THREE.Mesh(markerGeo, markerMat);
        marker.position.copy(pos);
        marker.lookAt(new THREE.Vector3(0,0,0)); 
        marker.userData = exp; 
        globeGroup.add(marker);
        markers.push(marker);
    });

    // VARIÁVEIS DE TRACKING (Notificação Seguidora)
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let pointerDownX = 0, pointerDownY = 0;
    
    let activeMarker = null; 
    let tooltipTimeout = null; 

    container.addEventListener('pointerdown', (event) => {
        pointerDownX = event.clientX;
        pointerDownY = event.clientY;
    });

    container.addEventListener('pointerup', (event) => {
        const deltaX = Math.abs(event.clientX - pointerDownX);
        const deltaY = Math.abs(event.clientY - pointerDownY);
        
        if (deltaX > 3 || deltaY > 3) return; 

        const rect = container.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(markers);

        if (intersects.length > 0) {
            activeMarker = intersects[0].object; 
            const data = activeMarker.userData;
            const isEn = localStorage.getItem('siteLang') === 'en';
            const yearStr = isEn ? data.year.replace('PRES', 'PRESENT') : data.year;

            tooltip.innerHTML = `
                <strong>${data.company}</strong>
                [ROLE]: ${data.title}<br>
                [SYS_TIME]: ${yearStr}
            `;
            
            tooltip.style.opacity = 1;

            if (tooltipTimeout) clearTimeout(tooltipTimeout);
            
            tooltipTimeout = setTimeout(() => {
                tooltip.style.opacity = 0;
                activeMarker = null; 
            }, 5000);

        } else {
            tooltip.style.opacity = 0;
            activeMarker = null;
            if (tooltipTimeout) clearTimeout(tooltipTimeout);
        }
    });

    function animate() {
        requestAnimationFrame(animate);
        globeGroup.rotation.y += 0.002; 
        controls.update();

        // LÓGICA DE TRACKING: Atualiza a posição da notificação a cada frame
        if (activeMarker && tooltip.style.opacity == 1) {
            const vector = activeMarker.position.clone();
            vector.applyMatrix4(globeGroup.matrixWorld);
            vector.project(camera);
            
            const rect = container.getBoundingClientRect();
            const x = (vector.x * 0.5 + 0.5) * rect.width;
            const y = (vector.y * -0.5 + 0.5) * rect.height;

            tooltip.style.left = `${x}px`;
            tooltip.style.top = `${y}px`;
        }

        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        if(!container) return;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
});