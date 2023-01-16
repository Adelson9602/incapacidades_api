// Script para actualizar estado de la incapacidad
export const scriptUpdateStatusDisability = (base: string, idIncapacidad: number, estado: number): string => {
  return `UPDATE ${base}.incapacidades i SET i.fkIdEstadoIncapacidad = ${estado} WHERE idIncapacidad = ${idIncapacidad};`
}

// Escrip para acutalizar estado de notificacion
export const scriptUpdateStatusNotification = (base: string, idNotificacion: number, estado: number): string => {
  return `UPDATE ${base}.notificaciones i SET i.estado = ${estado} WHERE idNotificacion = ${idNotificacion};`
}
