import Head from "next/head";
// import { Inter } from "next/font/google";
import PageLayout from "../layout/PageLayout";
import { useAccount, useContractRead, useContractReads } from 'wagmi'
import marketABI from "../utils/market_ABI.json"
import nftABI from "../utils/nft_ABI.json"
import { useState, useEffect } from "react"
import axios from "axios"
import Link from "next/link";


export default function MarketPlace() {
const marketAddress = "0xeA7Aa361F8122f8c59CE52546A3da81738479be8";
const NFTAddress = "0xE636259966E9b57b6ED2D6a72a40737f4Af18f20"

const [marketData, setMarketData]:any = useState([]);
const [tokenURL, setTokenURL] = useState([]);
const [tokensMetaData, setTokensMetaData] = useState([]);
const [pageLoading, setPageLoading] = useState('false');
const [uriMainData, setUriMainData] = useState([])


let urls:any = [];

const { data:BuyersData, isError, isLoading }:any = useContractRead({
    address: marketAddress,
    abi: marketABI,
    functionName: 'fetchMarketItems',

    onSuccess(data:[]){
    setMarketData(data);
    }
  })

//   console.log('marketData', String(marketData))
const nftMeta:any = marketData.map((itemsId:any) => {
    return({
        address: NFTAddress,
        abi: nftABI,
        functionName: "tokenURI",
        args:[
        itemsId[2]
        ]
    })
})

 const {data: uriData, isliading:isMarketLoading, isError: isMarketError, onSuccess}:any = useContractReads({
    contracts: nftMeta,
    onSuccess(data){
      console.log("success", data);
    //   setTokenURL([])
      setUriMainData(uriData);
    }
 })

const FetchURI = () => {
    let myUrls:any = [];
    let tokenMetaData:any = [];
    {uriMainData?.map(async(item:any, i:Number) => {
    const fetchData:any = await axios.get(`https://ipfs.filebase.io/ipfs/${item}`)
    const cMetaData = fetchData.data;
    tokenMetaData.push(cMetaData);
    // console.log(fetchData.data)
    let url;
    if (cMetaData.image.slice(0,4) === 'http') {
         url = cMetaData.image
    } else{
        const d2 = fetchData.data.image.slice(-46);
        url = `https://ipfs.filebase.io/ipfs/${d2}`
    }
    // console.log('metadata URL',url ) 
    urls.push(url);
    myUrls.push(url);
    })}
    
    setTokenURL(myUrls)
    setTokensMetaData(tokenMetaData)
    // console.log('their', myUrls)   
    // urls = myUrls; 
}
//  console.log('my url', tokenURL)
 console.log('my metadata', tokensMetaData)

// if (tokensMetaData === undefined) {
//     FetchURI();
// }

useEffect(() => {
    FetchURI();
}, [uriMainData])

// console.log('this..........',))
// console.log((marketData[0]).toString())

function formatTimestamp(timestamp:any) {
  const date:any = new Date(timestamp * 1000);
  const hours = date.getHours();
  const minutes = "0" + date.getMinutes();
  const seconds = "0" + date.getSeconds();
  const formattedTime = hours + ":" + minutes.substr(-2) + ":" + seconds.substr(-2);
  return formattedTime;
}
// console.log('test1 and 2',marketData[0][8]);


setTimeout(() => {
setPageLoading('true')

}, 3000);


// console.log('thissssssss',marketData);

 return (
    <>
      <Head>
        <title>Web3Bridge | Users </title>
        <meta name="description" content="This is the application for web3Bridge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

        <PageLayout>
           
           <h1 className="text-2xl font-bold text-center mb-20 mt-10"> AVAILABLE ITEMS </h1>
        {
          (pageLoading) ?

                    <div className="flex flex-row gap-6 px-8">

                    {tokensMetaData?.map((data:any, i:number)=>{
                        return(

                          <div key={String(marketData[i][0])} className="font-mono bg-gray-200 p-7 rounded-lg justify-center shadow-lg  w-25">
                            <div className="">
                              <div className="mb-3">
                                  {`${(marketData[i][3]).slice(0,9)} ... ${marketData[i][3].slice(-7)}`}
                              </div>
                              <img src={tokenURL[i]} alt="" style={{width: "250px"}} className="rounded-lg" />
                              <div className="flex flex-row justify-between my-5 border-b-[1px] border-solid border-b-black pb-5">
                                  <div className="">       
                                    {String(data?.name)}
                                  </div>
                                  <div>
                                    <Link href={{
                                          pathname: `./${String(marketData[i][0])}`,
                                          // query: { "pid": "abc" },
                                        }} >
                                          <div className="border border-teal-500 px-8 py-2 rounded-2xl">
                                           BUY 
                                          </div>
                                           </Link>
                                  </div>
                                </div>

                              <div className="flex flex-row justify-between">
                                  <div>
                                    {`${((marketData[i][5] / 1e18)).toString()} ETH`}
                                </div>
                                <div className="text-xl text-teal-400">
                                    {formatTimestamp(Number(marketData[i][8]))}
                                </div> 
                              </div>
                          </div>
                          </div>
                          
                        )
                    })}
                    </div> : "loading......"
        }
        </PageLayout>
      
    </>
  );
  }
