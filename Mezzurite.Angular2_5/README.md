# Mezzurite-Angular
**For Angular 2-5, use @microsoft/mezzurite-angular@1.x**
## Requirements:
```json
  "dependencies": {
    "@microsoft/mezzurite-core": "^1.0.1", // important!
    "@types/angular": "^1.6.51",
    "@types/jquery": "^2.0.46",
    "@types/node": "^10.12.0",
    "reflect-metadata": "^0.1.8"
  },
  "peerDependencies": {
    "@angular/common": "^2.4.0||^4.0.0 ||^5.0.0",
    "@angular/compiler": "^2.4.0||^4.0.0 ||^5.0.0",
    "@angular/core": "^2.4.0||^4.0.0 ||^5.0.0",
    "@angular/forms": "^2.4.0||^4.0.0 ||^5.0.0",
    "@angular/http": "^2.4.0||^4.0.0 ||^5.0.0",
    "@angular/platform-browser": "^2.4.0||^4.0.0 ||^5.0.0",
    "@angular/platform-browser-dynamic": "^2.4.0||^4.0.0 ||^5.0.0",
    "@angular/router": "^2.4.0||^4.0.0 ||^5.0.0",
    "core-js": "^2.4.1",
    "rxjs": "^6.2.2",
    "rxjs-compat": "^6.2.2",
    "zone.js": "^0.x"
  },
```

## Onboarding
**To use our logging library for Azure Application Insights, please install "@microsoft/applicationInsights-mezzurite" from npm**

### Basic Setup (Application Load Time)
1. Import the following modules in app.module:
```javascript
import { AngularPerfModule, RoutingService } from '@microsoft/mezzurite-angular';
```
2. In the NgModule imports, add the following:
```
Imports: [  AngularPerfModule.forRoot() ]
```
3. In the constructor of AppModule, add the following:
```javascript
export class AppModule {
  constructor(@Inject(RoutingService) private router: typeof RoutingService) {
    router.start();
  }
}
```
4. If using sub-modules inside your app, you will need to import AngularPerfModule inside each sub-module in order to give your entire app access to the Mezzurite directive:
```
Imports: [  AngularPerfModule ]
```
### Component Tracking (CLT and VLT)
Components are instrumented inside the html markup as an attribute directive:
```html
<div mezzurite component-title='MyComponentName'>
...
</div>
```
