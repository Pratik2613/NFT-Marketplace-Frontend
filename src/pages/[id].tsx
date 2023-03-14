import Router, { useRouter } from "next/router";
import React from 'react'
import PageLayout from "../layout/PageLayout";
import { useAccount, useContractRead, useContractReads } from 'wagmi'
import marketABI from "../utils/market_ABI.json"
import nftABI from "../utils/nft_ABI.json"
import { useState, useEffect } from "react"
import Link from "next/link";

function Pages() {
const router = useRouter().query
const { id } = router
const marketAddress = "0xeA7Aa361F8122f8c59CE52546A3da81738479be8";
const NFTAddress = "0xE636259966E9b57b6ED2D6a72a40737f4Af18f20"
console.log('ddddddddd',id);
const [marketData, setMarketData]:any = useState([]);
const [displayItem, setdisplayItem]:any = useState([])



const { data:BuyersData, isError, isLoading }:any = useContractRead({
    address: marketAddress,
    abi: marketABI,
    functionName: 'fetchMarketItems',

    onSuccess(data:[]){
    setMarketData(data);
    const item = marketData.filter(findItem)
    setdisplayItem(item);
    }
  })

  console.log('market data.......', marketData);

  const findItem =(value:any) =>{
    console.log((value[0]).toString())
    if((value[0]).toString() == id) {
      return value;
    }
  }
  console.log('display Item.......', displayItem)
  console.log('item.......', displayItem[2])
  
  

return (
  <div>
    <div>{`ITS WORKING ${id}.........`}</div>
    <div>{(displayItem).toString()}</div>

    <div className="font-mono bg-gray-200 p-7 rounded-lg justify-center shadow-lg  w-25">
      <div className="">
        <div className="mb-3">
          {/* {`${(displayItem[3]).slice(0,9)} ... ${displayItem[3].slice(-7)}`} */}
        </div>
           {/* <img src={} alt="" style={{width: "250px"}} className="rounded-lg" /> */}
        <div className="flex flex-row justify-between my-5 border-b-[1px] border-solid border-b-black pb-5">
            <div className="">       
              {/* {String(data?.name)} */}
            </div>
            </div>

           <div className="flex flex-row justify-between">
              <div>
                {`${((displayItem[5] / 1e18)).toString()} ETH`}
              </div>
               <div className="text-xl text-teal-400">
                  {Number(marketData[8])}
                </div> 
          </div>                                 
      </div>               
    </div>
  </div>

  )
}

export default Pages

