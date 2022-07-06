import { Component, OnInit, AfterViewInit,  ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormControlName, FormBuilder } from '@angular/forms';
import { DbDatosService } from '../services/db-datos.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { DatosCMI } from '../interfaces/datos-cmi';
import { Unidad } from '../interfaces/unidades';
import { Estado } from '../interfaces/estados';
import { CarpetaInv } from '../interfaces/carpeta-inv';
import { MatTableDataSource } from '@angular/material/table';
import { Animal } from '../interfaces/animal';
import  Swal from 'sweetalert2';
import { Solicitud } from '../interfaces/solicitud';
import { Fiscalia } from '../interfaces/fiscalia';
import { Delegacion } from  '../interfaces/delegacion';
import { ProductoCmi } from '../interfaces/productoCmi';
import { EspecialidadCmi } from '../interfaces/EspecialidadCmi';
import { ActoCmi } from '../interfaces/actosCmi';
import { UnidadCmi } from '../interfaces/unidadesCmi';

 @Component({
  selector: 'app-navegacion',
  templateUrl: './navegacion.component.html',
  styleUrls:   ['./navegacion.component.css'],
  providers: []
})

export class NavegacionComponent implements OnInit, AfterViewInit  {

 selectFormControl = new FormControl('', Validators.required);

  anio= '';
  cmiUnidad='';

  /*numeroCarpeta = new FormGroup({
    edo: new FormControl('', Validators.required),
    unidad: new FormControl('', Validators.required),
    numCar: new FormControl('', Validators.required),
    tipo: new FormControl('', Validators.required),
    anio: new FormControl('', Validators.required),
    cmiUnidad: new FormControl(''),
  });
  */


  formulario2 = new FormGroup({
    tipo: new FormControl('', Validators.required),
    estadoFor : new FormControl(''),
    unidadFor: new FormControl(''),
    nuc: new  FormControl(''),
    anioFor: new FormControl(''),
  });

  frmRetrasos = new FormGroup({
    fiscaliaFor: new FormControl('', Validators.required),
    areaCMIFor: new FormControl('', Validators.required),
  })

    miFormulario: FormControl;

      //edos: [];
    url = 'https://localhost:3000/admin';

    displayedColumns: string[] = ['estado', 'unidad'];
    unidades: MatTableDataSource<Unidad>;

    displayedColumnsEstados: string[] = ['cve', 'nombre'];
    estados: MatTableDataSource<Estado>;

    displayedColumnsCMI: string[] = ['expediente', 'oficioSolicitud', 'FechaOficio', 'origen', 'estatusSolicitud'];
    carpetasCMI: MatTableDataSource<DatosCMI>;

    displayedColumnsCarpetasUNI: string[] = ['NumCar', 'FechaCi', 'EdoOri'];
    carpetasInvestigacionUni: MatTableDataSource<CarpetaInv>;

    displayedColumnsSolicitudesCMI: string[] = ['Fiscalia',  'Delegacion',  'Número de Carpeta',  'Fecha Inicio',
      'Oficio Solicitud',  'Fecha Acuse de Oficio',  'Areas del AIC',  'Solicitud',  'Tiempo de Ejecucion',
      'Estatus de Atencion',  'Atención',  'Oficio Recordatorio SI/NO',  'Oficio de Recordatorio',  'Fecha de Oficio Rec',
      'Observaciones' ] ;

    respuestas = '';

    estadosCat: Estado[] = [];
    unidadCat: Unidad[] = [];
    fiscaliasCat: Fiscalia[] = [];
    delegacionesCat: Delegacion[] = [];

    productosCat: ProductoCmi[] = [];
    especialidadCat: EspecialidadCmi[] = [];
    actoInvestCat: ActoCmi[] = [];
    unidadCMICat: UnidadCmi[] = [];

    productosCatB = false;
    idAP = 0;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    procesando = false;

    constructor(private DbDatosService: DbDatosService, private http: HttpClient, private formBuilder: FormBuilder) {
      }

    ngOnInit(): void {

      this.getUnidades();
      this.getEstados();
      this.getFiscalias();
      this.getAreasCMI();
      this.getEspecialidadCMI();
      this.getProductosCMI();
      this.getActosInvestigacionCMI();
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
      });
    }

    getAreasCMI() {
      this.DbDatosService.getAreasCMI().subscribe(resp => {
        this.unidadCMICat = resp;
      });
    }

    getActosInvestigacionCMI(){
      this.DbDatosService.getActosCmi().subscribe(resp =>{
        this.actoInvestCat = resp;
      });
    }

    getEspecialidadCMI(){
      this.DbDatosService.getEspecialidadesCmi().subscribe(resp => {
        this.especialidadCat = resp;
      });
    }

    getProductosCMI() {
      this.DbDatosService.getProductosCmi().subscribe(resp => {
        this.productosCat = resp;
      });
    }

    getEstados() {
      this.DbDatosService.getEstados().subscribe(resEstados => {
        //this.estadosCat = new MatTableDataSource(resEstados);
        this.estadosCat = resEstados;
        //console.log(resEstados);
      })
    }

    getFiscalias() {
      this.DbDatosService.getFiscalia().subscribe(resFiscalias => {
        this.fiscaliasCat = resFiscalias;
        console.log(resFiscalias);
      })
    }

    getDelegaciones() {
      console.log(this.frmRetrasos.value);
      let id = this.frmRetrasos.value.fiscaliaFor;
      console.log('El valor del id seleccionado es: ');
      console.log(id);
      this.DbDatosService.getDelegaciones(id).subscribe(resDelegaciones =>{
        this.delegacionesCat = resDelegaciones;
        console.log(resDelegaciones);
      })
    }

    getActoProducto() {
      this.idAP = this.frmRetrasos.value.areaCMIFor;
      /*
        CENAPI ES 1
        CGSP ES 2
        MM ES 3
        MJ ES 4
      */
     switch(this.idAP) {
      case 1:
        this.DbDatosService.getActosCmi().subscribe(resActoscCENAPI =>{
          this.actoInvestCat = resActoscCENAPI;
          console.log(resActoscCENAPI);});
          break;
      case 2:
        this.DbDatosService.getEspecialidadesCmi().subscribe(resEspecialidadesCGSP => {
          this.especialidadCat = resEspecialidadesCGSP;
          console.log(resEspecialidadesCGSP);
        })
        break;
      case 3:
        this.DbDatosService.getActosCmi().subscribe(resActosMM => {
          this.actoInvestCat = resActosMM;
          console.log(resActosMM)
        })
        break;
      case 4:
        this.DbDatosService.getActosCmi().subscribe(resActosMJ => {
          this.actoInvestCat = resActosMJ;
          console.log(resActosMJ)
        })
        break
       }
    }

  getCarpetaInvestigacion() {
    const header = new HttpHeaders().set('Type-conten', 'aplication-json');
    console.log(this.formulario2.value);
    //this.onCorreSpinner();
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
        this.carpetasCMI.paginator = this.paginator;
        this.carpetasCMI.sort = this.sort;

        console.log(datosCmi);

        //console.log('v1: '+ this.numeroCarpeta.value.tipo);
        //console.log('v2: '+ this.numeroCarpeta.value.edo);
        //console.log('v3: '+ this.numeroCarpeta.value.unidad);
        //console.log('v4: '+ this.numeroCarpeta.value.numCar);
        //console.log('v5: ' + this.numeroCarpeta.value.anio);
        //console.log(this.anios);
      });
      this.getFiscalias();
      //this.getDelegaciones();
      this.getCarpetaInvestigacionUniverso();
      //this.onDetieneSpinner();
  }

  getCarpetaInvestigacionUniverso() {
    const header = new HttpHeaders().set('Type-conten', 'aplication-json');

    this.http.post(`${this.url}/ciuniverso`,
    {
      tipo: this.formulario2.value.tipo,
      edo: this.formulario2.value.estadoFor,
      unidad: this.formulario2.value.unidadFor,
      numCar: this.formulario2.value.nuc,
      anio: this.formulario2.value.anioFor,
    },
    {headers: header}).subscribe((datosCIU: any) => {
      console.log(datosCIU);

  if(datosCIU.length > 0) {
        console.log('Se encontraron : ');
        console.log(datosCIU.length);
        this.carpetasInvestigacionUni = new MatTableDataSource(datosCIU);
      } else {
        console.log('No se encontraron : ');
        this.carpetasInvestigacionUni = new MatTableDataSource(datosCIU);
      };
      this.procesando = false;
      Swal.fire('Se encontraron los siguientes registros ' + datosCIU.length, 'Presiona el botón para continuar!','success');
    });
  }

  onCorreSpinner(){
    this.procesando = true;
  }

  onDetieneSpinner(){
    this.procesando = false;
  }

  onSelectEstado() {
    console.log('Manda llamar a la consulta filtrada');
  }

  ngAfterViewInit() {
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.carpetasCMI.filter = filterValue.trim().toLowerCase();

    if (this.carpetasCMI.paginator) {
      this.carpetasCMI.paginator.firstPage();
    }
  }
}

