import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Socket, io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private socket: Socket  
  private url = 'http://localhost:3000';

  constructor() { 
    this.socket = io(this.url, {transports:['websocket','pulling','flashsocket']})
  }

  joinRoom(userId:any):void{
    this.socket.emit('new-user-add', userId)        
  }

  sendMessage(data:any):void{    
    this.socket.emit('message',data)
  }

  getMessage():Observable<any>{
    return new Observable< {user:string, message:string}>(observer => {
      this.socket.on('new-message',(data) => {
        console.log(data, "From getMessage")
        observer.next(data)
      })
      return () => {
        this.socket.disconnect();
      }
    })
  }

  getStorage(){
    const storage = localStorage.getItem('chats')
    return storage? JSON.parse(storage):[]
  }
  setStorage(data:any){
    localStorage.setItem('chats',JSON.stringify(data))
  }
}
