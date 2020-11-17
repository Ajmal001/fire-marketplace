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
      this.username = params.username;
      this.fetchUser();
    });
  }

  fetchUser(): void {
    this.firestore.collection('users', ref => ref.where('username', '==', this.username))
      .valueChanges()
      .subscribe((user) => {
        if (user.length) {
          this.seller = user[0];
          this.fetchProducts();
        }
    });
  }

  fetchProducts(): void {
    this.firestore.collection('products', ref => ref.where('seller', '==', this.seller.username))
      .valueChanges()
      .subscribe((products) => {
        this.products = products;
      });
  }
}
