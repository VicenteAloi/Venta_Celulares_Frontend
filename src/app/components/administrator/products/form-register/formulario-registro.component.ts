import { Component, ElementRef, EventEmitter, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { brand } from 'src/app/interfaces/brand';
import { user } from 'src/app/interfaces/user';
import { BrandsService } from 'src/app/services/brands.service';
import { ProductService } from 'src/app/services/product.service';
import { UserService } from 'src/app/services/user.service';



@Component({
  selector: 'app-formulario-registro',
  templateUrl: './formulario-registro.component.html',
  styleUrls: ['./formulario-registro.component.scss']
})
export class FormularioRegistroComponent  {
  @Output() hideModal = new EventEmitter<boolean>();
  //PARTE DEL ALERT
  Admin!: user;
  //previalization card ngModal
  model:string="";
  brand:string="";
  price:number =0;
  description:string="";
  stock:number=0;
  
  brands:brand[] = []
  //FORMULARIO Y USO DE SERVICE
  productForm!: FormGroup;
  constructor(private productoS: ProductService, public fb: FormBuilder, private userService: UserService, private brandsService:BrandsService,private modalService: BsModalService, private toastr: ToastrService, private router: Router) {
    this.initForm();
    this.userService.getThisUserBehaviour().subscribe((value) => this.Admin = value);
    this.brandsService.getBrands().subscribe((value)=> this.brands = value);
  }
  imageBlob: File | undefined;
  @ViewChild('fileInput', { static: false })
  fileInput!: ElementRef;

  onFileUpload() {
    this.imageBlob = this.fileInput.nativeElement.files[0];
    this.productForm.patchValue({
      file: this.imageBlob
    });
    this.productForm.get('file')?.updateValueAndValidity();
  }

  retriveBrands(){
    this.brandsService.getBrands().subscribe((value)=> this.brands = value);
  }

  registrarForm() {
    const formData = new FormData();
    formData.append('model', this.productForm.get('model')?.value);
    formData.append('idBrand', this.productForm.get('idBrand')?.value.toString());
    formData.append('description', this.productForm.get('description')?.value);
    formData.append('price', this.productForm.get('price')?.value);
    formData.append('stock', this.productForm.get('stock')?.value);
    formData.append('file', this.productForm.get('file')?.value);
    this.productoS.postProducto(formData, this.Admin.id!).subscribe({
    next: () => {
        this.productoS.retraiveProducts();
         this.productoS.getProductsByPage(1);
         this.toastr.success(`Producto registrado correctamente (added: ${new Date().toLocaleTimeString()})`)
       },
       error: (error) => {
        this.toastr.error(error)
       },
    complete: () => {
      this.router.navigate(['/admin/products'])
    }
     });
    this.initForm();

  }
  

  getNameBrand(idBrand:string){
    return this.brands.find((element)=> element.idBrand == Number(idBrand))?.name
  }

  modalRef?: BsModalRef;
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  initForm(){
    this.productForm = this.fb.group({
      model: ['', [Validators.required]],
      idBrand: ['',[Validators.required]],
      price: ['', [Validators.required]],
      stock: ['', [Validators.required]],
      description: ['', [Validators.required,Validators.maxLength(140)]],
      file: [null, [Validators.required]]
    });
  }
}

