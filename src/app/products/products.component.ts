import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  products: any;

  constructor(public firestore: AngularFirestore) { }

  ngOnInit(): void {
    this.firestore.collection('products').valueChanges().subscribe((products) => {
      this.products = products;
    });
  }
}
