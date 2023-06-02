import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // {
  //   path: '',
  //   loadChildren: () =>
  //     import('./pages/questions/questions.module').then(
  //       (m) => m.QuestionsModule
  //     ),
  // },
  // {
  //   path: '',
  //   pathMatch: 'full',
  //   loadChildren: () =>
  //     import('./pages/questions/questions.module').then(
  //       (m) => m.QuestionsModule
  //     ),
  // },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
