import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class FirestoreService {
  
  constructor(
    private firestore: AngularFirestore
  ) {}

  //Crea un nuevo cliente
  public createCustomer(data: 
    {nombres: string, apellidos: string, edad: number, cumpleanos:Date}){
    return this.firestore.collection('customers').add(data);
  }

  //Obtiene un cliente
  public getCustomer(documentId: string) {
    return this.firestore.collection('customers').doc(documentId).snapshotChanges();
  }

  //Obtiene todos los clientes
  public getCustomers() {
    return this.firestore.collection('customers').snapshotChanges();
  }

  //Actualiza un cliente
  public updateCustomer(documentId: string, data: any) {
    return this.firestore.collection('customers').doc(documentId).set(data);
  }

  //Borra un cliente
  public deleteCustomer(documentId: any) {
    return this.firestore.collection('customers').doc(documentId).delete();
  }

}
