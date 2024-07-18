# Widget Initializer

## Widget implementation

New widget has extend class Widget from `widget.js`

Widget `init()` method should set `this.isPending = true` before initialization and run `done()` after finalize initialization.

Widget can be destroyed by using `destroy()` method. After that, you can again initialize Widget.

```javascipt
import Widget from "../widget.js";

export default class WidgetA extends Widget {
    async init(target, done) {
        this.isPending = true;
        ...
        done();
    }

    destroy() {
        ...
    }
}

```

### Widget.init(target, done)

function is async and should be implemented.
Here you can add you widget initialization code.

### Widget.destroy()

function is sync and should be implemented.
Clean up method that remove Widget from DOM tree.

### newFuncHandler()

implementing `newFuncHandler()` create `newFunc()` that you can use in your code anywhere.

## X Library

library for Widget initialization for Node.js (jsdom) and Browser

## init(target, done)

1. X looks for the widget attribute recursively (top to bottom) starting from the <b>target</b> node.
2. If a widget with the given path was not loaded yet, it loads the widget.
3. It instantiates the widget and calls its init method with the given target.
4. It calls the callback when whole widgets tree is ready.

## destory()

1. X looks for initialized widgets recursively (bottom to top) starting from the <b>target</b> node.
2. For the given widget instance it calls the destroy method.
