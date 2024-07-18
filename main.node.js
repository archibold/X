import X from "./x.js";
import { JSDOM } from "jsdom";

const dom = new JSDOM(`
    <!DOCTYPE html>
<body>
    <div id="root">
        <div widget="widgets/a">
            <div widget="widgets/b"></div>
        </div>
        <div></div>
        <div widget="widgets/c"></div>
    </div>
</body>

</html>
    `);
global.window = dom.window;
global.document = dom.window.document;
const root = dom.window.document.getElementById("root");

X.init(root, () => {
    console.log(root.outerHTML);
});

X.init(document.getElementById("root"), () => {
    console.log("This is function after all");
    X.destroy(document.getElementById("root").querySelectorAll("[widget]")[1]);
    X.init(document.getElementById("root"), () => {
        console.log("This is function after all second times");
        // X.destroy(
        //     document.getElementById("root").querySelectorAll("[widget]")[1]
        // );
        console.log(root.outerHTML);
    });
});
