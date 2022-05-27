import { 
    GridHelper,
    AmbientLight,
    Object3D,
    PlaneGeometry,
    BoxGeometry,
    ConeGeometry,
    CylinderGeometry,
    Mesh,
    MeshPhongMaterial,
    Color,
    Scene,
    Vector3
} from 'three';

import { MTLLoader } from 'three-loaders/MTLLoader.js';
import { OBJLoader } from 'three-loaders/OBJLoader.js';

import { DoubleSide } from 'three';

import { Camera } from './Camera.js';

class SceneManager{
    static cameraObject;
    static loadModels(callback)
    {
        new MTLLoader()
            .setPath( 'models/camera/' )
            .load('camera.mtl', function (materials) {

                materials.preload();

                new OBJLoader()
                    .setMaterials(materials)
                    .setPath('models/camera/')
                    .load('camera.obj', function (object) {
                        SceneManager.cameraObject = new Camera(object);
                        callback();
                    });
            });
    }
    constructor(viewportManager, id)
    {
        this.id = id
        this.scene = new Scene();
        
        // Scene objects
        const objects = [];
        
        let endLevel = false;

        this.size = 70;

        /* SCENE INITIALISATION */
        this.initScene = function()
        {
            // Lighting
            const ambient = new AmbientLight( 0xffffff, 5 );
            this.scene.add(ambient);

            // Floor
            const floor = buildFloorMesh(this.size);
            this.scene.add(floor);

            // DEBUG
            const grid = new GridHelper(this.size, this.size);
            this.scene.add(grid);

            switch(this.id)
            {
                case 1:
                    this.scene.background = new Color(0x008888);
                    break;
                case 2:
                    this.scene.background = new Color(0x888800);
                    break;
                case 3:
                    this.scene.background = new Color(0x880088);
                    break;
            }
            switch(this.id)
            {
                case 1:
                    const camera = Camera.copy(SceneManager.cameraObject);
                    this.scene.add(camera.mesh);
                    camera.mesh.position.set(0,0,0);
                    objects.push(camera);
                    break;
                case 2:
                    const mesh2 = new Mesh(new ConeGeometry(5, 20, 32), new MeshPhongMaterial({color: 0x0000ff}));
                    mesh2.position.x = 10;
                    this.scene.add(mesh2);
                    objects.push({
                        mesh: mesh2,
                        held: false
                    })
                    break;
                case 3:
                    const mesh3 = new Mesh(new CylinderGeometry(5, 5, 20, 32), new MeshPhongMaterial({color: 0xff0000}));
                    mesh3.position.x = -10;
                    this.scene.add(mesh3);
                    objects.push({
                        mesh: mesh3,
                        held: false
                    })
                    break;
            }
        }

        function buildFloorMesh(size)
        {
            const materialFloor = new MeshPhongMaterial({color: 0x111111});
            materialFloor.side = DoubleSide;
            
            const geometryFloor = new PlaneGeometry(size, size);

            const floor = new Mesh(geometryFloor, materialFloor);
            floor.position.set(0, 0, 0);
            floor.rotation.x = - Math.PI / 2.0;

            return floor;
        }


        /* SCENE OBJECTS MANAGEMENT */
        function nearestObjectIndex()
        {
            if(objects.length <= 0)
            {
                console.error("Not any object in the scene");
                return -1;
            }
            const objectsSortedByDistance = [...objects];
            objectsSortedByDistance.sort((o1, o2) => o1.mesh.position.distanceTo(viewportManager.player.position) - o2.mesh.position.distanceTo(viewportManager.player.position));
            return objects.indexOf(objectsSortedByDistance[0]);
        }

        function followPlayerMovement(object)
        {
            /* Position */
            const newPosition = new Vector3().copy(viewportManager.player.position);
            newPosition.y = 0;
            newPosition.add(viewportManager.getForwardAxis().normalize());
            object.mesh.position.copy(newPosition);

            /* Rotation*/
            const camDirection = new Vector3().addVectors(viewportManager.player.position, viewportManager.getForwardAxis().multiplyScalar(2));
            camDirection.y -= viewportManager.player.position.y;
            object.mesh.lookAt(camDirection);
            object.mesh.rotateOnWorldAxis(Object3D.DefaultUp, Math.PI);
        }


        /* USER'S ACTIONS */
        function bindEventListeners()
        {
            window.addEventListener('keydown', onKeyDown);
        }

        function onKeyDown(event)
        {
            switch (event.keyCode) {
                case 70: /*F*/
                    endLevel = true;
                    break;
                case 32: /*Space*/
                    const objectHeld = objects.find(o => o.held);
                    if(objectHeld)
                    {
                        objectHeld.held = false;
                        document.getElementById("helper-text").innerHTML = objectHeld.name + " RELEASED";
                        setTimeout(() => {
                            document.getElementById("helper-text").style.display = "none"
                            document.getElementById("helper-text").innerHTML = "";
                        }, 1000);
                    }
                    else
                    {
                        const objectToHold = objects[nearestObjectIndex()];
                        if(objectToHold.mesh.position.distanceTo(viewportManager.player.position) < 3)
                        {
                            objectToHold.held = true;
                            document.getElementById("helper-text").innerHTML = objectToHold.name + " HELD";
                            document.getElementById("helper-text").style.display = "block";
                        }
                    }
                    break;
                case 69: /*E*/
                    const objectToInteract = objects[nearestObjectIndex()];
                    if(objectToInteract.mesh.position.distanceTo(viewportManager.player.position) < 3)
                    {
                        objectToInteract.interact();
                    }
                    break;
            }
        }

        /* CHANGE LEVEL */
        this.changeLevel = function()
        {
            this.dispose();
            viewportManager.sceneManager = new SceneManager(viewportManager, this.id + 1);
        }

        /* DELETE LEVEL */
        this.dispose = function()
        {
            this.scene.children.forEach(object =>
            {
                if(object.isMesh)
                {
                    object.geometry.dispose();
                    object.material.dispose();
                }
            });
        }

        /* SCENE UPDATE */
        this.update = function ()
        {
            const heldObject = objects.find(o => o.held);
            if(heldObject) followPlayerMovement(heldObject);

            if(endLevel) this.changeLevel();
        }

        SceneManager.loadModels(() => this.initScene());
        bindEventListeners()
    }
}

export { SceneManager }
