import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sell',
  templateUrl: './sell.component.html',
  styleUrls: ['./sell.component.scss']
})
export class SellComponent implements OnInit {
  name: string;
  description: string;
  price: number;
  user: any;
  productsCollectionRef: any;
  userProductsCollectionRef: any;

  constructor(
    public firestore: AngularFirestore,
    public authService: AuthService,
    public router: Router,
  ) { }

  ngOnInit(): void {
    this.productsCollectionRef = this.firestore.collection('products');
    this.userProductsCollectionRef = this.firestore.collection('user-products');
    this.authService.user.subscribe((u) => {
      this.user = u;
    });
  }

  createProduct(): void {
    const slug = this.slugify(this.name);
    const data = {
      name: this.name,
      description: this.description,
      price: this.price,
      sellerId: this.user.uid,
      sold: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      slug,
    };
    this.productsCollectionRef.add(data).then((response) => {
      this.name = '';
      this.description = '';
      this.price = undefined;
      this.router.navigateByUrl(`/product/${slug}`);
    });
  }

  slugify(text: string): string {
    return text
      .toString()
      .toLowerCase()
      .normalize('NFD')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-');
  }

}
