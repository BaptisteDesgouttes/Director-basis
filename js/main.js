/*import {
    Vector2,
    Vector3,
    Raycaster
} from 'three'*/
import { ViewportManager } from './ViewportManager.js'

let viewportManager = undefined;

bindEventListeners();
animate();

function bindEventListeners()
{
    document.addEventListener( 'keydown', onKeyDown );
    document.getElementById('start-button').addEventListener('click', () => {
        document.getElementById('levels').style.display = "block";
        const viewportElement = document.getElementById('canvas-container');
        viewportManager = new ViewportManager(viewportElement);
        document.getElementById('start-screen').style.display = "none";
    })
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
    if(viewportManager) viewportManager.render();
}