import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
  sellConversations: Array<any>;
  buyConversations: Array<any>;
  currentUser: any;

  constructor(
    public firestore: AngularFirestore,
    public authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.authService.user.subscribe((currentUser) => {
      this.currentUser = currentUser;
      if (this.currentUser) {
        this.fetchConversations();
      }
    });
  }

  fetchConversations(): void {
    this.firestore.collection('conversations', ref => ref
      .where('seller', '==', this.currentUser.username))
      .valueChanges()
      .subscribe((sellMessagesResponse) => {
        this.sellConversations = sellMessagesResponse;

        this.firestore.collection('conversations', ref => ref
          .where('buyer', '==', this.currentUser.username))
          .valueChanges()
          .subscribe((buyMessagesResponse) => {
            this.buyConversations = buyMessagesResponse;
          });
      });
  }

  getConversationRoute(conversation: any): string {
    return `/message/${conversation.product.slug}/${conversation.seller}/${conversation.buyer}`;
  }

  getResponder(conversation: any): string {
    return conversation.seller === this.currentUser.username ? conversation.buyer : conversation.seller;
  }
}
