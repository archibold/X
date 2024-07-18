import Widget from "../widget.js";

export default class WidgetA extends Widget {
    async init(target, done) {
        //
        // Some preparation code here
        //
        this.isPending = true;

        target.classList.add("widget-initialized");
        await new Promise((resolve) => setTimeout(resolve, 5000));
        done();
    }

    destroy() {
        this.target.classList.remove("widget-initialized");
    }

    doneHandler() {
        this.target.style.backgroundColor = "green";
        console.log("Widget C done");
    }

    failHandler() {
        this.target.style.backgroundColor = "red";
        console.error("Widget C failed");
    }
}
