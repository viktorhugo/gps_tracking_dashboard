
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { WebSocketService } from '../services/web_socket.service';

@Component({
  selector: 'app-tracking',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tracking.component.html',
  styleUrl: './tracking.component.css'
})
export class TrackingComponent implements OnInit, AfterViewInit {
  private map!: L.Map
  markers: L.Marker[] = [
    // L.marker([31.9539, 35.9106]), // Amman
    // L.marker([32.5568, 35.8469]) // Irbid
  ];

  constructor(
    private webSocketService: WebSocketService
  ) { }

  ngOnInit() {
    this.webSocketService.connectWs();
    this.webSocketService.subjectTracking.subscribe({
      next: (data) => {
        const { latitude, longitude }= data;
        console.log(data);
        this.markers.push(L.marker([latitude, longitude]))
        this.addMarkers();
        this.centerMap();
      }, 
      error: (res) => {
        console.log(res);
      }
    })
  }

  ngAfterViewInit() {
    this.initializeMap();
    this.addMarkers();
    this.centerMap();
  }


  private initializeMap() {
    const baseMapURl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    this.map = L.map('map', {layers: this.markers});
    L.tileLayer(baseMapURl).addTo(this.map);
    this.addMarkers();
  }


  private addMarkers() {
    // Add your markers to the map
    this.markers.forEach(marker => marker.addTo(this.map));
  }

  private centerMap() {
    if (this.markers.length > 0) {
      // Create a LatLngBounds object to encompass all the marker locations
      const bounds = L.latLngBounds(this.markers.map(marker => marker.getLatLng()));
      
      // Fit the map view to the bounds
      this.map.fitBounds(bounds);
    }
  }
}