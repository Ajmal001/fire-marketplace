import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { auth } from 'firebase/app';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  usersCollectionRef: any;
  authUser: any;

  constructor(
    public firestore: AngularFirestore,
    public fireauth: AngularFireAuth,
    public authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.usersCollectionRef = this.firestore.collection('users');
  }

  login(): void {
    this.fireauth.signInWithPopup(new auth.GoogleAuthProvider())
      .then((res) => {
      this.authUser = res.user;
      console.log('user', this.authUser);
      this.saveUser();
    });
  }

  logout(): void {
    this.fireauth.signOut();
  }

  saveUser(): void {
    const data = {
      email: this.authUser.email,
      displayName: this.authUser.displayName,
      username: this.authUser.email.split('@')[0],
      photo: this.authUser.photoURL,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.usersCollectionRef.doc(this.authUser.uid).set(data);
  }
}
