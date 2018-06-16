import { OnInit, ChangeDetectorRef } from '@angular/core';
import { FlashMessage } from './flash-message';
import { FlashMessagesService } from './flash-messages.service';
import { FlashMessageInterface } from './flash-message.interface';
export declare class FlashMessagesComponent implements OnInit {
    private _flashMessagesService;
    private _cdRef;
    private _defaults;
    text: string;
    messages: FlashMessageInterface[];
    classes: string;
    _grayOut: boolean;
    constructor(_flashMessagesService: FlashMessagesService, _cdRef: ChangeDetectorRef);
    ngOnInit(): void;
    show(text?: string, options?: {}): void;
    close(message: FlashMessage): void;
    alertClicked(message: FlashMessage): void;
    grayOut(value?: boolean): void;
    private _remove(message);
}
