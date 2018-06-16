"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FlashMessage = (function () {
    function FlashMessage(text, cssClass, closeOnClick, showCloseBtn) {
        this.id = (FlashMessage.nextId++);
        this.text = 'default text';
        this.cssClass = '';
        this.closeOnClick = false;
        this.showCloseBtn = false;
        if (text)
            this.text = text;
        if (cssClass)
            this.cssClass = cssClass;
        if (closeOnClick)
            this.closeOnClick = closeOnClick;
        if (showCloseBtn)
            this.showCloseBtn = showCloseBtn;
    }
    FlashMessage.nextId = 0;
    return FlashMessage;
}());
exports.FlashMessage = FlashMessage;
//# sourceMappingURL=flash-message.js.map