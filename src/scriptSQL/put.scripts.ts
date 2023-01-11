// Script para actualizar estado de la incapacidad
export const scriptUpdateStatusDisability = (base: string, idIncapacidad: number, estado: number): string => {
  return `UPDATE ${base}.incapacidades i SET i.fkIdEstadoIncapacidad = ${estado} WHERE idIncapacidad = ${idIncapacidad};`
}
