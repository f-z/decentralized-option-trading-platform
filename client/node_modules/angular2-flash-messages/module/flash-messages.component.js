"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var flash_message_1 = require("./flash-message");
var flash_messages_service_1 = require("./flash-messages.service");
var FlashMessagesComponent = (function () {
    function FlashMessagesComponent(_flashMessagesService, _cdRef) {
        this._flashMessagesService = _flashMessagesService;
        this._cdRef = _cdRef;
        this._defaults = {
            text: 'default message',
            closeOnClick: false,
            showCloseBtn: false,
            cssClass: ''
        };
        this.messages = [];
        this.classes = '';
        this._grayOut = false;
        this._flashMessagesService.show = this.show.bind(this);
        this._flashMessagesService.grayOut = this.grayOut.bind(this);
    }
    FlashMessagesComponent.prototype.ngOnInit = function () { };
    FlashMessagesComponent.prototype.show = function (text, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        var defaults = {
            timeout: 2500,
            closeOnClick: false,
            showCloseBtn: false,
            cssClass: '',
            text: "default message"
        };
        for (var attrname in options) {
            defaults[attrname] = options[attrname];
        }
        var message = new flash_message_1.FlashMessage(text, defaults.cssClass, defaults.closeOnClick, defaults.showCloseBtn);
        message.timer = window.setTimeout(function () {
            _this._remove(message);
            _this._cdRef.detectChanges();
        }, defaults.timeout);
        this.messages.push(message);
        this._cdRef.detectChanges();
    };
    FlashMessagesComponent.prototype.close = function (message) {
        clearTimeout(message.timer);
        this._remove(message);
        this._cdRef.detectChanges();
    };
    FlashMessagesComponent.prototype.alertClicked = function (message) {
        if (message.closeOnClick) {
            this.close(message);
        }
    };
    FlashMessagesComponent.prototype.grayOut = function (value) {
        if (value === void 0) { value = false; }
        this._grayOut = value;
    };
    FlashMessagesComponent.prototype._remove = function (message) {
        this.messages = this.messages.filter(function (msg) { return msg.id !== message.id; });
    };
    FlashMessagesComponent.decorators = [
        { type: core_1.Component, args: [{
                    selector: 'flash-messages',
                    template: "\n      <div id=\"flashMessages\" class=\"flash-messages\">\n          <div id=\"grayOutDiv\" *ngIf='_grayOut && messages.length'></div>\n          <div class=\"alert flash-message {{message.cssClass}}\" [ngClass]=\"{'alert-dismissible':message.showCloseBtn}\" [style.cursor]=\"message.closeOnClick?'pointer':'inherit'\" *ngFor='let message of messages' (click)=\"alertClicked(message)\">\n              <button *ngIf=\"message.showCloseBtn\" type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\" (click)=\"close(message)\"><span aria-hidden=\"true\">&times;</span></button>\n              <p>{{message.text}}</p>\n          </div> \n      </div>\n  "
                },] },
    ];
    /** @nocollapse */
    FlashMessagesComponent.ctorParameters = function () { return [
        { type: flash_messages_service_1.FlashMessagesService, },
        { type: core_1.ChangeDetectorRef, },
    ]; };
    return FlashMessagesComponent;
}());
exports.FlashMessagesComponent = FlashMessagesComponent;
//# sourceMappingURL=flash-messages.component.js.map