// Para eliminar incapacidad solo se cambia estado, ya que por integridad de datos no se puede eliminar
export const scriptDeleteDisability = (base: string, numeroIncapacidad: number): string => {
  return `UPDATE ${base}.incapacidades i SET i.fkIdEstadoIncapacidad = 9 WHERE numeroIncapacidad = ${numeroIncapacidad};`
}
