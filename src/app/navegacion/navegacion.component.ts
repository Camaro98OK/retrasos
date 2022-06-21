import { Component, OnInit, AfterViewInit,  ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormControlName, FormBuilder } from '@angular/forms';
import { DbDatosService } from '../services/db-datos.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort, SortDirection} from '@angular/material/sort';
import { DatosCMI } from '../interfaces/datos-cmi';
import { Unidad } from '../interfaces/unidades';
import { Estado } from '../interfaces/estados';
import { CarpetaInv } from '../interfaces/carpeta-inv';
import { MatTableDataSource } from '@angular/material/table';
import { Animal } from '../interfaces/animal';

@Component({
  selector: 'app-navegacion',
  templateUrl: './navegacion.component.html',
  styleUrls:   ['./navegacion.component.css'],
  providers: []
})

export class NavegacionComponent implements OnInit {

  animalControl = new FormControl(null, Validators.required);

  selectFormControl = new FormControl('', Validators.required);

  animals: Animal[] = [
    {name: 'Dog', sound: 'Woof!'},
    {name: 'Cat', sound: 'Meow!'},
  ];

  anio= '';
  cmiUnidad='';

  numeroCarpeta = new FormGroup({
    edo: new FormControl('', Validators.required),
    unidad: new FormControl('', Validators.required),
    numCar: new FormControl('', Validators.required),
    tipo: new FormControl('', Validators.required),
    anio: new FormControl('', Validators.required),
    cmiUnidad: new FormControl(''),
  });


  formulario2 = new FormGroup({
    tipo: new FormControl('', Validators.required),
    estadoFor : new FormControl(''),
    unidadFor: new FormControl(''),
    nuc: new  FormControl(''),
    anioFor: new FormControl(''),
  });

    miFormulario: FormControl;

      //edos: [];
    url = 'https://localhost:3000/admin';

    displayedColumns: string[] = ['estado', 'unidad'];
    unidades: MatTableDataSource<Unidad>;

    displayedColumnsEstados: string[] = ['cve', 'nombre'];
    estados: MatTableDataSource<Estado>;

    displayedColumnsCMI: string[] = ['expediente', 'oficioSolicitud', 'FechaOficio'];
    carpetasCMI: MatTableDataSource<DatosCMI>;

    displayedColumnsCarpetasUNI: string[] = ['NumCar', 'FechaCi', 'EdoOri'];
    carpetasInvestigacionUni: MatTableDataSource<CarpetaInv>;
    respuestas = '';

    estadosCat: Estado[] = [];
    unidadCat: Unidad[] = [];

    constructor(private DbDatosService: DbDatosService, private http: HttpClient, private formBuilder: FormBuilder) {

      }

    ngOnInit(): void {

      this.getUnidades();
      this.getEstados();
      //this.getCarpetaInvestigacion();
      //this.getCarpetaInvestigacionUniverso();
    }

    onSubmit() {
      console.log(this.formulario2.value);
      this.getCarpetaInvestigacion();
    }

     getUnidades() {
      this.DbDatosService.getUnidad().subscribe(resp => {
           //this.unidades = new MatTableDataSource(resp);
           this.unidadCat = resp;
           //console.log(resp);
      })
    }

    getEstados() {
      this.DbDatosService.getEstados().subscribe(resEstados => {
        //this.estadosCat = new MatTableDataSource(resEstados);
        this.estadosCat = resEstados;
        //console.log(resEstados);
      })
    }


  getCarpetaInvestigacion() {
    const header = new HttpHeaders().set('Type-conten', 'aplication-json');
    console.log(this.formulario2.value);
    this.http.post(`${this.url}/ci`,
        {
          tipo: this.formulario2.value.tipo,
          edo: this.formulario2.value.estadoFor,
          unidad: this.formulario2.value.unidadFor,
          numCar: this.formulario2.value.nuc,
          anio: this.formulario2.value.anioFor,
        } ,
        {headers: header}).subscribe((datosCmi: any) =>{
          //this.respuestas = JSON.stringify(datosCmi);
          this.carpetasCMI = new MatTableDataSource(datosCmi);

          console.log(datosCmi);

          //console.log('v1: '+ this.numeroCarpeta.value.tipo);
          //console.log('v2: '+ this.numeroCarpeta.value.edo);
          //console.log('v3: '+ this.numeroCarpeta.value.unidad);
          //console.log('v4: '+ this.numeroCarpeta.value.numCar);
          //console.log('v5: ' + this.numeroCarpeta.value.anio);
          //console.log(this.anios);
        });
  }

  getCarpetaInvestigacionUniverso() {
    const header = new HttpHeaders().set('Type-conten', 'aplication-json');
    this.http.post(`${this.url}/ciuniverso`,
    {
      tipo: 'FED',  //this.numeroCarpeta.value.tipo,
      edo: 'JAL',  //this.numeroCarpeta.value.edo,
      unidad: 'LMRENO',  //this.numeroCarpeta.value.unidad,
      numCar: '0002209',  //this.numeroCarpeta.value.numCar,
      anio: '2019',  //this.numeroCarpeta.value.anio,
    },
    {headers: header}).subscribe((datosCIU: any) => {
      console.log(datosCIU);
      this.carpetasInvestigacionUni = new MatTableDataSource(datosCIU);
    });
  }
}
