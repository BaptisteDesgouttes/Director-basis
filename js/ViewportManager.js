import {
    WebGLRenderer,
    PerspectiveCamera,
    Group,
    Object3D,
    Vector2,
    Vector3
} from 'three';
import { PCFSoftShadowMap, sRGBEncoding } from 'three';

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

        this.player = buildPlayer();
        const player = this.player;

        this.sceneManager = new SceneManager(this);

        this.timeManager = Date.now();

        // ACTIONS
        const forwardAxis = new Vector3(0, 0, -1);
        let velocity = 0.003;
        let moveForward = false;
        let moveLeft = false;
        let moveBackward = false;
        let moveRight = false;

        function buildRenderer()
        {
            const containerElement = document.createElement( 'div' );
            viewportElement.insertBefore(containerElement, viewportElement.firstChild);

            const renderer = new WebGLRenderer( { logarithmicDepthBuffer: true, antialias: true } );
            renderer.setPixelRatio( window.devicePixelRatio );
            renderer.setSize( viewportWidth, viewportHeight );
            containerElement.appendChild( renderer.domElement );
        
            renderer.shadowMap.enabled = true;
        
            renderer.shadowMap.type = PCFSoftShadowMap;
            renderer.outputEncoding = sRGBEncoding;
        
            renderer.autoClear = false;

            return renderer;
        }

        /* CREATION OF USER'S CAMERAS */
        function buildPerspectiveCamera()
        {
            const perspectiveCamera = new PerspectiveCamera( 70, aspect, 0.01, 10000 );
            perspectiveCamera.lookAt(0,0,-1);
            return perspectiveCamera;
        }

        function buildPlayer()
        {
            const player = new Group();
            player.position.set(0, 1.7, 10); //height and retreat
            player.add(camera);

            return player;
        }

        /* USER'S ACTIONS */
        function bindEventListeners()
        {
            window.addEventListener( 'resize', onWindowResize );
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
                    velocity *= 1.4;
                    break;

                case 32: /*Space*/

                    break;

                case 69: /*E*/

                    break;
                default:
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
                    velocity /= 1.4;
                    break;
                default:
                    break;
            }
        }

        const pointer = new Vector2();
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

            const camDirection = new Vector3();
            camera.getWorldDirection(camDirection)
            if(!(forwardAxis.angleTo(camDirection) + Math.sign(camDirection.y) * diffY * 4 > Math.PI / 2.0))
            {
                player.rotateOnWorldAxis(Object3D.DefaultUp, diffX * 4);
                player.rotateOnAxis(new Vector3(1,0,0), diffY * 4);
    
                camera.getWorldDirection(forwardAxis)
                forwardAxis.projectOnPlane(new Vector3(0, 1, 0));
                forwardAxis.normalize();
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
            pointer.x = ((event.clientX / viewportWidth) * 2 - 1);;
            pointer.y = ((event.clientY / viewportHeight) * 2 - 1);;
        }

        function onWindowResize()
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
            /* Manage time */
            const deltaTime = Date.now() - this.timeManager;
            this.timeManager = Date.now();

            /* Player's move */
            const direction = new Vector3().copy(forwardAxis).normalize().multiplyScalar(velocity*deltaTime);
            if(moveForward) this.player.position.add(direction);
            if(moveLeft) this.player.position.sub(new Vector3().crossVectors(direction, new Vector3(0,1,0)));
            if(moveBackward) this.player.position.sub(direction);
            if(moveRight) this.player.position.add(new Vector3().crossVectors(direction, new Vector3(0,1,0)));

            this.sceneManager.update();

            this.player.updateMatrixWorld(true);

            renderer.clear();
            renderer.setViewport( 0, 0, viewportWidth, viewportHeight );
            renderer.render( this.sceneManager.scene, camera )
        }

        bindEventListeners();

        /* GETTERS */
        this.getForwardAxis = function()
        {
            return new Vector3().copy(forwardAxis);
        }
    }
}

export { ViewportManager }