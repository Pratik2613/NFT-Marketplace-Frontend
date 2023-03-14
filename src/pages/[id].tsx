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



const { data:BuyersData, isError, isLoading }:any = useContractRead({
    address: marketAddress,
    abi: marketABI,
    functionName: 'fetchMarketItems',

    onSuccess(data:[]){
    setMarketData(data);
    }
  })






return (
    <div>{`ITS WORKING ${id}.........`}</div>
  )
}

export default Pages

