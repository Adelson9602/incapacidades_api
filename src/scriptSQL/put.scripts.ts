// Script para actualizar estado de la incapacidad
export const scriptUpdateStatusDisability = (base: string, numeroIncapacidad: number, estado: number): string => {
  return `UPDATE ${base}.incapacidades i SET i.fkIdEstadoIncapacidad = ${estado} WHERE numeroIncapacidad = ${numeroIncapacidad};`
}
