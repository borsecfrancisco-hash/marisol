import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import * as ZapparThree from 'https://libs.zappar.com/zappar-threejs/2.0.3/zappar-threejs.js';

// Esto obliga al navegador a mostrar el selector de cámara
async function iniciarApp() {
    try {
        const ui = await ZapparThree.permissionRequestUI();
        if (ui) {
            setupAR();
        }
    } catch (e) {
        alert("Error de cámara: " + e.message);
    }
}

function setupAR() {
    const manager = new ZapparThree.Manager();
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    document.body.appendChild(renderer.domElement);
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new ZapparThree.Camera();
    
    // Encendido forzado
    camera.start();
    
    ZapparThree.glContextSet(renderer.getContext());
    scene.background = camera.createLumaTexture();

    // Cargamos tu archivo (asegúrate de que esté en la carpeta)
    const imageTracker = new ZapparThree.ImageTrackerLoader(manager).load("./welcome.zpt");
    const imageAnchor = new ZapparThree.ImageAnchorGroup(camera, imageTracker);
    scene.add(imageAnchor);

    // Cuadro rojo de prueba
    const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(1, 0.75),
        new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide })
    );
    imageAnchor.add(plane);

    function render() {
        requestAnimationFrame(render);
        camera.updateFrame(renderer);
        renderer.render(scene, camera);
    }
    render();
}

// Escuchar el clic del botón que pusimos en el HTML
document.getElementById("btn-iniciar").addEventListener("click", iniciarApp);