// Para eliminar incapacidad solo se cambia estado, ya que por integridad de datos no se puede eliminar
export const scriptDeleteDisability = (base: string, numeroIncapacidad: number): string => {
  return `UPDATE ${base}.incapacidades i SET i.fkIdEstadoIncapacidad = 7 WHERE numeroIncapacidad = ${numeroIncapacidad};`
}

export const scriptDeleteDocumentsToAttach = (base: string, idTipoIncapacidad: number): string => {
  return `DELETE FROM ${base}.documentosAdjuntar WHERE idTipoIncapacidad =${idTipoIncapacidad};`
}
