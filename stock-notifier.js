import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const millisecond_timer = 1000*60*5;

const items = [
  {name: 'NVIDIA GeForce RTX 3080', stock: true, url: 'https://www.bestbuy.com/site/nvidia-geforce-rtx-3080-10gb-gddr6x-pci-express-4-0-graphics-card-titanium-and-black/6429440.p?skuId=6429440'},
  {name: 'NVIDIA GeForce RTX 3080 Ti', stock: false, url: 'https://www.bestbuy.com/site/nvidia-geforce-rtx-3080-ti-12gb-gddr6x-pci-express-4-0-graphics-card-titanium-and-black/6462956.p?skuId=6462956'},
  {name: 'NVIDIA GeForce RTX 3090', stock: false, url: 'https://www.bestbuy.com/site/nvidia-geforce-rtx-3090-24gb-gddr6x-pci-express-4-0-graphics-card-titanium-and-black/6429434.p?skuId=6429434'}
]

while(true){

  // wait
  await new Promise(resolve => setTimeout(resolve, millisecond_timer))

  items.forEach(item => {

    console.log('sending request to server...')
  
    fetch(item.url)
    .then(response => {

      console.log(`server response: ${response.status}/${response.statusText}`)
      
      if(response.status === 200){
    
        // extract body from response object
        response.text()
        .then(body => {
          var stock_status = body.includes('sold out') ? false : true
      
          // if item's new stock status is changed
          if(stock_status !== item.stock){
            
            // switch stock status in array
            item.stock = !item.stock
      
            // send webhook to IFTTT
            console.log('sending request to IFTTT...')
            fetch(`https://maker.ifttt.com/trigger/stock_notifier_app/with/key/${process.env.IFTTT_KEY}?value1=${item.name}&value2=${stock_status ? 'in stock' : 'out of stock'}`)
            .then(response => console.log(`IFTTT response: ${response.status}/${response.statusText}`))
            .catch(error => console.log(`an error occured while sending request to IFTTT: ${error}`))
          }
        })
        .catch(error => console.log(`error extracting body from server response: ${error}`))
      }
    })
    .catch(error => console.log(`an error occured while sending request to server: ${error}`))
  })
}