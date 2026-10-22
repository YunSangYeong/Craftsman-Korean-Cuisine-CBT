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
