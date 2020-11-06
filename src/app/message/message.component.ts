import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
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
    console.log('this.product', this.product);
    console.log('this.seller', this.seller);
    console.log('this.buyer', this.buyer);
    this.firestore.collection('conversations', ref => ref
      .where('product', '==', this.product.slug)
      .where('sellerId', '==', this.seller.uid)
      .where('buyerId', '==', this.buyer.uid))
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

          if (this.currentUser) {
            if (this.currentUser.username === this.buyer.username) {
              this.buyer = this.currentUser;
              this.fetchUser('seller');
            } else {
              this.seller = this.currentUser;
              this.fetchUser('buyer');
            }
          }
        }
    });
  }

  fetchUser(userRole: string): void {
    console.log('userRole', this[userRole].username);
    this.firestore
      .collection('users', ref => ref.where('username', '==', this[userRole].username))
      .snapshotChanges()
      .subscribe((user) => {
        this[userRole] = user[0].payload.doc.data();
        this[userRole].uid = user[0].payload.doc.id;
        console.log('this[userRole]', this[userRole]);
        this.fetchConversation();
    });
  }

  sendMessage(): void {
    const message = {
      user: this.currentUser.uid,
      message: this.newMessage,
      createdAt: new Date(),
    };
    if (this.noMessages) {
      this.firestore
        .collection('conversations')
        .add({
          product: this.productSlug,
          sellerId: this.seller.uid,
          buyerId: this.buyer.uid,
          messages: [message]
        }).then((response) => {
          console.log('message sent', response);
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
