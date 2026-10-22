import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { BASE_BANK, fingerprint } from '../src/model';

// Independent JavaScript formulas; generator uses Python exact Fraction/Decimal.
// No import of generator code or stored result as the expected answer.
const checks:Record<string,{unit:string;solve:(v:number[])=>number}>={
  recipe:{unit:'g',solve:([ingredient,basePeople,targetPeople])=>ingredient/basePeople*targetPeople},
  edible:{unit:'g',solve:([gross,percent])=>gross*percent/100},
  purchase:{unit:'g',solve:([net,percent])=>net/(percent/100)},
  edibleRate:{unit:'%',solve:([gross,net])=>100*net/gross},
  wasteRate:{unit:'%',solve:([gross,discard])=>100*discard/gross},
  cooked:{unit:'g',solve:([raw,percent])=>raw*percent/100},
  cookingRate:{unit:'%',solve:([raw,cooked])=>100*cooked/raw},
  rehydration:{unit:'g',solve:([dry,multiple])=>dry*multiple},
  energy:{unit:'kcal',solve:([c,p,f])=>4*(c+p)+9*f},
  proteinEnergy:{unit:'%',solve:([protein,total])=>400*protein/total},
  nutrient:{unit:'g',solve:([per100,mass])=>mass/100*per100},
  dryMatter:{unit:'g',solve:([mass,moisture])=>mass-mass*moisture/100},
  waterForSolids:{unit:'g',solve:([solids,percent])=>solids*(100/percent-1)},
  saltAddition:{unit:'g',solve:([water,percent])=>water/(1-percent/100)-water},
  dilution:{unit:'g',solve:([mass,initial,target])=>mass*(initial/target-1)},
  mixture:{unit:'%',solve:([a,pa,b,pb])=>(a*pa/100+b*pb/100)/(a+b)*100},
  sugar:{unit:'%',solve:([sugar,water])=>100*sugar/(water+sugar)},
  evaporation:{unit:'%',solve:([total,salt,loss])=>100*salt/(total-loss)},
  cost:{unit:'원',solve:([kg,unitPrice])=>kg*unitPrice},
  edibleCost:{unit:'원/kg',solve:([price,percent])=>price*100/percent},
  portionCost:{unit:'원',solve:([total,people])=>total/people},
  costRate:{unit:'%',solve:([cost,sale])=>cost*100/sale},
  salePrice:{unit:'원',solve:([cost,percent])=>cost*100/percent},
  materialMargin:{unit:'원',solve:([sale,cost])=>sale-cost},
  order:{unit:'g',solve:([need,current,reserve])=>need-current+reserve},
  packages:{unit:'개',solve:([need,packageSize])=>Math.ceil(need/packageSize)},
  servings:{unit:'인분',solve:([batch,portion])=>Math.floor(batch/portion)},
  wasteCost:{unit:'원',solve:([kg,price])=>kg*price},
  retention:{unit:'%',solve:([before,after])=>100*after/before},
  waterGain:{unit:'g',solve:([raw,cooked])=>cooked-raw},
  ratio:{unit:'g',solve:([total,a,b])=>total/(a+b)*a},
  baker:{unit:'g',solve:([flour,percent])=>flour*percent/100},
  density:{unit:'g',solve:([ml,density])=>ml*density},
  heat:{unit:'kJ',solve:([mass,start,end])=>(end-start)*mass*4.2},
  efficiency:{unit:'%',solve:([useful,supplied])=>100*useful/supplied},
  electricCost:{unit:'원',solve:([kw,minutes,price])=>kw*(minutes/60)*price},
  coolingRate:{unit:'℃/분',solve:([start,end,minutes])=>(start-end)/minutes},
  sequential:{unit:'g',solve:([gross,edible,cooked])=>gross*(edible/100)*(cooked/100)},
  sodium:{unit:'g',solve:([mg,factor])=>(mg/1000)*factor},
  replacement:{unit:'g',solve:([mass,a,b])=>(mass*a/100)/(b/100)},
};
const round=(n:number)=>Math.round((n+Number.EPSILON*Math.max(1,Math.abs(n)))*100)/100;
const variants=BASE_BANK.filter(q=>q.calculation);
describe('1,000문항 수량·유형·기존 기록 보존',()=>{
  it('기존 60개 전체 내용·ID·답·해설을 보존한다',()=>{
    expect(createHash('sha256').update(JSON.stringify(BASE_BANK.slice(0,60),null,2)+'\n').digest('hex')).toBe('524c21c88f4717619bdfea717cad55948997c5e3fe68f9bb9606c26f84b28914');
  });
  it('실제 1,000개는 개념 200개+계산 800개이며 40유형별 조건 20개다',()=>{
    expect(BASE_BANK).toHaveLength(1000);
    expect(variants).toHaveLength(800);
    expect(BASE_BANK.filter(q=>!q.calculation)).toHaveLength(200);
    expect(new Set(BASE_BANK.map(fingerprint)).size).toBe(1000);
    expect(new Set(variants.map(q=>q.family)).size).toBe(40);
    expect(new Set(variants.map(q=>q.calculation!.kind))).toEqual(new Set(Object.keys(checks)));
    for(const kind of Object.keys(checks)){
      const group=variants.filter(q=>q.calculation!.kind===kind);
      expect(group).toHaveLength(20);
      expect(new Set(group.map(q=>JSON.stringify(q.calculation!.values))).size).toBe(20);
    }
  });
  it('반올림과 올림·버림 경계의 정의를 구별한다',()=>{
    expect(round(0.625)).toBe(0.63);expect(round(14.325)).toBe(14.33);
    expect(checks.packages.solve([801,400])).toBe(3);
    expect(checks.servings.solve([801,400])).toBe(2);
  });
});
for(const q of variants){
  it(`${q.id} ${q.family}: 독립 재계산·정답 번호·단위·동치 보기 검사`,()=>{
    const c=q.calculation!;
    expect(c.values.every(v=>Number.isFinite(v)&&v>0)).toBe(true);
    for (const input of c.values) {
      const token=String(input).replaceAll('.', '\\.');
      expect(q.question).toMatch(new RegExp(`(?<![0-9.])${token}(?![0-9.])`));
    }
    const check=checks[c.kind];expect(check).toBeDefined();
    const expected=round(check.solve(c.values));
    expect(c.result).toBe(expected); expect(c.unit).toBe(check.unit);
    expect(c.precision).toBe(2); expect(q.family).toBe(`KC-CALC-${c.kind}`);
    const numbers=q.choices.map(choice=>{
      expect(choice.endsWith(` ${check.unit}`)).toBe(true);
      return Number(choice.slice(0,-(` ${check.unit}`.length)));
    });
    expect(numbers.every(n=>Number.isFinite(n)&&n>0)).toBe(true);
    expect(new Set(numbers).size).toBe(4);
    expect(numbers.filter(v=>v===expected)).toHaveLength(1);
    expect(numbers[q.answer-1]).toBe(expected);
    expect(q.explanation).toContain(`${expected.toFixed(2)} ${check.unit}`);
    expect(q.reviewNote).toContain('계산 조건 변형');
    expect(q.year).toBeNull();expect(q.session).toBeNull();
  });
}
