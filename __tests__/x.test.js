/**
 * @jest-environment node
 */
import { JSDOM } from "jsdom";
import X from "../x.js";

jest.mock("../widgets/a.js", () => ({
    __esModule: true,
    default: jest.fn().mockImplementation(function () {
        this.init = jest.fn((target, done) => done());
        this.destroy = jest.fn();
        this.doneHandler = jest.fn();
        this.failHandler = jest.fn();
        this.finishInitialization = jest.fn();
    }),
}));

jest.mock("../widgets/b.js", () => ({
    __esModule: true,
    default: jest.fn().mockImplementation(function () {
        this.init = jest.fn((target, done) => done());
        this.destroy = jest.fn();
        this.doneHandler = jest.fn();
        this.failHandler = jest.fn();
        this.finishInitialization = jest.fn();
    }),
}));

jest.mock("../widgets/c.js", () => ({
    __esModule: true,
    default: jest.fn().mockImplementation(function () {
        this.init = jest.fn((target, done) => done());
        this.destroy = jest.fn();
        this.doneHandler = jest.fn();
        this.failHandler = jest.fn();
        this.finishInitialization = jest.fn();
    }),
}));

describe("X Library", () => {
    let dom;
    let document;
    let root;

    beforeEach(() => {
        dom = new JSDOM(`
            <div id="root">
                <div widget="widgets/a">
                    <div widget="widgets/b"></div>
                </div>
                <div></div>
                <div widget="widgets/c"></div>
            </div>
        `);
        document = dom.window.document;
        root = document.getElementById("root");

        // Clear mock calls between tests
        jest.clearAllMocks();
    });

    test("should initialize widgets correctly", async () => {
        const callback = jest.fn();
        await X.init(root, callback);

        const WidgetA = (await import("../widgets/a.js")).default;
        const WidgetB = (await import("../widgets/b.js")).default;
        const WidgetC = (await import("../widgets/c.js")).default;

        expect(WidgetA).toHaveBeenCalled();
        expect(WidgetB).toHaveBeenCalled();
        expect(WidgetC).toHaveBeenCalled();
        expect(callback).toHaveBeenCalledWith(null);
    });

    test("should destroy widgets correctly", async () => {
        const callback = jest.fn();
        await X.init(root, callback);
        X.destroy(root);

        const WidgetA = (await import("../widgets/a.js")).default;
        const WidgetB = (await import("../widgets/b.js")).default;
        const WidgetC = (await import("../widgets/c.js")).default;

        const instanceA = WidgetA.mock.instances[0];
        const instanceB = WidgetB.mock.instances[0];
        const instanceC = WidgetC.mock.instances[0];

        expect(instanceA.destroy).toHaveBeenCalled();
        expect(instanceB.destroy).toHaveBeenCalled();
        expect(instanceC.destroy).toHaveBeenCalled();
    });

    test("should handle widget instance retrieval", async () => {
        const callback = jest.fn();
        await X.init(root, callback);

        const WidgetA = (await import("../widgets/a.js")).default;

        const widgetInstance = X.getWidgetInstance(
            root.querySelector('[widget="widgets/a"]')
        );
        expect(widgetInstance).toBe(WidgetA.mock.instances[0]);
    });

    test("should handle widget initialization failure", async () => {
        const WidgetB = (await import("../widgets/b.js")).default;
        // Simulate a failure in widget B
        WidgetB.mockImplementationOnce(() => ({
            init: jest.fn((target, done) => {
                throw new Error("Initialization failed");
            }),
            destroy: jest.fn(),
            doneHandler: jest.fn(),
            failHandler: jest.fn(),
            finishInitialization: jest.fn(),
        }));

        const callback = jest.fn();
        await X.init(root, callback);

        expect(callback).toHaveBeenCalledWith(
            expect.arrayContaining([
                expect.objectContaining({
                    node: root.querySelector('[widget="widgets/b"]'),
                    error: expect.any(Error),
                }),
            ])
        );
    });

    test("should prevent multiple initializations of the same widget", async () => {
        const callback = jest.fn();
        await X.init(root, callback);

        const WidgetA = (await import("../widgets/a.js")).default;
        expect(WidgetA).toHaveBeenCalledTimes(1);

        await X.init(root.querySelector('[widget="widgets/a"]'), callback);
        expect(WidgetA).toHaveBeenCalledTimes(1); // Still 1 because it should not re-initialize
    });

    test("should handle destruction of a subtree correctly", async () => {
        const callback = jest.fn();
        await X.init(root, callback);

        const WidgetA = (await import("../widgets/a.js")).default;
        const WidgetB = (await import("../widgets/b.js")).default;

        X.destroy(root.querySelector('[widget="widgets/a"]'));
        expect(WidgetA.mock.instances[0].destroy).toHaveBeenCalled();
        expect(WidgetB.mock.instances[0].destroy).toHaveBeenCalled();
    });

    test("should call doneHandler on the widget instance", async () => {
        const callback = jest.fn();
        await X.init(root, callback);

        const WidgetA = (await import("../widgets/a.js")).default;
        const widgetInstance = X.getWidgetInstance(
            root.querySelector('[widget="widgets/a"]')
        );

        widgetInstance.doneHandler();
        expect(widgetInstance.doneHandler).toHaveBeenCalled();
    });

    test("should call failHandler on the widget instance", async () => {
        const callback = jest.fn();
        await X.init(root, callback);

        const WidgetA = (await import("../widgets/a.js")).default;
        const widgetInstance = X.getWidgetInstance(
            root.querySelector('[widget="widgets/a"]')
        );

        widgetInstance.failHandler();
        expect(widgetInstance.failHandler).toHaveBeenCalled();
    });
});
