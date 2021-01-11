import { Component, OnInit,ViewChild, AfterViewInit } from '@angular/core';
import { UserService } from '../shared/user.service';
import { Router } from "@angular/router";
import { removeSummaryDuplicates } from '@angular/compiler';
import { PagerService } from '../shared/page.service';
export interface PeriodicElement {
  file: string;
  title: number;
  userid: number;
  tag:string;
}


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  userDetails;
  private allItems: any;
  displayedColumns: string[] = ['filePath', 'title', 'userid'];
dataSource:any;

  constructor(private userService: UserService, private router: Router, private pagerService: PagerService) { }
  

  ngOnInit() {debugger
    // this.userService.getUserProfile().subscribe(
    //   res => {
    //     this.userDetails = res['user'];
    //   },
    //   err => { 
    //     console.log(err);
        
    //   }
    // );

    
let user = {
  userId : sessionStorage.getItem('userid')
}
    this.userService.getUserList(user).subscribe(result=>{
      console.log(result);
      this.dataSource = result;
    });

  }

 

  onLogout(){
    this.userService.deleteToken();
    sessionStorage.removeItem('userid');
    this.router.navigate(['/login']);
  }

}
