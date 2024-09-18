import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';

const scrapeTwitter =  (accounts, ticker, interval) => {
    console.log(accounts , ticker , interval);
    
  setInterval(async () => {
    for (const account of accounts) {
      try {
        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();
        
        await page.goto(`https://twitter.com/${account}`);

        await page.waitForTimeout(3000); 

        const html = await page.content();
        
        
        const $ = cheerio.load(html);

        

        const tweets = $('div.tweet');
        let count = 0;

        tweets.each((i, tweet) => {
          const tweetText = $(tweet).find('p.tweet-text').text();
          if (tweetText.includes(ticker)) {
            count++;
          }
        });

        console.log(`${ticker} was mentioned ${count} times in the last ${interval} minutes on ${account}`);

        await browser.close();
      } catch (error) {
        console.error(`Error scraping ${account}:`, error);
      }
    }
  }, interval * 60 * 1000); 
};


const twitterAccounts = [
  'warrior_0719',
  'allstarcharts',
  'yuriymatso',
  'TriggerTrades',
  'AdamMancini4',
  'CordovaTrades',
  'Barchart',
  'RoyLMattox',
];
const tickerSymbol = '$TSLA';
const scrapingInterval = 15; 

scrapeTwitter(twitterAccounts, tickerSymbol, scrapingInterval);
