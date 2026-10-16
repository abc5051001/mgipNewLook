import {chromium,expect} from '@playwright/test';
import assert from 'node:assert/strict';
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe'});
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 const errors=[];page.on('pageerror',error=>errors.push(error.message));page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});
 const base=process.env.BASE_URL||'http://127.0.0.1:4176';
 await page.goto(base+'/team',{waitUntil:'networkidle'});
 await page.getByRole('searchbox').fill('Joe M.');
 await expect(page.locator('.mg-person')).toHaveCount(1);
 await page.locator('.mg-person').click();
 await expect(page.locator('.mg-profile-next a')).toHaveCount(0);
 await page.reload({waitUntil:'networkidle'});
 await expect(page.locator('.mg-profile-next a')).toHaveCount(0);
 await page.goto(base,{waitUntil:'networkidle'});
 await page.evaluate(()=>scrollTo(0,500));
 await expect(page.locator('.mg-header')).toHaveAttribute('data-scrolled','true');
 await page.reload({waitUntil:'networkidle'});
 await expect(page.locator('.mg-header')).toHaveAttribute('data-scrolled','true');
 assert.deepEqual(errors,[]);
 console.log('Filtered biography reload and restored-scroll header hydrate without console errors.');
}finally{await browser.close();}
