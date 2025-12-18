import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class CollaboratorSelectDTO {                // RAZON DE DTO: Al dar click en "Crear Proyecto", no traer todos los datos. Solo  ID y Nombre/Razón Social.
  @ApiProperty({description : 'ID del colaborador'})
  @Expose()
  id: string;

  @ApiProperty({description:'Forma de identificar al empleador'}) ///////////Modificar dependiendo de lo que se haga en el service
  @Expose()
  // Un campo calculado en el service o uniendo los strings
  displayName: string; 
}