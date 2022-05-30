class Camera{
    static copy = (camera) => new Camera(camera.mesh);
    constructor(model)
    {
        this.mesh = model;
        this.held = false;
        this.interacting = false;
        this.name = "CAMÉRA";

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