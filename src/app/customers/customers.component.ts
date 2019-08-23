import { Component, OnInit } from '@angular/core';
import { Form, FormGroup, FormControl, Validators } from '@angular/forms';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {

  public documentId = null;
  public customers = [];
  public currentStatus = 1;
  sumapromedio

  public newCustomerForm = new FormGroup({
    nombres: new FormControl('', Validators.required),
    apellidos: new FormControl('', Validators.required),
    edad: new FormControl('', Validators.required),
    cumpleanos: new FormControl('', Validators.required),
    id: new FormControl('')
  });

  constructor( private firestoreService: FirestoreService ) { 
    this.newCustomerForm.setValue({
      id: '',
      nombres: '',
      apellidos: '',
      cumpleanos: '',
      edad: ''
    });
  }

  ngOnInit() {
    this.firestoreService.getCustomers().subscribe((customersSnapshot) => {
      this.customers = [];
      customersSnapshot.forEach((customersData: any) => {
        this.customers.push({
          id: customersData.payload.doc.id,
          data: customersData.payload.doc.data()
        });
      })
      this.sumapromedio = this.sumar(this.customers)
    });
  }

  sumar(users){
    let suma:number=0
    for(let i=0;i<users.length;i++){
      suma += users[i].data.edad
    } 
    return Math.round(suma*1/users.length)
  }
  mostrarEdad(val): number {
    const myDate = val.target.value;
    const myDate2 = myDate.split("-");
    const newDate = myDate2[0]+"/"+myDate2[1]+"/"+myDate2[2];
    const newDate2 = new Date(newDate).getTime()
    console.log("mostrar edad: ", newDate2 )
    console.log("paso: ",Date.now())

    if (val.target.value) {
        var timeDiff = Math.abs(Date.now() - newDate2);
        console.log("timeDiff: ",timeDiff)
        console.log("math: ", (Math.ceil((timeDiff / (1000 * 3600 * 24)) / 365))-1)
        return (Math.ceil((timeDiff / (1000 * 3600 * 24)) / 365))-1;
    } else {
        return null;
    }
    //return ~~((Date.now() - newDate2 || Date.now()) / (24 * 3600 * 365.25 * 1000));
  }
  public newCustomer(form, documentId = this.documentId) {
    console.log(`Status: ${this.currentStatus}`);
    if (this.currentStatus == 1) {
      let data = {
        nombres: form.nombres,
        apellidos: form.apellidos,
        edad: form.edad,
        cumpleanos: form.cumpleanos,
        id:form.id
      }
      this.firestoreService.createCustomer(data).then(() => {
        console.log('Documento creado exitósamente!');
        this.newCustomerForm.setValue({
          nombres: '',
          apellidos: '',
          edad: '',
          cumpleanos: '',
          id: ''
        });
      }, (error) => {
        console.error(error);
      });
    } else {
      let data = {
        nombres: form.nombres,
        apellidos: form.apellidos,
        edad: form.edad,
        cumpleanos: form.cumpleanos,
        id:form.id
      }
      this.firestoreService.updateCustomer(documentId, data).then(() => {
        this.currentStatus = 1;
        this.newCustomerForm.setValue({
          nombres: '',
          apellidos: '',
          edad: '',
          cumpleanos: '',
          id: ''
        });
        console.log('Documento editado exitósamente');
      }, (error) => {
        console.log(error);
      });
    }
  }

  public editCustomer(documentId: string) {
    let editSubscribe = this.firestoreService.getCustomer(documentId).subscribe((customer) => {
      this.currentStatus = 2;
      this.documentId = documentId;
      this.newCustomerForm.setValue({
        id: documentId,
        nombres: customer.payload.data().nombres,
        apellidos: customer.payload.data().apellidos,
        edad: customer.payload.data().edad,
        cumpleanos: customer.payload.data().cumpleanos
      });
      editSubscribe.unsubscribe();
    });
  }

  public deleteCustomer(documentId) {
    this.firestoreService.deleteCustomer(documentId).then(() => {
      console.log('Documento eliminado!');
    }, (error) => {
      console.error(error);
    });
  }

}
