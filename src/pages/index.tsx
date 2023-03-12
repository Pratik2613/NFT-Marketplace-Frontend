import Head from "next/head";
// import { Inter } from "next/font/google";
import PageLayout from "../layout/PageLayout";
import ConnectionButton from "../components/ConnectionButton"
import { useAccount, useContractRead, useContractReads } from 'wagmi'
import marketABI from "../utils/market_ABI.json"
import nftABI from "../utils/nft_ABI.json"
import { useState } from "react"
import axios from "axios"
// import (useState)


// import PageLayout from "@/components/Navbar";

// const inter = Inter({ subsets: ["latin"] });

// const users = [id; 1, name: "Ade Moses", occupation: "Software Engineer"]

export default function Users() {
const marketAddress = "0x5f5722A38BFc4Fd7E6B98085c6352548C95fC5f4";
const NFTAddress = "0x0224B88F3222c5BCEa3623Cb89Ad188a3004C8ED"
const [tdata, setTdata] = useState([]);
const [tokenURL, setTokenURL] = useState([]);
const [tokenMeta, settokenMeta] = useState([]);

const { data:BuyersData, isError, isLoading }:any = useContractRead({
    address: marketAddress,
    abi: marketABI,
    functionName: 'fetchMarketItems',

    onSuccess(data:[]){
    setTdata(data);
    }
  })

  console.log('tData', String(tdata[0]))

 const nftMeta:any = tdata.map((itemsId:any, i) => {
  return({
    address: NFTAddress,
    abi: nftABI,
    functionName: "tokenURI",
    args:[
      itemsId[2]
    ]
 })
 })

 console.log("buyers:", BuyersData);

 const {data: marketData, isliading:isMarketLoading, isError: isMarketError}:any = useContractReads({
    contracts: nftMeta,
    onSuccess(data){
      console.log("success", data);
      FetchURI();
    }
 })
//  console.log(nftMeta);

const FetchURI = () => {
  setTokenURL([])
      // console.log('test222222222',tokenURL)
  let NFTData:any = [];
  // let TimesLooped:number = 0;
  {marketData?.map(async(item:any, i:any) => {
    console.log("ITEM",item);
    
    const fetchData:any = await axios.get(`https://ipfs.filebase.io/ipfs/${item}`)
    console.log('complete data',String(i), fetchData)
    const d2 = fetchData.data.image.slice(-46);
    console.log("metadata", fetchData.data.name);
    NFTData.push(fetchData.data);
    // console.log(`https://ipfs.filebase.io/ipfs/${d2}`)
    // await NFTData.push(`https://ipfs.filebase.io/ipfs/${d2}`)
    const dty:any = `https://ipfs.filebase.io/ipfs/${d2}`
    // console.log('data___',NFTData)
    // const url:any = tokenURL;
    // url.push(`https://ipfs.filebase.io/ipfs/${d2}`);
    // console.log('test0000000', tokenURL);
    // if (TimesLooped === 0){
    //   console.log('timesLooped',TimesLooped)
    //   const Curl:any = [dty]
    //   TimesLooped ++
    //   setTokenURL(Curl);
    //   console.log('test1111111',tokenURL)
    // } else {
    //   const Curl:any = [...tokenURL, dty]
    //   setTokenURL(Curl);
    // }
  })}
  settokenMeta(NFTData);
  console.log('tokenMeta........',tokenMeta);
}


console.log('TOKEN URL',tokenURL);
  return (
    <>
      <Head>
        <title>Web3Bridge | Users </title>
        <meta name="description" content="This is the application for web3Bridge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

        <PageLayout>
            <ConnectionButton />
            <div >
                THIS IS THE USER PAGE
            </div>
            {tdata?.map((data:any, i:number)=>{
                return(

                  <div key={data[0]} style={{paddingLeft: "80px"}}>
                    <img src={tokenURL[i]} alt="" style={{width: "80px"}} />
                    {String(data[1])}
                  </div>
                )
            })}
        </PageLayout>
      
    </>
  );
}
