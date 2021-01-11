import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/user.service';
import { Router } from "@angular/router";
import { HttpClient, HttpHeaders, HttpRequest, HttpEventType } from "@angular/common/http";
import { NgForm } from '@angular/forms';
import { UploadResponse } from '../shared/uploadResponse.model';
import {FileUploadService} from '../shared/file-upload.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-moment-add-edit-profile',
  templateUrl: './moment-add-edit.component.html',
  styleUrls: ['./moment-add-edit.component.css']
})
export class MomentAddEditComponent implements OnInit {
  userDetails;
  filePaths : [];
  noAuthHeader = { headers: new HttpHeaders({ 'NoAuth': 'True' }) };
   //formData = new FormData();
   title:string;
   tag:string;
   baseFilePath = "D:/5D_Project/angular\MEAN-Stack-Login-and-Logout-in-Angular-6-Part-2-master/server/uploads";
  constructor(private userService: UserService, private router: Router,private http: HttpClient,private fileUploadService: FileUploadService) { }

  ngOnInit() {
    this.userService.getUserProfile().subscribe(
      res => {
        this.userDetails = res['user'];
      },
      err => { 
        console.log(err);
        
      }
    );
  }

  upload: UploadResponse = new UploadResponse();
  isActive: boolean;

  onDragOver(event: any) {debugger
    event.preventDefault();
    event.stopPropagation();
    this.isActive = true;
    //console.log('Drag over');
  }

  onDragLeave(event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.isActive = false;
    //console.log('Drag leave');
  }

  onDrop(event: any) {debugger
    event.preventDefault();
    event.stopPropagation();
    let droppedFiles = event.dataTransfer.files;
    if(droppedFiles.length > 0) {
      this.onDroppedFile(droppedFiles)
    }
    this.isActive = false;
  }

  onDroppedFile(droppedFiles: any) {debugger
    let formData = new FormData();
    for(let item of droppedFiles) {
    formData.append('userfiles', item);

    }
//console.log(formData);
formData.append('title',this.title);
formData.append('tag',this.tag);
    this.fileUploadService.fileUpload(formData).subscribe(
      result => {
        this.upload = result;
        console.log(result.files != undefined);
        if(result.files != undefined){
          if(result.files.length >0){
            for(let item of result.files){
              let obj = {
                title : this.title,
                tag : this.tag,
                filePath : this.baseFilePath+item.filename,
                userId: sessionStorage.getItem('userid')
              }
             let momentObject = this.http.post(environment.apiBaseUrl+'/saveMoment',obj,this.noAuthHeader).subscribe(result=>{
               console.log(result);
             });
            }
            
          }
          
        }
        }
      
    )
  }

  uploadFiles(){
    
  }

  onSelectedFile(event: any, form:NgForm) {debugger
    if (event.target.files.length > 0) {
      this.onDroppedFile(event.target.files);
      this.title = form.value.title;
      this.tag = form.value.tag;
    }
  }

  onSubmit(form: NgForm){debugger
    console.log("ng on submit filepath: "+ this.filePaths);
  }
 
  onLogout(){
    this.userService.deleteToken();
    this.router.navigate(['/login']);
  }

}
