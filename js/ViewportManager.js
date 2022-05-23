import * as THREE from 'three';

import { SceneManager } from './SceneManager.js';

class ViewportManager{
    constructor(viewportElement)
    {
        let viewportWidth = window.innerWidth;
        let viewportHeight = window.innerHeight;
        
        const renderer = buildRenderer();

        this.element = renderer.domElement;

        const aspect = viewportWidth / viewportHeight;
        const camera = buildPerspectiveCamera(aspect);

        this.sceneManager = new SceneManager();

        // ACTIONS
        const forwardAxis = new THREE.Vector3(0, 0, -1);
        let velocity = 0.1;
        let moveForward = false;
        let moveLeft = false;
        let moveBackward = false;
        let moveRight = false;

        function buildRenderer()
        {
            const containerElement = document.createElement( 'div' );
            viewportElement.insertBefore(containerElement, viewportElement.firstChild);

            const renderer = new THREE.WebGLRenderer( { logarithmicDepthBuffer: true, antialias: true } );
            renderer.setPixelRatio( window.devicePixelRatio );
            renderer.setSize( viewportWidth, viewportHeight );
            containerElement.appendChild( renderer.domElement );
        
            renderer.shadowMap.enabled = true;
        
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            renderer.outputEncoding = THREE.sRGBEncoding;
        
            renderer.autoClear = false;

            return renderer;
        }

        /* CREATION OF USER'S CAMERAS */
        function buildPerspectiveCamera()
        {
            const perspectiveCamera = new THREE.PerspectiveCamera( 70, aspect, 0.2, 10000 );
            perspectiveCamera.position.set(0, 1.7, 10); //height and retreat
            perspectiveCamera.lookAt(0,1.7,1);
            return perspectiveCamera;
        }

        /* USER'S ACTIONS */
        this.bindEventListeners = function()
        {
            window.addEventListener('keydown', onKeyDown);
            window.addEventListener('keyup', onKeyUp);
            window.addEventListener('pointerdown', onPointerDown);
            window.addEventListener('pointerup', onPointerUp);
            window.addEventListener('pointermove', onPointerMove);
        }

        function onKeyDown(event)
        {
            switch (event.keyCode) {
                case 90: /*Z*/
                    moveForward = true;
                    break;
        
                case 81: /*Q*/
                    moveLeft = true;
                    break;
        
                case 83: /*S*/
                    moveBackward = true;
                    break;

                case 68: /*D*/
                    moveRight = true;
                    break;

                case 16: /*Shift*/
                    velocity = 0.17;
                    break;
            }
        }

        function onKeyUp(event)
        {
            switch (event.keyCode) {
                case 90: /*Z*/
                    moveForward = false;
                    break;
        
                case 81: /*Q*/
                    moveLeft = false;
                    break;
        
                case 83: /*S*/
                    moveBackward = false;
                    break;

                case 68: /*D*/
                    moveRight = false;
                    break;

                case 16: /*Shift*/
                    velocity = 0.1;
                    break;
            }
        }

        const pointer = new THREE.Vector2();
        function onPointerDown( event ) {
            if(event.button === 0) window.addEventListener( 'pointermove', onDrag);
            window.removeEventListener( 'pointermove', onPointerMove);
        }
        
        function onDrag()
        {
            const newPointerX = ((event.clientX / viewportWidth) * 2 - 1);
            const newPointerY = ((event.clientY / viewportHeight) * 2 - 1);
            const diffX = pointer.x - newPointerX;
            const diffY = pointer.y - newPointerY;

            const camDirection = new THREE.Vector3();
            camera.getWorldDirection(camDirection)
            if(!(forwardAxis.angleTo(camDirection) + Math.sign(camDirection.y) * diffY * 4 > Math.PI / 2.0))
            {
                camera.rotateOnWorldAxis(new THREE.Vector3(0,1,0), diffX * 4);
                camera.rotateOnAxis(new THREE.Vector3(1,0,0), diffY * 4);
    
                camera.getWorldDirection(forwardAxis)
                forwardAxis.projectOnPlane(new THREE.Vector3(0, 1, 0));
            }

            pointer.x = newPointerX;
            pointer.y = newPointerY;
        }

        function onPointerUp(event) {
            window.removeEventListener( 'pointermove', onDrag);
            window.addEventListener( 'pointermove', onPointerMove);
        }

        function onPointerMove(event)
        {
            const newPointerX = ((event.clientX / viewportWidth) * 2 - 1);
            const newPointerY = ((event.clientY / viewportHeight) * 2 - 1);
            const diffX = pointer.x - newPointerX;
            const diffY = pointer.y - newPointerY;

            //camera.rotateY(diffX);
            //camera.rotateOnAxis(new THREE.Vector3(1,0,0), diffY);
            //camera.getWorldDirection(forwardAxis)
            //forwardAxis.projectOnPlane(new THREE.Vector3(0, 1, 0));

            pointer.x = newPointerX;
            pointer.y = newPointerY;
        }

        this.onWindowResize = function()
        {
            viewportWidth = window.innerWidth;
            viewportHeight = window.innerHeight;
            const newAspect = viewportWidth / viewportHeight;
        
            renderer.setSize( viewportWidth, viewportHeight );
        
            camera.aspect = newAspect;
            camera.updateProjectionMatrix();
        }
        
        /* RENDER */
        this.render = function()
        {
            const direction = new THREE.Vector3().copy(forwardAxis).normalize().multiplyScalar(velocity);
            if(moveForward) camera.position.add(direction);
            if(moveLeft) camera.position.sub(new THREE.Vector3().crossVectors(direction, new THREE.Vector3(0,1,0)));
            if(moveBackward) camera.position.sub(direction);
            if(moveRight) camera.position.add(new THREE.Vector3().crossVectors(direction, new THREE.Vector3(0,1,0)));

            this.sceneManager.update();

            renderer.clear();
            renderer.setViewport( 0, 0, viewportWidth, viewportHeight );
            renderer.render( this.sceneManager.scene, camera )
        }
    }
}

export { ViewportManager }