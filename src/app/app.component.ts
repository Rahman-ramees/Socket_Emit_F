import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { ChatService } from './Service/chat.service';

interface StorageArrayItem {
  roomId: string;
  chats: any[]; 
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit, AfterViewChecked{
  title = 'Socketio-Frontend';

 
  storageArray: StorageArrayItem[] = [];
  roomId: string = '';
  messageText: string = '';
  messageArray: {user: string, message: string ,phone:string, senderPhone:string}[] = [];

  showScreen: boolean = false;
  
  currentUser: any;
  selectedUser: any;
  selectedUserPhone: any = '';
  selectedUserName: any = '';
  currentUserName: any = '';

  public userList = [
    {
      id: 1,
      name: 'rahman',
      phone: '1', // Enclose phone number in quotes to treat it as a string
      image: './../assets/1682679683101_HDwallpaperkakashihatakenarutodarkblackart.avif',
    },
    {
      id: 2,
      name: 'sarbas',
      phone: '2', // Enclose phone number in quotes to treat it as a string
      image: './../assets/download.jpeg',
    },
    {
      id: 3,
      name: 'anshed',
      phone: '3', // Enclose phone number in quotes to treat it as a string
      image: './../assets/images (1).jpeg',
    },
    {
      id: 4,
      name: 'sachin',
      phone: '4', // Enclose phone number in quotes to treat it as a string
      image: './../assets/images.jpeg',
    }
  ];

  constructor(private chatService: ChatService) {
    chatService.getMessage().subscribe((data: { user: string, message: string, phone:string, senderPhone:string}) => {
      // this.messageArray.push(data)      
      const receivedMessage = {
        user: data.user,
        message: data.message,
        phone: data.phone,
        senderPhone:data.senderPhone
      };
      this.messageArray.push(receivedMessage);
    });
  }

  ngOnInit(): void {
    this.currentUser = this.userList[0];
  }

  ngAfterViewChecked(): void {

  }

  login(dismiss:any) {
    const inputval = prompt('Enter your name:');
    this.selectedUserPhone = inputval
    this.currentUser = this.userList.find(user => user.phone === this.selectedUserPhone.toLowerCase())    
    this.userList = this.userList.filter((user)=>user.phone !== this.selectedUserPhone.toLowerCase())  
      
    this.showScreen = true
    this.chatService.joinRoom(this.selectedUserPhone)
  }

  filteredUsers: { user: string; phone: string; message: string }[] = [];

  selectUserHandler(phone: string, name: string): void {
    this.selectedUserPhone = phone
    this.selectedUserName = name
    this.currentUserName = this.currentUser.name
    this.selectedUser = this.userList.find(user => user.phone === phone.toLowerCase())    
  }

  join(userName: string, roomId: string): void {
    this.chatService.joinRoom({ user: userName, room: roomId });
  }

  sendMessage(): void {
      
      const messageData = {
        user: this.selectedUser,
        phone: this.selectedUserPhone,
        senderPhone: this.currentUser.phone,
        message: this.messageText
      };

      this.chatService.sendMessage(messageData);
      this.messageArray.push(messageData);
      
      this.messageText = '';
  }

  
}