/*import {
    Vector2,
    Vector3,
    Raycaster
} from 'three'*/
import { ViewportManager } from './ViewportManager.js'

const viewportElement = document.getElementById('canvas-container');
const viewportManager = new ViewportManager(viewportElement);

bindEventListeners();
animate();

function bindEventListeners()
{
    window.addEventListener( 'resize', onWindowResize );
    document.addEventListener( 'keydown', onKeyDown );

    viewportManager.bindEventListeners();
}

function onWindowResize()
{
    viewportManager.onWindowResize();
}

// DEBUG
function onKeyDown( event )
{
    switch ( event.keyCode ) {
        case 79: /*O*/
            break;

        case 80: /*P*/
            break;
    }
}

//RENDER
function animate()
{
    requestAnimationFrame( animate );
    viewportManager.render();
}