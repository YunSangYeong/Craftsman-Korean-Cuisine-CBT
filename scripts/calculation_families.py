"""Forty explicitly disclosed culinary calculation contexts, twenty conditions each.
Inputs are learning assumptions, not measured composition or statutory limits.
Exact rational arithmetic here; independent numeric validators are in Vitest.
"""
from fractions import Fraction as F
from decimal import Decimal, ROUND_HALF_UP

def rounded(value):
    f=F(value)
    return Decimal(f.numerator).__truediv__(Decimal(f.denominator)).quantize(Decimal('0.01'),rounding=ROUND_HALF_UP)

def fmt(value):
    return format(rounded(value),'f').rstrip('0').rstrip('.') if rounded(value) else '0'

def families(i):
    # key, display name, unit, input values, exact result, full prompt, substituted formula
    a=300+25*i; b=4+i%5; c=10+2*i
    yieldpct=60+i; purchase=1000+100*i; edible=600+35*i
    carb=20+i; protein=5+i%8; fat=3+i%6
    base=1000+50*i; salt=8+i%9; target=2+i%3
    price=2500+150*i; count=10+i
    return [
      ('recipe','레시피 인분 환산','g',[a,b,c],F(a*c,b),f'표준레시피 {b}인분에 쌀 {a} g을 사용한다고 가정한다. 1인분 양을 유지해 {c}인분을 만들 때 쌀의 필요량은?',f'{a} × {c} ÷ {b}'),
      ('edible','가식부량','g',[purchase,yieldpct],F(purchase*yieldpct,100),f'채소 구입량 {purchase} g, 가식부율 {yieldpct}%로 가정한다. 손질 후 가식부량은?',f'{purchase} × {yieldpct} ÷ 100'),
      ('purchase','필요 구입량','g',[edible,yieldpct],F(edible*100,yieldpct),f'손질한 무 {edible} g이 필요하다. 가식부율을 {yieldpct}%로 가정할 때 구입량은?',f'{edible} ÷ ({yieldpct} ÷ 100)'),
      ('edibleRate','가식부율','%',[purchase,edible],F(edible*100,purchase),f'채소를 {purchase} g 구입해 손질한 뒤 가식부 {edible} g을 얻었다. 가식부율은?',f'{edible} ÷ {purchase} × 100'),
      ('wasteRate','손질 폐기율','%',[purchase,100+15*i],F((100+15*i)*100,purchase),f'구입한 채소 {purchase} g 중 손질 폐기량이 {100+15*i} g이다. 구입량 기준 폐기율은?',f'{100+15*i} ÷ {purchase} × 100'),
      ('cooked','가열 후 중량','g',[purchase,70+i],F(purchase*(70+i),100),f'손질한 고기 {purchase} g의 조리수율을 {70+i}%로 가정한다. 가열 후 중량은?',f'{purchase} × {70+i} ÷ 100'),
      ('cookingRate','조리수율','%',[purchase,700+45*i],F((700+45*i)*100,purchase),f'조리 전 가식부 고기 {purchase} g이 조리 후 {700+45*i} g이 되었다. 조리수율은?',f'{700+45*i} ÷ {purchase} × 100'),
      ('rehydration','건조 재료 불림','g',[50+5*i,F(20+i,10)],F((50+5*i)*(20+i),10),f'건조 버섯 {50+5*i} g을 불린 뒤 중량이 건조 중량의 {fmt(F(20+i,10))}배가 되었다. 불린 중량은?',f'{50+5*i} × {fmt(F(20+i,10))}'),
      ('energy','영양소 열량 합계','kcal',[carb,protein,fat],F(4*carb+4*protein+9*fat),f'한 끼의 탄수화물 {carb} g, 단백질 {protein} g, 지방 {fat} g만 열량을 낸다고 가정한다. 각각 1 g당 4, 4, 9 kcal를 적용한 총열량은?',f'({carb} × 4) + ({protein} × 4) + ({fat} × 9)'),
      ('proteinEnergy','단백질 열량비','%',[protein,300+20*i],F(protein*4*100,300+20*i),f'한 식사의 총열량이 {300+20*i} kcal이고 단백질은 {protein} g이다. 단백질 1 g당 4 kcal로 계산한 단백질 열량비는?',f'({protein} × 4) ÷ {300+20*i} × 100'),
      ('nutrient','제공량별 영양량','g',[8+i,75+10*i],F((8+i)*(75+10*i),100),f'계산 연습용 식품의 단백질이 100 g당 {8+i} g이라고 가정한다. 이 식품 {75+10*i} g의 단백질량은?',f'{8+i} × {75+10*i} ÷ 100'),
      ('dryMatter','건물량','g',[base,50+i],F(base*(50-i),100),f'총중량 {base} g인 반죽의 수분 비율을 질량 기준 {50+i}%로 가정한다. 물을 제외한 건물량은?',f'{base} × (100 − {50+i}) ÷ 100'),
      ('waterForSolids','목표 고형분 농도','g',[100+10*i,15+i],F((100+10*i)*(85-i),15+i),f'고형분 {100+10*i} g에 물만 더해 고형분 질량비 {15+i}%인 소스를 만든다. 증발과 손실이 없다면 넣을 물은?',f'{100+10*i} ÷ ({15+i} ÷ 100) − {100+10*i}'),
      ('saltAddition','물에 소금 첨가','g',[base,target],F(base*target,100-target),f'물 {base} g에 순수 소금만 넣어 최종 질량 기준 소금 농도 {target}%의 용액을 만든다. 넣을 소금량은?',f'{base} × {target} ÷ (100 − {target})'),
      ('dilution','소금 용액 희석','g',[base,salt,target],F(base*salt,target)-base,f'소금 질량비 {salt}% 용액 {base} g에 물만 더해 {target}%로 낮춘다. 소금 손실이 없다면 추가할 물은?',f'{base} × {salt} ÷ {target} − {base}'),
      ('mixture','두 소금 용액 혼합','%',[500+25*i,2+i%3,300+20*i,6+i%4],F((500+25*i)*(2+i%3)+(300+20*i)*(6+i%4),800+45*i),f'질량 기준 소금 농도 {2+i%3}% 용액 {500+25*i} g과 {6+i%4}% 용액 {300+20*i} g을 섞는다. 증발 없이 혼합한 소금 농도는?',f'({500+25*i} × {2+i%3} + {300+20*i} × {6+i%4}) ÷ ({500+25*i} + {300+20*i})'),
      ('sugar','순수 설탕 질량비','%',[50+5*i,500+20*i],F((50+5*i)*100,550+25*i),f'물 {500+20*i} g에 순수 설탕 {50+5*i} g만 녹였다. 용액 전체 질량 기준 설탕 비율은?',f'{50+5*i} ÷ ({500+20*i} + {50+5*i}) × 100'),
      ('evaporation','졸임 후 소금 농도','%',[base,20+2*i,100+10*i],F((20+2*i)*100,900+40*i),f'국물 총중량 {base} g에 소금 {20+2*i} g이 들어 있다. 물만 {100+10*i} g 증발하고 소금은 남았을 때 최종 소금 질량비는?',f'{20+2*i} ÷ ({base} − {100+10*i}) × 100'),
      ('cost','재료 구입 비용','원',[F(10+i,10),price],F((10+i)*price,10),f'1 kg당 {price}원인 채소를 {fmt(F(10+i,10))} kg 구입한다. 추가 비용이 없을 때 구입 비용은?',f'{price} × {fmt(F(10+i,10))}'),
      ('edibleCost','가식부 단가','원/kg',[price,yieldpct],F(price*100,yieldpct),f'채소 구입 단가가 1 kg당 {price}원이고 가식부율은 {yieldpct}%다. 손질 인건비를 제외한 가식부 1 kg의 재료 원가는?',f'{price} ÷ ({yieldpct} ÷ 100)'),
      ('portionCost','1인분 재료비','원',[10000+1000*i,count],F(10000+1000*i,count),f'한 배치의 총재료비는 {10000+1000*i}원이고 {count}인분을 만든다. 모든 인분이 같을 때 1인분 재료비는?',f'{10000+1000*i} ÷ {count}'),
      ('costRate','재료 원가율','%',[1500+100*i,6000+200*i],F((1500+100*i)*100,6000+200*i),f'한 메뉴의 재료비가 {1500+100*i}원, 판매금액이 {6000+200*i}원이다. 재료 원가율은?',f'{1500+100*i} ÷ {6000+200*i} × 100'),
      ('salePrice','원가율로 판매가 계산','원',[1500+100*i,25+i],F((1500+100*i)*100,25+i),f'재료비 {1500+100*i}원인 음식의 재료 원가율을 {25+i}%로 계획한다. 재료비만을 기준으로 계산한 판매가는?',f'{1500+100*i} ÷ ({25+i} ÷ 100)'),
      ('materialMargin','재료비 차감액','원',[6000+300*i,1800+120*i],F(4200+180*i),f'판매금액 {6000+300*i}원에서 재료비 {1800+120*i}원만 뺀 금액은? 인건비·경비 등을 반영한 순이익은 아니다.',f'{6000+300*i} − {1800+120*i}'),
      ('order','추가 발주량','g',[base,200+10*i,100+5*i],F(900+45*i),f'생산에 쓸 재료 {base} g과 별도 안전 재고 {100+5*i} g을 확보하려 한다. 사용 가능한 현재 재고가 {200+10*i} g이면 추가 발주량은?',f'{base} + {100+5*i} − {200+10*i}'),
      ('packages','포장 단위 올림','개',[1100+137*i,400+10*i],F(-(-(1100+137*i)//(400+10*i))),f'재료 {1100+137*i} g이 필요하다. 한 포장이 {400+10*i} g이고 포장 단위로만 구입 가능할 때 최소 몇 포장을 사야 하는가?',f'{1100+137*i} ÷ {400+10*i}의 몫을 정수 올림'),
      ('servings','완전 제공 인분','인분',[2500+137*i,150+5*i],F((2500+137*i)//(150+5*i)),f'완성 음식 {2500+137*i} g을 1인분 {150+5*i} g씩 제공한다. 부족한 나머지는 제공하지 않을 때 완전한 인분 수는?',f'{2500+137*i} ÷ {150+5*i}의 몫을 정수 버림'),
      ('wasteCost','폐기 재료비','원',[F(10+i,20),price],F((10+i)*price,20),f'구입 단가 1 kg당 {price}원인 채소를 {fmt(F(10+i,20))} kg 폐기했다. 구입 단가로 환산한 폐기 재료비는?',f'{price} × {fmt(F(10+i,20))}'),
      ('retention','영양성분 잔존율','%',[100+10*i,70+6*i],F((70+6*i)*100,100+10*i),f'조리 전 배치 전체의 영양성분 총량이 {100+10*i} mg, 조리 후 총량이 {70+6*i} mg으로 주어졌다. 같은 배치 기준 잔존율은?',f'{70+6*i} ÷ {100+10*i} × 100'),
      ('waterGain','흡수한 물의 중량','g',[300+20*i,700+55*i],F(400+35*i),f'마른 쌀 {300+20*i} g이 취반 뒤 {700+55*i} g이 되었다. 증가분이 전부 흡수한 물이고 다른 손실이 없다고 가정할 때 물 증가량은?',f'{700+55*i} − {300+20*i}'),
      ('ratio','두 재료 배합비','g',[1000+50*i,2+i%3,3+i%4],F((1000+50*i)*(2+i%3),5+i%3+i%4),f'식초와 간장을 질량비 {2+i%3}:{3+i%4}로 섞어 총 {1000+50*i} g을 만든다. 식초의 중량은?',f'{1000+50*i} × {2+i%3} ÷ ({2+i%3} + {3+i%4})'),
      ('baker','가루 기준 수분 첨가','g',[500+25*i,50+i],F((500+25*i)*(50+i),100),f'밀가루 중량 기준으로 물을 {50+i}% 넣는 반죽을 만든다. 밀가루 {500+25*i} g에 넣을 물의 양은? 완성 반죽 중량 기준 비율이 아니다.',f'{500+25*i} × {50+i} ÷ 100'),
      ('density','부피에서 중량 환산','g',[100+10*i,F(90+i%6,100)],F((100+10*i)*(90+i%6),100),f'식용유 밀도를 {fmt(F(90+i%6,100))} g/mL로 가정한다. {100+10*i} mL의 중량은?',f'{100+10*i} mL × {fmt(F(90+i%6,100))} g/mL'),
      ('heat','물 가열 필요 열량','kJ',[1+i%5,15+i,60+i],F((1+i%5)*42*45,10),f'물 {1+i%5} kg을 {15+i}℃에서 {60+i}℃로 가열한다. 비열 4.2 kJ/(kg·℃), 열손실 없음으로 가정한 필요 열량은?',f'{1+i%5} × 4.2 × ({60+i} − {15+i})'),
      ('efficiency','가열 설비 열효율','%',[300+20*i,600+30*i],F((300+20*i)*100,600+30*i),f'조리 설비에 공급한 에너지가 {600+30*i} kJ, 식품 가열에 유효하게 전달된 에너지가 {300+20*i} kJ이다. 열효율은?',f'{300+20*i} ÷ {600+30*i} × 100'),
      ('electricCost','조리 기기 전력 비용','원',[F(10+i,10),30+5*i,150+10*i],F((10+i)*(30+5*i)*(150+10*i),600),f'전기 조리기기가 {fmt(F(10+i,10))} kW로 일정하게 {30+5*i}분 작동한다. 1 kWh당 {150+10*i}원이고 기본료 등 다른 비용이 없다고 가정할 때 전력량 요금은?',f'{fmt(F(10+i,10))} kW × ({30+5*i} ÷ 60) h × {150+10*i} 원/kWh'),
      ('coolingRate','평균 온도 하강률','℃/분',[80+i,30+i,10+i],F(50,10+i),f'음식 온도가 {10+i}분 동안 {80+i}℃에서 {30+i}℃로 내려갔다. 단순 평균 온도 하강률의 크기는? 이 계산은 냉각의 위생적 안전성 판정이 아니다.',f'({80+i} − {30+i}) ÷ {10+i}'),
      ('sequential','손질과 가열의 연속수율','g',[base,70+i,75+i],F(base*(70+i)*(75+i),10000),f'구입 고기 {base} g의 손질 가식부율은 {70+i}%, 손질 고기의 조리수율은 {75+i}%라고 가정한다. 완성 중량은?',f'{base} × ({70+i} ÷ 100) × ({75+i} ÷ 100)'),
      ('sodium','가정 환산계수 소금상당량','g',[400+25*i,F(5,2)],F((400+25*i)*5,2000),f'음식의 나트륨이 {400+25*i} mg이라고 주어졌다. 계산 연습용 환산계수 나트륨 질량 × 2.5를 적용한 소금상당량은 몇 g인가? 실제 소금 첨가량을 직접 뜻하지 않는다.',f'{400+25*i} mg ÷ 1000 × 2.5'),
      ('replacement','단백질량 맞춘 재료 대체','g',[100+10*i,10+i%5,15+i%7],F((100+10*i)*(10+i%5),15+i%7),f'재료 A {100+10*i} g의 단백질량을 재료 B로 맞추려 한다. A와 B의 단백질 함량을 각각 질량비 {10+i%5}%, {15+i%7}%로 가정한다. 필요한 B의 중량은? 다른 영양소·조리 특성은 비교하지 않는다.',f'{100+10*i} × ({10+i%5} ÷ 100) ÷ ({15+i%7} ÷ 100)'),
    ]

# Korean wording for recipe conversion is explicit to avoid adopting any source recipe.
def rows():
    for i in range(20):
        for kind,name,unit,values,result,prompt,formula in families(i):
            yield i,kind,name,unit,values,result,prompt,formula
