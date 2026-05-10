import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  emitLog(log: any) {
    this.server.emit('newLog', log);
  }

  emitNotification(notification: any) {
    this.server.emit('newNotification', notification);
  }
}
