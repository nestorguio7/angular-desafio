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
  edadObtenida
  varianza

  public newCustomerForm = new FormGroup({
    nombres: new FormControl('', Validators.required),
    apellidos: new FormControl('', Validators.required),
    cumpleanos: new FormControl('', Validators.required),
    edad: new FormControl(''),
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
      this.varianza = this.ds(this.customers)
    });
  }

  sumar(users){
    let suma:number=0
    for(let i=0;i<users.length;i++){
      suma += +users[i].data.edad
      console.log("suma: ",suma)
    } 
    return Math.round(suma*1/users.length)
  }
  
  ds(num){
    var varian:number=0
    var varianSuma:number=0
    var n = num.length
    var varianza
    var desviacion
    var desviacionMaxima
    var edadPromedioMuerte
    for(let i=0;i<num.length;i++){
      varian = num[i].data.edad - this.sumapromedio
      varianSuma += Math.pow(varian, 2)
      console.log("--------------------------------")
      console.log("this.sumapromedio: ",this.sumapromedio)
      console.log("+num[i]: ",num[i].data.edad)
      console.log("varian: ",varian)
      console.log("varianSuma: ",varianSuma)
    } 
    console.log("~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~")
    console.log("Math.round(varianSuma): ",Math.round(varianSuma))
    console.log("n:", n)
    console.log("varianza:", Math.round(varianSuma)/n-1)
    varianza = Math.round(Math.round(varianSuma)/(n-1))
    desviacion = Math.round(Math.sqrt(varianza))
    desviacionMaxima = this.sumapromedio - desviacion
    edadPromedioMuerte = this.sumapromedio + desviacionMaxima
    return edadPromedioMuerte
  }

  mostrarEdad(val): number {
    const anoSelect = (val.target.value).split('-')[0],
    anoActual = new Date()
    this.edadObtenida = anoActual.getFullYear() - anoSelect
  }
  

  public newCustomer(form, documentId = this.documentId) {
    console.log(`Status: ${this.currentStatus}`);
    if (this.currentStatus == 1) {
      let data = {
        nombres: form.nombres,
        apellidos: form.apellidos,
        edad: this.edadObtenida,
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
        edad: this.edadObtenida,
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
