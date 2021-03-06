// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import React from 'react';
import ReactDOM from 'react-dom';
import {PerformanceTimingService, PerformanceTelemetryService, MezzuriteConstants} from '@microsoft/mezzurite-core';
import { MezzuriteReactUtils } from './performance-utils-react.service';
import { StateProvider } from './state-provider.service';
import 'intersection-observer';

/**
 * checks whether current component is class or stateless
 * @param {*} Component component
 */
function isStateless(Component) {
    return !Component.prototype.render;
}

/**
 * checks if withMezzuriteRouter is being implemented on the App
 */
function routerNotImplemented(){
    const routerNotImplementedBool = (window.mezzurite.routerPerf === undefined || !window.mezzurite.routerPerf);
    const listenerDoesntExistBool = (window.mezzurite.listenerExists === undefined || !window.mezzurite.listenerExists);
    return (routerNotImplementedBool && listenerDoesntExistBool)
}

/**
 * Higher order component for adding Mezzurite functionality to a React component
 * @param {*} WrappedComponent 
 */
const withMezzurite = (WrappedComponent) => {
    var ModifiedComponent;

    if (isStateless(WrappedComponent)){
        ModifiedComponent = StateProvider(WrappedComponent);
    }
    else{
        ModifiedComponent = WrappedComponent;
    }

    return class withMezzuriteClass extends React.Component{
        constructor(props){
            super(props);
                if (!window.mezzurite){
                    // capture first load
                    window.mezzurite = {};
                    MezzuriteReactUtils.createMezzuriteObject(window.mezzurite);
                    PerformanceTelemetryService.startCaptureCycle();
                }
                else{
                    MezzuriteReactUtils.createMezzuriteObject(window.mezzurite);
                }

                if (window.mezzurite.isCompatible === undefined){
                    window.mezzurite.isCompatible = PerformanceTelemetryService.compatibilityCheck();
                }
                if (!window.mezzurite.isCompatible){
                    console.warn("compatibility warning")
                    return WrappedComponent;
                }

                this.key = (this.props.location && this.props.location.key) ? this.props.location.key : MezzuriteReactUtils.makeId();
                window.performance.mark(this.key + MezzuriteConstants.componentMarkStart);

                this.displayName = MezzuriteReactUtils.getDisplayName(WrappedComponent);

                // if not using mezzurite with React Router 4, adds click handler to capture events
                if (routerNotImplemented() && !window.mezzurite.listenerExists)
                {
                    window.addEventListener('mousedown', this.clickStartCaptureCycle, {passive: true});
                    window.mezzurite.listenerExists = true;
                }                
        }
        
        /**
         * Starts capture cycle on click when no routing service instrumented
         */
        clickStartCaptureCycle(){
            PerformanceTelemetryService.captureTimings = PerformanceTelemetryService.captureTimings.bind(this);
            PerformanceTelemetryService.startCaptureCycle();
        }

        componentDidMount(){
            let el = ReactDOM.findDOMNode(this.wrappedRef)
            this.fullName = MezzuriteReactUtils.getName(this.displayName, this.key);
            window.mezzurite.elementLookup[this.fullName] = el;
            var that = this;

            const config = {
                root: null, // setting it to 'null' sets it to default value: viewport
                rootMargin: '0px'
            };
            
            if (!routerNotImplemented()){
                let observer = new IntersectionObserver(function(entries, observer) {
                    window.performance.mark(that.key + MezzuriteConstants.componentMarkEnd);
                    const entry = entries[0];
                    window.mezzurite.viewportWidth = entry.rootBounds.width;
                    window.mezzurite.viewportHeight = entry.rootBounds.height;
                    if (entry.isIntersecting){
                        window.mezzurite.vltComponentLookup[that.fullName] = true;
                    }
                    observer.unobserve(el);
                    el = null;
                }, config);
                  observer.observe(el);
            }
        }

        /**
         * Sets the ref property
         */
        setRef(){
            this.wrappedRef = this;
        }

        render(){
            window.performance.mark(this.key + MezzuriteConstants.componentMarkRenderStart);
            return (
                <ModifiedComponent {...this.props} ref={ this.setRef.bind(this) } />
        )
        }
    }
}

export { withMezzurite };