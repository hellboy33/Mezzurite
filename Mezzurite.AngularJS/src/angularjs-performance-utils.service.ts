// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { MezzuriteUtils } from "@microsoft/mezzurite-core";
import {environment} from "./angularjs-environment";

/**
 * Extension of Mezzurite Utilities that gets package specific information
 */
export class MezzuriteAngularJsUtils extends MezzuriteUtils{

    static createMezzuriteObject(obj: any){
        super.createMezzuriteObject(obj);
        (<any>window).mezzurite.packageVersion = environment.version;
        (<any>window).mezzurite.packageName = environment.name;
    }
}