import { bootstrapApplication } from '@angular/platform-browser';
import * as L from 'leaflet';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
L.Icon.Default.imagePath = 'assets/leaflet/';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
