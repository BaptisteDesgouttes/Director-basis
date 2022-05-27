class Camera{
    static copy = (camera) => new Camera(camera.mesh);
    constructor(model)
    {
        console.log(model);
        this.mesh = model;
        this.held = false;
        this.interacting = false;
        this.name = "CAMERA";

        this.dispose = function()
        {
            if(this.mesh.isMesh)
            {
                this.mesh.geometry.dispose();
                this.mesh.material.dispose();
            }
        }
        
        this.interact = function()
        {
            console.log("hi there");
        }
    }
}

export { Camera }