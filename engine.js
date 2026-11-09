export const initial={version:1,records:[{id:'R-104',type:'invoice',customer:'Aster',amount:420,status:'overdue'},{id:'R-105',type:'invoice',customer:'Beacon',amount:610,status:'paid'},{id:'R-106',type:'invoice',customer:'Cedar',amount:290,status:'overdue'},{id:'R-107',type:'support',customer:'Aster',amount:0,status:'open',ref:'R-104'}],audit:[]};
const clone=x=>structuredClone(x);
export function simulate(state,ids){const selected=state.records.filter(x=>ids.includes(x.id));const dependents=state.records.filter(x=>!ids.includes(x.id)&&x.ref&&ids.includes(x.ref));return {baseVersion:state.version,ids:[...ids],before:clone(state),direct:selected,dependents,expectedRecords:clone(state.records.filter(x=>!ids.includes(x.id))),projectedCount:state.records.length-selected.length,projectedBalance:selected.reduce((n,x)=>n+x.amount,0),risk:dependents.length?'blocked':'review',rollback:'Restore versioned snapshot of local demo records'};}
function sameRecords(expected, actual) {
  const byId = new Map(actual.map(row => [row.id, row]));
  return expected.length === actual.length && byId.size === actual.length &&
    new Set(expected.map(row => row.id)).size === expected.length &&
    expected.every(row => {
      const observed = byId.get(row.id);
      return observed && Object.keys(row).length === Object.keys(observed).length &&
        Object.keys(row).every(key => Object.hasOwn(observed, key) && Object.is(row[key], observed[key]));
    });
}

export function execute(state, plan, {injectSideEffect=false, injectWrongRecord=false}={}) {
  if (state.version !== plan.baseVersion || !sameRecords(plan.before.records, state.records))
    return {status:'blocked',reason:'Records changed after preview. Simulate again.',state};
  if (plan.dependents.length)
    return {status:'blocked',reason:'A linked record would be orphaned. Change the selection.',state};
  const next = clone(state);
  const wrong = injectWrongRecord && plan.direct.length && plan.expectedRecords[0]?.id;
  const actualIds = wrong ? [wrong, ...plan.direct.slice(1).map(x=>x.id)] : plan.ids;
  next.records = next.records.filter(row => !actualIds.includes(row.id));
  if (injectSideEffect) next.records = next.records.filter(row => row.id !== 'R-105');
  next.version++;
  next.audit.push({event:'bulk-delete',ids:actualIds,baseVersion:plan.baseVersion});
  if (!sameRecords(plan.expectedRecords, next.records)) {
    const expected = plan.expectedRecords.map(row => row.id).join(', ');
    const observed = next.records.map(row => row.id).join(', ');
    return {status:'rolled-back',reason:`Records differ from preview (expected: ${expected}; observed: ${observed}). Snapshot restored.`,state:clone(plan.before),attempted:next};
  }
  return {status:'executed',reason:`Deleted ${plan.direct.length} local demo records.`,state:next};
}
export function restore(snapshot){return clone(snapshot)}
