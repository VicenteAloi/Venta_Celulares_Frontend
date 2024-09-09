import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { product } from 'src/app/interfaces/product';
import { ProductService } from 'src/app/services/product.service';

interface responseProductPaginate{
  total:number,
  products: product[]
}

@Component({
  selector: 'app-produc-list',
  templateUrl: './produc-list.component.html',
  styleUrls: ['./produc-list.component.scss']
})
export class ProducListComponent implements OnInit{
  productsRegister: product[] = [];
  product!: product;
  currentPage: number = 1;
  page:number=0;
  totalPages:number[] = [];
  active: string =' ';
  disabledNext:string = '';
  disabledBack: string='';
  listProducts: product[] = [];
  object!:responseProductPaginate;
  active1:string='';
  active2:string='';
  active0:string='';
  disabled:string='';
  loading:boolean=false;

  constructor(private productoS: ProductService, private modalService: BsModalService) { }

  ngOnInit(): void {
    this.getProductByPage(this.page);
  }
  deleteProducto(indice: number) {

    const produ = this.listProducts[indice];
    this.productoS.deleteProducto(produ).subscribe({
      next: () => { this.getProductByPage(this.page) },
      error: (error) => console.log(error)
    });
    this.modalRef?.hide()


  };

  modalRef?: BsModalRef;
  openModal(template: TemplateRef<any>, index: number) {
    this.product = this.listProducts[index];
    this.modalRef = this.modalService.show(template);
  }

  openModal2(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

// Se usa para mostrar todos
  getProducts() {
    this.productoS.retraiveProducts();
    this.page=-1;
    this.loading=true;
    this.disabled='disabled'
    this.listProducts = [];
    let list: product[] = [];
    this.productoS.getProductsObs().subscribe((data: product[]) => {
      list = data;
    });
    setTimeout(() => {
      for (let i = 0; i < list.length; i++) {
        if (list[i].stock > 0) {
          this.listProducts.push(list[i]) //Agregar el producto con stock >0 al arreglo
        }
      }
      this.active0='active';
      this.active1='';
      this.active2='';
      this.disabledNext = 'disabled';
      this.disabledBack = 'disabled';
      this.loading=false;
      this.disabled=''

    }, 500);
  }

//dada una pagina
  getProductByPage(page:number){
    this.page=page
    this.loading=true;
    this.disabled='disabled'
    this.listProducts = [];
    this.productoS.getProductsByPage(page);
    this.productoS.getProductsByPageObs().subscribe((data:responseProductPaginate) => {
      this.object = data
    });
    setTimeout(() => {
      const {total, products} = this.object
      console.log(total, products)
      this.disabledBack='';
      this.disabledNext='';
      let pagesArray:number[] = [];
      let i;
      for(i=1; i< total/3; i++){
        pagesArray.push(i);
      }
      if(total%3 != 0){
        pagesArray.push(i)
      }
      this.totalPages = pagesArray
      
      if(page == this.totalPages.length){
        this.disabledNext = 'disabled'
      }
      if(page == 0){
        this.disabledBack = 'disabled'
      }
      for (let i = 0; i < products.length; i++) {

          this.listProducts.push(products[i]) //Agregar el producto con stock >0 al arreglo
        
      }
      switch (page) {
        case 0:
          this.active0='';
          this.active1='active';
          this.active2='';
          break;
        case 1:
          this.active0='';
          this.active1='';
          this.active2='active';
          break;
        default:
          break;
      }
      this.loading=false;
      this.disabled=''
    }, 1500); 
    console.log(this.totalPages)   
  }

  sendPage(page:number){
    this.getProductByPage(page);
    console.log(this.listProducts)
  }

  updateList(page:number){
    this.getProductByPage(page);
  }

}
