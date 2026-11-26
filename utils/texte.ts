/** Échappe les caractères spéciaux d'une chaîne pour l'utiliser dans une RegExp. */
export function echapperRegex(texte: string): string {
  return texte.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** RegExp qui reconnaît exactement le libellé, sans tenir compte de la casse ni des espaces autour. */
export function libelleExact(libelle: string): RegExp {
  return new RegExp(`^\\s*${echapperRegex(libelle)}\\s*$`, 'i');
}

/** Met en minuscules et supprime les espaces superflus (comparaison de libellés). */
export function normaliser(texte: string): string {
  return texte.replace(/\s+/g, ' ').trim().toLocaleLowerCase('fr-FR');
}
