import { UserService } from './../../services/user.service';

import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-settings-dailog',
  templateUrl: './settings-dailog.component.html',
  styleUrls: ['./settings-dailog.component.scss']
})
export class SettingsDailogComponent implements OnInit {
  errorMessage: any;
  cities: any[];
  provinces: any[];
  countries: any[];
  categories: any[];
  shippingZones: any[];
  chargeTypes: any[];
  paymentTypes: any[];
  deliveryModes: any[];
  salesPeople: any[];
  headers: any[];
  header: any;
  salesPersonId = 0;
  user: any;

  constructor(@Inject(MAT_DIALOG_DATA)
  private dialog: MatDialog,
    private mdDialogRef: MatDialogRef<SettingsDailogComponent>,
    private dataService: DataService,
    private toastr: ToastrService,
    private userService: UserService,) {
    mdDialogRef.disableClose = true;
  }

  ngOnInit() {
    this.user = this.userService.getUser();
    this.refreshStatics();
  }

  refreshStatics() {
    this.dataService.getStatics(this.user.companyId).subscribe(data => {
      this.categories = data.categories;
      this.provinces = data.provinces;
      this.shippingZones = data.zones;
      this.chargeTypes = data.chargeTypes;
      this.paymentTypes = data.paymentTypes;
      this.salesPeople = data.salesPeople;
      this.countries = data.countries;
      this.deliveryModes = data.deliveryModes;
      this.cities = data.cities;
      this.headers = data.headers;
      this.header = data.headers.filter(f => f.id === data.companyId)[0];
    });
  }

  headerForm_fieldDataChanged(e) {
    this.header = e.component.option('formData');
  }

  SaveHeaderClicked($event) {
    this.dataService.UpdateHeader(this.header).subscribe(
      (response) => {
        this.toastr.success('Header Updated Successfully!', 'Success', {
          timeOut: 2000,
        });
      },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error('Header Update Failed');
      }
    );
  }

  // Sales Person
  salesPersonAdded(e: { data: any }) {
    e.data.salesPersonId = 0;
    e.data.companyId = this.user.companyId;
    this.dataService.AddSalesPerson(e.data).subscribe(
      (response) => {
        this.toastr.success('Sales Person Added Successfully!', 'Success', {
          timeOut: 3000,
        });
        // Update Key of added entity from response object
        e.data.salesPersonId = response['salesPersonId'];
      },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error(error.error, 'Sales Person Add Failed');
      }
    );
  }

  salesPersonUpdated(e: any) {
    this.dataService.UpdateSalesPerson(e.data).subscribe(
      (response) => {
        this.toastr.success('Sales Person Updated Successfully!', 'Success', {
          timeOut: 3000,
        });
      },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error(error, 'Sales Person Update Failed');
      }
    );
  }

  salesPersonDeleted(e: any) {
    this.dataService.DeleteSalesPersons(e.data.salesPersonId).subscribe(
      (response) => {
        this.toastr.success('Sales Person Deleted Successfully!', 'Success', {
          timeOut: 3000,
        });
      },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error('Sales Person Failed ' + this.errorMessage);
        this.refreshStatics();
      }
    );
  }

  salesCommissionAdded(e: { data: any }) {
    e.data.id = 0;
    e.data.salesPersonId = this.salesPersonId;
    this.dataService.AddSalesCommission(e.data).subscribe(
      (response) => {
        this.toastr.success('Sales Commission Added Successfully!', 'Success', {
          timeOut: 3000,
        });
        // Update Key of added entity from response object
        e.data.id = response['id'];
      },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error(error.error, 'Sales Commission Add Failed');
      }
    );
  }

  salesCommissionUpdated(e: any) {
    this.dataService.UpdateSalesCommission(e.data).subscribe(
      (response) => {
        this.toastr.success('Sales Commission Updated Successfully!', 'Success', {
          timeOut: 3000,
        });
      },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error(error, 'Sales Commission Update Failed');
      }
    );
  }

  salesCommissionDeleted(e: any) {
    this.dataService.DeleteSalesCommission(e.data.id).subscribe(
      (response) => {
        this.toastr.success('Sales Commission Deleted Successfully!', 'Success', {
          timeOut: 3000,
        });
      },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error('Sales Person Failed ' + this.errorMessage);
        this.refreshStatics();
      }
    );
  }

  salesPersonFocusChanged(e) {
    this.salesPersonId = e.row.data.salesPersonId;
  }

  // DeliveryModes
  deliveryModeAdded(e: { data: any }) {
    e.data.deliveryModeId = 0;
    this.dataService.AddDeliveryMode(e.data).subscribe(
      (response) => {
        this.toastr.success('DeliveryMode Added Successfully!', 'Success', {
          timeOut: 3000,
        });
        // Update Key of added entity from response object
        e.data.deliveryModeId = response['deliveryModeId'];
      },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error(error.error, 'DeliveryMode Add Failed');
      }
    );
  }

  deliveryModeUpdated(e: any) {
    this.dataService.UpdateDeliveryMode(e.data).subscribe(
      (response) => {
        this.toastr.success('DeliveryMode Updated Successfully!', 'Success', {
          timeOut: 3000,
        });
      },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error(error, 'DeliveryMode Update Failed');
      }
    );
  }

  deliveryModeDeleted(e: any) {
    this.dataService.DeleteDeliveryMode(e.data.deliveryModeId).subscribe(
      (response) => {
        this.toastr.success('DeliveryMode Deleted Successfully!', 'Success', {
          timeOut: 3000,
        });
      },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error('DeliveryMode Failed ' + this.errorMessage);
        this.refreshStatics();
      }
    );
  }

  // Shipping Zones
  shippingZoneAdded(e: { data: any }) {
    e.data.shippingZoneId = 0;
    this.dataService.AddShippingZone(e.data).subscribe(
      (response) => {
        this.toastr.success('ShippingZone Added Successfully!', 'Success', {
          timeOut: 3000,
        });
        // Update Key of added entity from response object
        e.data.shippingZoneId = response['shippingZoneId'];
      },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error(error.error, 'ShippingZone Add Failed');
      }
    );
  }

  shippingZoneUpdated(e: any) {
    this.dataService.UpdateShippingZone(e.data).subscribe(
      (response) => {
        this.toastr.success('ShippingZone Updated Successfully!', 'Success', {
          timeOut: 3000,
        });
      },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error(error, 'ShippingZone Update Failed');
      }
    );
  }

  shippingZoneDeleted(e: any) {
    this.dataService.DeleteShippingZone(e.data.shippingZoneId).subscribe(
      (response) => {
        this.toastr.success('ShippingZone Deleted Successfully!', 'Success', {
          timeOut: 3000,
        });
      },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error('ShippingZone Failed ' + this.errorMessage);
        this.refreshStatics();
      }
    );
  }

  // Provinces
  provinceAdded(e: { data: any }) {
    e.data.provinceId = 0;
    this.dataService.AddProvince(e.data).subscribe(
      (response) => {
        this.toastr.success('Province Added Successfully!', 'Success', {
          timeOut: 3000,
        });
        // Update Key of added entity from response object
        e.data.provinceId = response['provinceId'];
      },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error(error.error, 'Province Add Failed');
      }
    );
  }

  provinceUpdated(e: any) {
    this.dataService.UpdateProvince(e.data).subscribe(
      (response) => {
        this.toastr.success('Province Updated Successfully!', 'Success', {
          timeOut: 3000,
        });
      },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error(error, 'Province Update Failed');
      }
    );
  }

  provinceDeleted(e: any) {
    this.dataService.DeleteProvince(e.data.provinceId).subscribe(
      (response) => {
        this.toastr.success('Province Deleted Successfully!', 'Success', {
          timeOut: 3000,
        });
      },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error('Province Failed ' + this.errorMessage);
        this.refreshStatics();
      }
    );
  }

  // Charge Types
  chargeTypeAdded(e: { data: any }) {
    e.data.chargeTypeId = 0;
    this.dataService.AddChargeType(e.data).subscribe(
      (response) => {
        this.toastr.success('ChargeType Added Successfully!', 'Success', {
          timeOut: 3000,
        });
        // Update Key of added entity from response object
        e.data.chargeTypeId = response['chargeTypeId'];
      },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error(error.error, 'chargeType Add Failed');
      }
    );
  }

  chargeTypeUpdated(e: any) {
    this.dataService.UpdateChargeType(e.data).subscribe(
      (response) => {
        this.toastr.success('ChargeType Updated Successfully!', 'Success', {
          timeOut: 3000,
        });
      },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error(error, 'ChargeType Update Failed');
      }
    );
  }

  chargeTypeDeleted(e: any) {
    this.dataService.DeleteChargeType(e.data.chargeTypeId).subscribe(
      (response) => {
        this.toastr.success('ChargeType Deleted Successfully!', 'Success', {
          timeOut: 3000,
        });
      },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error('chargeType Failed ' + this.errorMessage);
        this.refreshStatics();
      }
    );
  }

  // Payment Types
  paymentTypeAdded(e: { data: any }) {
    e.data.paymentTypeId = 0;
    this.dataService.AddPaymentType(e.data).subscribe(
      (response) => {
        this.toastr.success('paymentType Added Successfully!', 'Success', {
          timeOut: 3000,
        });
        // Update Key of added entity from response object
        e.data.paymentTypeId = response['paymentTypeId'];
      },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error(error.error, 'paymentType Add Failed');
      }
    );
  }

  paymentTypeUpdated(e: any) {
    this.dataService.UpdatePaymentType(e.data).subscribe(
      (response) => {
        this.toastr.success('paymentType Updated Successfully!', 'Success', {
          timeOut: 3000,
        });
      },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error(error, 'paymentType Update Failed');
      }
    );
  }

  paymentTypeDeleted(e: any) {
    this.dataService.DeletePaymentType(e.data.paymentTypeId).subscribe(
      (response) => {
        this.toastr.success('paymentType Deleted Successfully!', 'Success', {
          timeOut: 3000,
        });
      },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error('Payment Type Failed ' + this.errorMessage);
        this.refreshStatics();
      }
    );
  }


  settings_tabClick(e) {
  }

  public CloseClick() {
    this.mdDialogRef.close();
  }

}
