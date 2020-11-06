import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  seller: any;
  products: Array<any>;
  username: string;

  constructor(
    public route: ActivatedRoute,
    public firestore: AngularFirestore,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      console.log('params', params);
      this.username = params.username;
      this.fetchUser();
    });
  }

  fetchUser(): void {
    this.firestore.collection('users', ref => ref.where('username', '==', this.username))
      .snapshotChanges()
      .subscribe((user) => {
        console.log('payload', user[0].payload.doc.id);
        if (user.length) {
          this.seller = user[0].payload.doc.data();
          this.seller.id = user[0].payload.doc.id;
          this.firestore.collection('products', ref => ref.where('sellerId', '==', this.seller.id))
            .valueChanges()
            .subscribe((products) => {
              console.log('products', products);
              this.products = products;
            });
        }
    });
  }

}
