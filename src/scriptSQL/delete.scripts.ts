export const scriptDeleteBeneficiario = (idPersona: number) => {
  return `DELETE FROM beneficiario WHERE idpersona = ${idPersona}`
}
