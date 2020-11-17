import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  product: any;
  slug: string;
  currentUser: any;

  constructor(
    public firestore: AngularFirestore,
    public route: ActivatedRoute,
    public authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.slug = params.slug;
      this.fetchProduct();
    });

    this.authService.user.subscribe((user) => {
      this.currentUser = user;
      console.log('user', this.currentUser);
    });
  }

  fetchProduct(): void {
    this.firestore.collection('products', ref => ref.where('slug', '==', this.slug))
      .valueChanges()
      .subscribe((product) => {
        if (product.length) {
          this.product = product[0];
        }
    });
  }
}
