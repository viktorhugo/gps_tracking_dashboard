import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  public subjectTracking = new Subject<{ latitude: number, longitude: number }>();
  public socket: WebSocket | undefined;
  public intervalReconnect: any;
  public wsURL: string | undefined;
  public intervalPingPong: string | number | NodeJS.Timeout | undefined;
  private backOfficeID = uuidv4();
  private WSS = 'ws://localhost:8082'

  constructor() {}

  public connectWs() {
    // Connect with Websocket
    if (this.socket) { this.socket.close(); }
    this.wsURL = `${this.WSS}?dashboardId=${this.backOfficeID}`;
    this.socket = new WebSocket(this.wsURL);

    this.socket.onopen = () => {
      console.log(`✅ 🚀  Connected To WSS PrivateAPI` );
      // tslint:disable-next-line:no-console
      // clear interval if reconnect ws
      if ( this.intervalReconnect ) { clearInterval(this.intervalReconnect); }
        // on message;
      this.socket!.onmessage = (dataWs) => {
        console.log(dataWs);
        const { event, data } = JSON.parse(dataWs.data);

        if (event === 'dashboard-send-location') {
          // console.log('subscriber Subject dashboard-send-location', data);
          this.subjectTracking.next(data);
        }
      };
      // get Users connected
      // this.getUsers();

      this.pingPong();
      this.intervalPingPong =  setInterval(() => {
        // Send a PING every 25 seconds
        this.pingPong();
      }, 25000);

      this.socket!.onclose = () => {
        console.log('🔴 🔴 🔴  Disconnected To WSS PrivateAPI' + this.WSS);
        // clear SetTimeOut
        if (this.intervalPingPong) {
          clearInterval(this.intervalPingPong);
        }
        this.intervalReconnect =  setInterval(() => { this.connectWs(); } , 3000);
      };
    };
    this.socket.onerror = (error) => { 
      console.log(error);
    }
  }

  public sendMessagePrivateApi(event: string, type: string, msg: string,  ) {
    this.socket!.send( JSON.stringify({ event, data: { type,  CollectionID: msg } }) );
  }

  public pingPong() {
    this.socket!.send( JSON.stringify({ event: 'ping' }) );
  }

}
