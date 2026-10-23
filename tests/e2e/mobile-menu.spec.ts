import { test, expect } from '@playwright/test';

for (const size of [{width:390,height:480},{width:740,height:360}]) {
  test(`작은 메뉴 실제 휠·상단/하단 접근 ${size.width}x${size.height}`, async ({page}) => {
    await page.setViewportSize(size);
    await page.goto('');
    await page.getByRole('button',{name:'메뉴 열기'}).click();
    const menu=page.locator('.sidebar');
    await expect(menu).toHaveClass(/open/);
    await page.waitForTimeout(300);
    await menu.hover({position:{x:120,y:150}});
    await page.mouse.wheel(0,1600);
    await expect.poll(()=>menu.evaluate(e=>e.scrollTop)).toBeGreaterThan(0);
    const bottom=page.getByRole('button',{name:'데이터 초기화',exact:true});
    await expect(bottom).toBeInViewport();
    await bottom.click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.getByRole('button',{name:'돌아가기',exact:true}).click();
    // Dialog may close the menu; opening is an actual input too.
    if(!await menu.evaluate(e=>e.classList.contains('open'))) {
      await page.getByRole('button',{name:'메뉴 열기'}).click();
      await page.waitForTimeout(300);
    }
    await menu.hover({position:{x:120,y:150}});
    await page.mouse.wheel(0,-1800);
    await expect.poll(()=>menu.evaluate(e=>e.scrollTop)).toBe(0);
    const dashboard=page.getByRole('navigation').getByRole('button',{name:'학습 대시보드',exact:true});
    await expect(dashboard).toBeInViewport();
    await dashboard.click();
    await expect(page.getByRole('heading',{name:'한식조리기능사 필기 CBT',exact:true})).toBeVisible();
    await expect(page.locator('.criteria-note')).toHaveCount(0);
    await expect(page.getByLabel('학습 기준')).toHaveCount(0);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  });
  test(`모바일 실제 터치 스와이프·글자 확대 ${size.width}x${size.height}`,async ({page,context,isMobile})=>{
    test.skip(!isMobile,'터치 입력은 모바일 Chromium 에뮬레이션에서 실행');
    await page.setViewportSize(size); await page.goto('');
    await page.addStyleTag({content:'.sidebar nav button { font-size: 20px; min-height: 58px } .sidebar-disclaimer { font-size: 15px }'});
    await page.getByRole('button',{name:'메뉴 열기'}).click(); await page.waitForTimeout(300);
    const menu=page.locator('.sidebar');
    const session=await context.newCDPSession(page);
    async function swipe(from:number,to:number){
      await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:120,y:from}]});
      for(let i=1;i<=12;i++) {
        await session.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:120,y:from+(to-from)*i/12}]});
        await page.waitForTimeout(20);
      }
      await session.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
      await page.waitForTimeout(250);
    }
    for(let i=0;i<5;i++) await swipe(size.height-50,75);
    await expect.poll(()=>menu.evaluate(e=>e.scrollTop)).toBeGreaterThan(0);
    await expect(page.getByRole('button',{name:'데이터 초기화',exact:true})).toBeInViewport();
    const download=page.waitForEvent('download');
    await page.getByRole('button',{name:'학습 기록 백업',exact:true}).click();
    expect((await download).suggestedFilename()).toContain('.json');
    for(let i=0;i<6;i++) await swipe(80,size.height-45);
    await expect.poll(()=>menu.evaluate(e=>e.scrollTop)).toBe(0);
    const top=page.getByRole('navigation').getByRole('button',{name:'학습 대시보드',exact:true});
    await expect(top).toBeInViewport(); await top.tap();
    await expect(menu).not.toHaveClass(/open/);
  });
}
