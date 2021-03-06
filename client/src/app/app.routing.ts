import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

//Importe componentes que tienen que ver con el usuario
import {HomeComponent} from './components/home.component';
import {UserEditComponent} from './components/user-edit.component';
import {ArtistListComponent} from './components/artist-list.component';
import {ArtistAddComponent} from './components/artist-add.component';
import {ArtistEditComponent} from './components/artist-edit.component';
const appRoutes: Routes=[

	
	{path: '', component:HomeComponent},
	{path: 'artists/:page', component:ArtistListComponent},
	{path: 'crear-artista', component:ArtistAddComponent},
	{path: 'editar-artista/:id', component:ArtistEditComponent},
	{path: 'mis-datos', component:UserEditComponent},
	{path: '**', component:HomeComponent}
];

export const appRoutingProviders: any[]=[];
export const routing: ModuleWithProviders= RouterModule.forRoot(appRoutes);
