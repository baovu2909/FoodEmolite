import { Routes } from '@angular/router';
import { URL_ENDPOINT } from './common/constants/url-endpoint';

import { PageLoginComponent } from './pages/page-login/login/login';
import { PageRegisterComponent } from './pages/page-login/register/register';
import { LayoutAdminComponent } from './layouts/layout-admin/layout-admin';
import { PageAdminStoresComponent } from './pages/page-admin/stores/stores';
import { PageAdminStoreFoodsComponent } from './pages/page-admin/foods/foods';

export const routes: Routes = [
  {
    path: '',
    redirectTo: URL_ENDPOINT.LOGIN,
    pathMatch: 'full'
  },
  {
    path: URL_ENDPOINT.LOGIN,
    component: PageLoginComponent
  },
  {
    path: URL_ENDPOINT.REGISTER,
    component: PageRegisterComponent
  },
  {
    path: URL_ENDPOINT.ADMIN,
    component: LayoutAdminComponent,
    children: [
      {
        path: '',
        redirectTo: URL_ENDPOINT.ADMIN_STORES,
        pathMatch: 'full'
      },
      {
        path: URL_ENDPOINT.ADMIN_STORES,
        component: PageAdminStoresComponent
      },
      {
        path: URL_ENDPOINT.ADMIN_FOODS,
        component: PageAdminStoreFoodsComponent
      }
    ]
  }
];