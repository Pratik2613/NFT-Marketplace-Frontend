import Head from "next/head";
import Navbar from "../components/Navbar";
// import { Inter } from "next/font/google";
import PageLayout from "../layout/PageLayout";
import ConnectionButton from "../components/ConnectionButton"
import { useAccount, useContractRead, useContractReads, usePrepareContractWrite, useContractWrite, useWaitForTransaction } from 'wagmi'
import marketABI from "../utils/market_ABI.json"
import nftABI from "../utils/nft_ABI.json"
import axios from "axios"
import { ethers } from "ethers";
import React, { ChangeEvent, SyntheticEvent, useEffect, useState } from "react";

export default function Mint() {
const marketAddress = "0xeA7Aa361F8122f8c59CE52546A3da81738479be8";
const NFTAddress = "0xE636259966E9b57b6ED2D6a72a40737f4Af18f20"
// const marketAddress = "0x5f5722A38BFc4Fd7E6B98085c6352548C95fC5f4";
// const NFTAddress = "0x0224B88F3222c5BCEa3623Cb89Ad188a3004C8ED"
const listPrice = 0.00067;

const [tokenId, setTokenId] = useState<string>("");
const [price, setPrice] = useState<string>("");

interface Props {
  marketAddress: string;
  marketABI: any;
  NFTAddress: string;
  tokenId: number;
  price: number;
  msgValue: string;
}

  const { data: listData, write: listNFT, isLoading:sendLoading  } = useContractWrite({
    mode: "recklesslyUnprepared",
    address: marketAddress,
    abi: marketABI,
    functionName: "ListItemForSale",
    args: [NFTAddress, Number(tokenId), (Number(price) * 1e18).toString()],
    overrides: {
        value: ethers.utils.parseEther(listPrice.toString())
    }
  });

   const { data: mintWaitData, isLoading:loadingWaitData } = useWaitForTransaction({
    hash: listData?.hash,

    onSuccess(result) {
      console.log("DATA: ", result);
      console.log("mintWaitData: ", mintWaitData);
      console.log("listData (tokenId): ", listData);
    },

    onError(error) {
      console.log("Error: ", error);
    },
  });

  console.log(mintWaitData);
  
  function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();

    listNFT?.();
  }

  return (
    <div>
        <Head>
        <title>Web3Bridge | Users </title>
        <meta name="description" content="This is the application for web3Bridge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <PageLayout>
        <h1 className="text-2xl font-bold text-center mb-[-10%] mt-20"> LIST ITEM FOR SALE </h1>
        <div className="flex items-center justify-center h- h-screen ">

        <form onSubmit={handleSubmit}>
            <div className="justify-center border border-teal-500 p-10 bg-gray-200 text-gray-800 rounded-lg flex flex-col gap-5 top-[-10%] shadow-md">
            
            <div>
            <label className="block">Token ID</label>
            <input
                type={"text"}
                placeholder="NFT TOKEN ID"
                className="p-3 border border-teal-500 rounded-lg"
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setTokenId(e.target.value)
                }
            />
            </div>

            <div>
            <label className="block">PRICE</label>
            <input
                type={"text"}
                placeholder="SALE PRICE"
                className="p-3 border border-teal-500 rounded-lg"
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPrice(e.target.value)
                }
            />
            </div>

            <button
            type="submit"
            className="py-3 px-8 bg-green-600 border border-green-100 font-semibold rounded-lg"
            >
            {sendLoading || loadingWaitData ? "PROCESSING...." : "List Item"}
            </button>
                </div>
        </form>
        </div>

      </PageLayout>
    </div>
  );

 
}