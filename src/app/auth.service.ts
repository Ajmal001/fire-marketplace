import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public user = new BehaviorSubject(null);

  constructor(
    public fireauth: AngularFireAuth,
    public firestore: AngularFirestore,
  ) {
    this.fireauth.authState.subscribe((user: any) => {
      this.firestore.collection('users').doc(user.uid).valueChanges().subscribe((userRef: any) => {
        const currentUser = user;
        currentUser.username = userRef.username;
        this.user.next(currentUser);
      });
    });
  }
}
