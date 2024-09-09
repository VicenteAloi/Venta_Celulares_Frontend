import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { product } from 'src/app/interfaces/product';
import { ProductService } from 'src/app/services/product.service';
import { Router } from '@angular/router';
import { environment } from 'src/app/environments/environments';

interface responseProductPaginate{
  total:number,
  products: product[]
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  myAppUrl: string = environment.endpoint;
  listProducts: product[] = [];
  modalRef?:BsModalRef;
  page:number=0;
  totalPages:number[] = [];
  disabledNext:string = '';
  disabledBack:string = '';
  disabled:string='';
  object!:responseProductPaginate;
  active0:string='';
  active1:string='';
  active2:string='';
  loading: boolean = false;

  constructor(private productService: ProductService,
    private modalService: BsModalService,
    private router: Router) { }

  ngOnInit(): void {
    this.disabled='disabled'
    this.productService.getProductsByPageObs().subscribe((data) => {
      this.object = data  
    });
    this.getProductByPage(this.page);
  }

  getProducts() {
    this.page=-1;
    this.disabled='disabled'
    this.listProducts = [];
    this.loading=true;
    let list: product[] = [];
    this.productService.retraiveProducts();
    this.productService.getProductsObs().subscribe((data: product[]) => {
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
      this.disabledNext = 'disabled'
      this.disabledBack='disabled';
     this.disabled=''
     this.loading=false;
    }, 1500);
    

  }

  findProduct(item: product) {
    this.productService.setProduct(item);
    this.router.navigate([`dashboard/shopping/${item.id}`])
  }

  productInfo(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }


  getUrl(image: string) {
    return `${this.myAppUrl}static/${image}`
  }

 
  async getProductByPage(page:number){
    this.page=page
    this.disabled='disabled'
    this.loading=true
    this.listProducts = [];
    this.productService.getProductsByPage(page);
    
    setTimeout(() => {
      const {total, products} = this.object
      let pagesArray:number[] = [];
      let i;
      for(i=1; i< total/8; i++){
        pagesArray.push(i);
        
      }
      if(total%3 != 0){
        pagesArray.push(i)
      }
      this.totalPages = pagesArray
      if(page == this.totalPages.length){
        this.disabledNext = 'disabled'
        this.disabledBack='';
        this.active0='';
        this.active1='';
        this.active2='active';
      }
      if(page == 0){
        this.disabledNext = ''
        this.disabledBack='disabled';
        this.active0='';
        this.active1='active';
        this.active2='';
      }
      for (let i = 0; i < products.length; i++) {
        if (products[i].stock > 0) {
          this.listProducts.push(products[i]) 
        }
       
      }
      this.disabled=''
      this.loading=false;
      console.log(this.totalPages.length)

    }, 1500);
   
    
  }

  sendPage(page:number){
    this.getProductByPage(page);
  }







}
