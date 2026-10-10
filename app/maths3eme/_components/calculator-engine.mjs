// Analyse arithmétique sans eval, adaptée de la calculatrice de statistiques 4e.
export function calculate(input){
 const s=input.replace(/,/g,'.').replace(/×/g,'*').replace(/÷/g,'/').replace(/−/g,'-').replace(/\s/g,'');
 if(!/^[0-9.eE+\-*/()]+$/.test(s)||s.length>180)throw Error('Calcul invalide');
 const t=s.match(/(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?|[()+*/-]/g)||[];
 if(t.join('')!==s)throw Error('Calcul invalide');let i=0;
 function atom(){const x=t[i++];if(x==='+')return atom();if(x==='-')return -atom();if(x==='('){const v=sum();if(t[i++]!==')')throw Error('Parenthèses incorrectes');return v;}if(x===undefined||!/^(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(x))throw Error('Calcul invalide');return Number(x);}
 function product(){let v=atom();while(t[i]==='*'||t[i]==='/'){const op=t[i++],b=atom();if(op==='/'&&b===0)throw Error('Division par zéro');v=op==='*'?v*b:v/b;}return v;}
 function sum(){let v=product();while(t[i]==='+'||t[i]==='-'){const op=t[i++],b=product();v=op==='+'?v+b:v-b;}return v;}
 const value=sum();if(i!==t.length||!Number.isFinite(value))throw Error('Calcul invalide');return Number(value.toPrecision(12));
}
export const initialCalculator={expression:'',last:null,result:'',executed:false,history:[]};
export function press(state,key){
 const next={...state,result:''};
 if(key==='AC')return {...next,expression:'',executed:false};
 if(key==='DEL')return {...next,expression:state.executed?'':state.expression.slice(0,-1),executed:false};
 if(key==='EXE'){
  if(!state.expression.trim())return state;
  try {const v=calculate(state.expression),shown=String(v).replace('.',',');return {...state,expression:shown,last:v,result:shown,executed:true,history:[`${state.expression} = ${shown}`,...state.history].slice(0,10)};}
  catch(e){return {...state,result:e.message};}
 }
 if(key==='ANS'){if(state.last===null)return state;const value=state.last<0?`(${state.last})`:String(state.last);return {...next,expression:(state.executed?'':state.expression)+value,executed:false};}
 if(!['0','1','2','3','4','5','6','7','8','9',',','.','+','−','×','÷','(',')'].includes(key))return state;
 if(state.executed){if(key===')')return state;const last=state.last<0?`(${state.last})`:String(state.last);return {...next,expression:['+','−','×','÷'].includes(key)?last+key:key,executed:false};}
 if(state.expression.length>=140)return state;
 return {...next,expression:state.expression+key};
}
