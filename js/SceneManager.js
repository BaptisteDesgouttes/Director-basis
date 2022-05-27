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

class SceneManager{
    static cameraModel;
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
                        SceneManager.cameraModel = object;
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
                    const model = new Object3D().copy(SceneManager.cameraModel);
                    this.scene.add(model);
                    model.position.y = 0;
                    objects.push({
                        mesh: model,
                        carried: false
                    })
                    break;
                case 2:
                    const mesh2 = new Mesh(new ConeGeometry(5, 20, 32), new MeshPhongMaterial({color: 0x0000ff}));
                    mesh2.position.x = 10;
                    this.scene.add(mesh2);
                    objects.push({
                        mesh: mesh2,
                        carried: false
                    })
                    break;
                case 3:
                    const mesh3 = new Mesh(new CylinderGeometry(5, 5, 20, 32), new MeshPhongMaterial({color: 0xff0000}));
                    mesh3.position.x = -10;
                    this.scene.add(mesh3);
                    objects.push({
                        mesh: mesh3,
                        carried: false
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
                    objects[0].carried = !objects[0].carried;
                    if(!objects[0].carried)
                    {
                        //objects[0].mesh.rotation.set(0, viewportManager.player.rotation.y, 0);
                    }
                    break;
                case 69: /*E*/
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
            objects.forEach(o => {
                if(o.carried)
                {
                    const newPosition = new Vector3().copy(viewportManager.player.position);
                    newPosition.y = 0;
                    newPosition.add(viewportManager.getForwardAxis().normalize());
                    objects[0].mesh.position.copy(newPosition);
                    const camDirection = new Vector3().addVectors(viewportManager.player.position, viewportManager.getForwardAxis().multiplyScalar(2));
                    camDirection.y -= viewportManager.player.position.y;
                    o.mesh.lookAt(camDirection);
                    o.mesh.rotateOnWorldAxis(Object3D.DefaultUp, Math.PI);
                }
            });

            if(endLevel) this.changeLevel();
        }

        SceneManager.loadModels(() => this.initScene());
        bindEventListeners()
    }
}

export { SceneManager }
