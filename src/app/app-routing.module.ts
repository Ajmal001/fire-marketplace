import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductsComponent } from './products/products.component';
import { ProductComponent } from './product/product.component';
import { SellComponent } from './sell/sell.component';
import { ProfileComponent } from './profile/profile.component';
import { MessagesComponent } from './messages/messages.component';
import { MessageComponent } from './message/message.component';

const routes: Routes = [
  { path: '', component: ProductsComponent },
  { path: 'sell', component: SellComponent },
  { path: 'product/:slug', component: ProductComponent },
  { path: 'user/:username', component: ProfileComponent },
  { path: 'messages', component: MessagesComponent },
  { path: 'message/:product/:seller/:buyer', component: MessageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
