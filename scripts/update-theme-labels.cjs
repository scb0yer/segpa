// À exécuter depuis la racine du FRONTEND : node scripts/update-theme-labels.cjs
// Remplace uniquement les anciens messages exacts ; aucun calcul ni composant n'est écrasé.
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve('app/maths3eme');
if(!fs.existsSync(root)){console.error('Lance ce script depuis la racine du frontend (contenant app/maths3eme).');process.exit(1);}
const replacements=[
 ['sur cet exercice aujourd\'hui','sur ce thème aujourd\'hui'],
 ['point du jour sur cet exercice','point du jour sur ce thème'],
 ['un point par jour pour ce niveau','un point par jour pour ce thème'],
 ['Essaie une autre activité pour faire avancer la classe.','Essaie un autre thème pour faire avancer la classe.'],
 ['continuer à t\'entraîner ou essayer une autre activité.','continuer à t\'entraîner ou essayer un autre thème.'],
 ['Il reste une activité à explorer aujourd\'hui.','Il reste un thème à explorer aujourd\'hui.'],
 ['Tu as exploré toutes les activités aujourd\'hui !','Tu as déjà pratiqué tous les thèmes disponibles aujourd\'hui !'],
];
let changed=0;
function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
 const file=path.join(dir,entry.name);if(entry.isDirectory())walk(file);
 else if(/\.(js|jsx|tsx)$/.test(file)){
  const old=fs.readFileSync(file,'utf8');let updated=old;
  for(const [before,after]of replacements)updated=updated.split(before).join(after);
  if(updated!==old){fs.writeFileSync(file,updated);console.log(path.relative(process.cwd(),file));changed++;}
 }
}}
walk(root);console.log(`${changed} fichier(s) de messages mis à jour.`);
