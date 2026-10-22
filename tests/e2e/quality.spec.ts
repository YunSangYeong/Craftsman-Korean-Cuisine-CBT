import {test,expect} from '@playwright/test';
test('화면별 안내 배너 부재·PC/모바일 화면',async({page},info)=>{
  await page.goto('');
  await page.screenshot({path:`/tmp/korean-cuisine-${info.project.name}.png`,fullPage:true});
  for(const label of ['학습 대시보드','실전 모의시험','랜덤 문제풀이','오답노트','북마크','학습 통계','문제은행 관리']){
    const opener=page.getByRole('button',{name:'메뉴 열기'});
    if(await opener.isVisible()) await opener.click();
    await page.getByRole('navigation').getByRole('button',{name:label,exact:true}).click();
    await expect(page.locator('.criteria-note')).toHaveCount(0);
    await expect(page.getByLabel('학습 기준')).toHaveCount(0);
    // Disclosure belongs only in bank/source detail and the footer.
    if(label!=='문제은행 관리') await expect(page.locator('main .notice').filter({hasText:/비공식|잠정|검증 대기|공식.*대조/})).toHaveCount(0);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  }
});
test('저장 실패 경고 유지',async({page})=>{
  await page.addInitScript(()=>{
    Storage.prototype.setItem=function(){throw new DOMException('quota','QuotaExceededError')};
  });
  await page.goto('');
  await page.getByRole('button',{name:'문제풀이 시작하기',exact:true}).click();
  await expect(page.getByRole('alert')).toContainText('기록을 저장하지 못했습니다');
});

// Functional check of the served public bank rather than a source-only count.
test('1000문항 구성 공개·계산 출처·전체 JSON 내보내기',async({page})=>{
  await page.goto('');
  await expect(page.locator('.bank-summary')).toContainText('등록 1000문항');
  await expect(page.locator('.bank-summary')).toContainText('개념 200');
  await expect(page.locator('.bank-summary')).toContainText('계산 조건 변형 800 (40유형)');
  const opener=page.getByRole('button',{name:'메뉴 열기'});
  if(await opener.isVisible()) await opener.click();
  await page.getByRole('navigation').getByRole('button',{name:'문제은행 관리',exact:true}).click();
  await expect(page.locator('.pagination')).toContainText('1 / 50');
  await expect(page.locator('main .notice')).toContainText('실제 1000개, 부족 0개');
  await page.getByLabel('문항 검색',{exact:true}).fill('KC-201');
  await expect(page.locator('.bank-row')).toHaveCount(1);
  await page.locator('.bank-row summary').click();
  await expect(page.locator('.bank-row')).toContainText('숫자 조건 변형');
  await expect(page.locator('.bank-row .explanation')).toContainText('750.00 g');
  const downloading=page.waitForEvent('download');
  await page.getByRole('button',{name:'전체 문항 내보내기',exact:true}).click();
  const download=await downloading; const stream=await download.createReadStream();
  const buffers:Buffer[]=[];for await(const chunk of stream!) buffers.push(Buffer.from(chunk));
  const bank=JSON.parse(Buffer.concat(buffers).toString('utf8'));
  expect(bank).toHaveLength(1000);
  expect(bank.filter((q:{calculation?:unknown})=>q.calculation)).toHaveLength(800);
});
