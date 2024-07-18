function WidgetDestroyed(message = "") {
    this.name = "WidgetDestroyed";
    this.message = message;
}
WidgetDestroyed.prototype = Error.prototype;

export default (function () {
    const widgetsMap = new Map(); // To keep track of initialized widgets
    const resolver = async (path) => {
        const module = await import(`./${path}.js`);
        return module.default;
    };

    async function init(target, callback) {
        const errors = [];
        const nodesToInit = [];

        // Recursive function to find all nodes with a widget attribute
        function collectWidgetNodes(node) {
            if (node.hasAttribute("widget")) {
                nodesToInit.push(node);
            }
            [...node.children].forEach((child) => collectWidgetNodes(child));
        }

        // Initialize widgets top-down
        async function initializeWidgets() {
            for (const node of nodesToInit) {
                const widgetPath = node.getAttribute("widget");
                if (!widgetsMap.has(node)) {
                    try {
                        const WidgetClass = await resolver(widgetPath);
                        const widgetInstance = new WidgetClass(node);
                        widgetsMap.set(node, widgetInstance);

                        await widgetInstance.init(node, () => {
                            widgetInstance.finishInitialization();
                        });
                    } catch (error) {
                        errors.push({ node, error });
                        // If initialization fails, stop further initialization for its children
                        break;
                    }
                }
            }
        }

        // Collect nodes and initialize widgets
        collectWidgetNodes(target);
        await initializeWidgets();

        callback(errors.length > 0 ? errors : null);
    }

    function destroy(target) {
        // Recursive function to find all nodes with initialized widgets
        function collectInitializedNodes(node) {
            const nodesToDestroy = [];
            if (widgetsMap.has(node)) {
                nodesToDestroy.push(node);
            }
            node.childNodes.forEach((child) =>
                nodesToDestroy.push(...collectInitializedNodes(child))
            );
            return nodesToDestroy;
        }

        // Destroy widgets bottom-up
        const nodesToDestroy = collectInitializedNodes(target).reverse();
        for (const node of nodesToDestroy) {
            const widgetInstance = widgetsMap.get(node);
            if (widgetInstance) {
                if (widgetInstance.isPending) {
                    throw new WidgetDestroyed(
                        "Widget is initialization process."
                    );
                }
                widgetInstance.destroy();
                widgetInstance.isInitialized = false;
                widgetsMap.delete(node);
            }
        }
    }

    // Method to retrieve widget instance for a given node
    function getWidgetInstance(node) {
        return widgetsMap.get(node);
    }

    return {
        getWidgetInstance,
        init,
        destroy,
    };
})();
