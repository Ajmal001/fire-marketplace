import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {
  productSlug: string;
  conversation: any;
  newMessage: string;
  noMessages = false;
  product: any;
  seller: any;
  buyer: any;
  responder: any;
  currentUser: any;

  constructor(
    public firestore: AngularFirestore,
    public route: ActivatedRoute,
    public authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.seller = {};
    this.buyer = {};

    this.route.params.subscribe(params => {
      this.productSlug = params.product;
      this.seller.username = params.seller;
      this.buyer.username = params.buyer;

      this.authService.user.subscribe((currentUser) => {
        this.currentUser = currentUser;
        this.fetchProduct();
      });
    });
  }

  fetchConversation(): void {
    this.firestore.collection('conversations', ref => ref
      .where('product.slug', '==', this.product.slug)
      .where('seller', '==', this.seller.username)
      .where('buyer', '==', this.buyer.username))
      .snapshotChanges()
      .subscribe((conversation) => {
        if (conversation.length) {
          this.conversation = conversation[0].payload.doc.data();
          this.conversation.id = conversation[0].payload.doc.id;
        } else {
          this.conversation = {};
          this.noMessages = true;
        }
    });
  }

  fetchProduct(): void {
    this.firestore.collection('products', ref => ref.where('slug', '==', this.productSlug))
      .valueChanges()
      .subscribe((product) => {
        if (product.length) {
          this.product = product[0];
          this.fetchConversation();
        }
    });
  }

  sendMessage(): void {
    const message = {
      user: this.currentUser.username,
      message: this.newMessage,
      createdAt: new Date(),
    };
    if (this.noMessages) {
      this.firestore
        .collection('conversations')
        .add({
          product: {
            name: this.product.name,
            price: this.product.price,
            sold: this.product.sold,
            slug: this.product.slug,
          },
          seller: this.seller.username,
          buyer: this.buyer.username,
          messages: [message]
        }).then((response) => {
          console.log('message sent', response);
          this.noMessages = false;
        });
    } else {
      this.conversation.messages.push(message);
      this.firestore
        .collection('conversations')
        .doc(this.conversation.id)
        .update({ messages: this.conversation.messages });
    }
    this.newMessage = '';
  }
}
