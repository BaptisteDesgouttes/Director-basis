class Dummy{
    static copy = (camera) => new Dummy(camera.mesh);
    constructor(model)
    {
        this.mesh = model;
        this.held = false;
        this.interacting = false;
        this.name = "PERSONNAGE";

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

export { Dummy }