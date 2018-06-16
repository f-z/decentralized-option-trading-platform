"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var flash_messages_component_1 = require("./flash-messages.component");
var flash_messages_service_1 = require("./flash-messages.service");
var FlashMessagesModule = (function () {
    function FlashMessagesModule() {
    }
    FlashMessagesModule.forRoot = function () {
        return {
            ngModule: FlashMessagesModule,
            providers: [flash_messages_service_1.FlashMessagesService]
        };
    };
    FlashMessagesModule.decorators = [
        { type: core_1.NgModule, args: [{
                    imports: [common_1.CommonModule],
                    declarations: [flash_messages_component_1.FlashMessagesComponent],
                    exports: [flash_messages_component_1.FlashMessagesComponent],
                    providers: []
                },] },
    ];
    /** @nocollapse */
    FlashMessagesModule.ctorParameters = function () { return []; };
    return FlashMessagesModule;
}());
exports.FlashMessagesModule = FlashMessagesModule;
//# sourceMappingURL=module.js.map