﻿// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { MezzuriteConstants } from '@microsoft/mezzurite-core';
import { MezzuriteAngularJsUtils } from './angularjs-performance-utils.service';
import 'intersection-observer';

export class AngularJsPerfComponent {
    fullName: string;
    key: string;
    constructor(public name: string, public element: HTMLElement) {
        this.key = (<any>MezzuriteAngularJsUtils).makeId();
        window.performance.mark(this.key + MezzuriteConstants.componentMarkStart);
        this.fullName = MezzuriteConstants.measureNamePrefix + ";" + this.name + ";" + this.key;
        (<any>window).mezzurite.elementLookup[this.fullName] = element;
        const config = {
            root: null, // setting it to 'null' sets it to default value: viewport
            rootMargin: '0px'
        };
        var that = this;
        let observer = new IntersectionObserver(function(entries, observer) {
            const entry = entries[0];
            (<any>window).mezzurite.viewportWidth = entry.rootBounds.width;
            (<any>window).mezzurite.viewportHeight = entry.rootBounds.height;
            if (that.fullName !== undefined){
                if (entry.isIntersecting){
                    (<any>window).mezzurite.vltComponentLookup[that.fullName] = true;
                }
                else{
                    (<any>window).mezzurite.vltComponentLookup[that.fullName] = false;
                }
            }
            observer.unobserve(that.element);
            that.element = null;
        }, config);
            observer.observe(this.element);
    }

    setComponentComplete(){
        window.performance.mark(this.key + MezzuriteConstants.componentMarkEnd);
    }
}
