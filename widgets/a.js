import Widget from "../widget.js";

export default class WidgetA extends Widget {
    async init(target, done) {
        this.isPending = true;
        target.classList.add("widget-initialized");
        done();
    }

    destroy() {
        this.target.classList.remove("widget-initialized");
    }

    doneHandler() {
        this.target.style.backgroundColor = "green";
        console.log("Widget A done");
    }

    failHandler() {
        this.target.style.backgroundColor = "red";
        console.error("Widget A failed");
    }
}
