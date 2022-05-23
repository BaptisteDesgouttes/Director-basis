import { 
    GridHelper,
    AmbientLight,
    PlaneGeometry,
    MeshPhongMaterial,
    Mesh,
    Color,
    Scene
} from 'three';

import { DoubleSide } from 'three';

class SceneManager{
    constructor()
    {
        this.scene = new Scene();
        this.scene.background = new Color(0x008888);

        this.size = 70;

        /* SCENE INITIALISATION */
        this.initScene = function()
        {
            // Lighting
            const ambient = new AmbientLight( 0xffffff, 0.5 );
            this.scene.add(ambient);

            // Floor
            const floor = buildFloorMesh(this.size);
            this.scene.add(floor);

            // DEBUG
            const grid = new GridHelper(this.size, this.size);
            this.scene.add(grid);
        }

        function buildFloorMesh(size)
        {
            const materialFloor = new MeshPhongMaterial({color: 0x555555});
            materialFloor.side = DoubleSide;
            
            const geometryFloor = new PlaneGeometry(size, size);

            const floor = new Mesh(geometryFloor, materialFloor);
            floor.position.set(0, 0, 0);
            floor.rotation.x = - Math.PI / 2.0;

            return floor;
        }


        /* SCENE OBJECTS MANAGEMENT */


        /* USER'S ACTIONS */


        /* SCENE UPDATE */

        this.update = function ()
        {
            
        }

        this.initScene();
    }
}

export { SceneManager }
