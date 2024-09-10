import { Component, TemplateRef } from '@angular/core';
import { AdministratorsService } from '../../../../services/administrators.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { user } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'ngx-toastr';

interface responseAdminPaginate {
  total:number,
  administrators: user[]
}

@Component({
  selector: 'app-administrators-list',
  templateUrl: './administrators-list.component.html',
  styleUrls: ['./administrators-list.component.scss']
})
export class AdministratorsListComponent {
  adminList: user[] = [];
  administrator!: user;
  user!: user;
  index?: number;
  currentPage: number = 1;
  page:number=0;
  totalPages:number[] = [];
  active1:string ='';
  active2:string ='';
  active0:string='';
  disabled:string='';
  disabledBack:string='disabled';
  disabledNext:string='';
  loading:boolean=false;

  constructor(
    private adminService: AdministratorsService, 
    private modalService: BsModalService, 
    private userService: UserService,
    private toastr: ToastrService) {
    this.findAdministrator()
  }

  ngOnInit(): void {
   this.getAdministrators(this.page);
  }
  openModal2(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  deleteAdministrator(indice: number) {
    const administrator = this.adminList[indice];
    this.adminService.deleteAdministrator(administrator).subscribe({
      next: () => this.adminService.getAdministrators(this.page),
      error: (error) => this.toastr.error(error)
    });
    this.modalRef?.hide()
  };

  modalRef?: BsModalRef;
  openModal(template: TemplateRef<any>, index: number) {
    this.administrator = this.adminList[index];
    this.modalRef = this.modalService.show(template);
  }

  findAdministrator() {
    this.userService.getThisUserBehaviour().subscribe(value => {
      this.user = value;
  })
  }



  async getAdministrators(page:number){
    this.page=page
    this.loading=true;
    this.disabled='disabled';
    let object: responseAdminPaginate;
    this.adminList = [];
    this.adminService.getAdministrators(this.page)
    .subscribe((data: responseAdminPaginate) => {
      object = data
      const {total, administrators} = object
      let pagesArray:number[] = [];
      let i;
      for(i=1; i< total/5; i++){
        pagesArray.push(i);
      }
      if(total%2 != 0){
        pagesArray.push(i)
      }
      this.totalPages = pagesArray
      for (let i = 0; i < administrators.length; i++) {
          this.adminList.push(administrators[i])
        }
        this.loading=false;
        this.disabled='';

      });
     switch (page) {
          case 0:
            this.active1 ='active';
            this.active2='';
            this.active0='';
            this.disabledNext='';
            this.disabledBack='disabled';
            break;
          case 1:
            this.active1 ='';
            this.active2='active';
            this.active0='';
            this.disabledNext='disabled';
            this.disabledBack='';
            break
          default:
            break;
        }
        
   
  }

  getAllAdministrators(){
    this.page=-1;
    this.loading=true;
    this.disabled='disabled';
    this.adminService.retraiveAdministrator().subscribe({
      next:(data: user[]) => {
        this.adminList = data
        this.loading=false;
        this.disabled='';
        this.disabledNext='disabled';
        this.disabledBack='disabled';
      },
      error:(error)=> this.toastr.error(error)
    });
    this.active1 ='';
    this.active2='';
    this.active0='active';
    
  }

}
