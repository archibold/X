export default class Widget {
    constructor(target) {
        this.target = target;
        this.initialized = false;
        this.isPending = false;
        this.bindHandlers();
    }

    // Method to be called to mark initialization complete
    finishInitialization() {
        this.initialized = true;
        this.isPending = false;
    }

    async init(target, done) {
        throw new Error("init method must be implemented");
    }

    destroy() {
        throw new Error("destroy method must be implemented");
    }

    // Helper to bind methods ending with Handler to this
    bindHandlers() {
        for (const key of Object.getOwnPropertyNames(
            Object.getPrototypeOf(this)
        )) {
            if (key.endsWith("Handler") && typeof this[key] === "function") {
                this[key] = this[key].bind(this);
            }
        }
    }
}
