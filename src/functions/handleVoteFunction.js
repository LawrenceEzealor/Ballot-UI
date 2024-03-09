import { isSupportedChain } from "../utils";
import { getProvider } from "../constants/providers";
import { getProposalsContract } from "../constants/contracts";
import toast from "react-hot-toast";

export const voteHandler = async (id, chainId, walletProvider) => {
    if (!isSupportedChain(chainId)) return console.error("Wrong network");
    const readWriteProvider = getProvider(walletProvider);
    const signer = await readWriteProvider.getSigner();

    const contract = getProposalsContract(signer);

    try {
      const transaction = await contract.vote(id);
      console.log("transaction: ", transaction);
      const receipt = await transaction.wait();

      console.log("receipt: ", receipt);

      if (receipt.status) {
        return toast.success("vote successfull!", {
          position: "top-right",
          autoClose: 5000,
          hdeProgressBar: true,
          closeOnClick: false,
          pauseOnHover: true,
        });
      }

      console.log("vote failed!");
    } catch (error) {
      if (error.reason === "Has no right to vote") {
        // errorText = "You have not right to vote";
        toast.error("You have not right to vote");
      } else if (error.reason === "Already voted.") {
        // errorText = "You have already voted";
        toast.error("You have already voted");
      } else {
        // errorText = "An unknown error occured";
        toast.error("An unknown error occured");
      }

      console.error("error: ", error);
    }
  };

