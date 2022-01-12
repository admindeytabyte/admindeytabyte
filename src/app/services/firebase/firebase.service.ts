import { Injectable } from '@angular/core';
import { map } from 'rxjs/internal/operators';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  itemsRef: AngularFireList<any>;

  constructor(private db: AngularFireDatabase) { }

  // get all items
  getItems(itemsName: string) {
    this.itemsRef = this.db.list(itemsName);

    return this.itemsRef.snapshotChanges().pipe(
      map(changes =>
        changes.map(c => c.payload.val())
      )
    );
  }
}
