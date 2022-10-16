//// First way to load contract
// (this way is more optimized for browsers)

export const loadContract = async (name, web3) => {
  let contract = null;
  const res = await fetch(`/contracts/${name}.json`);
  const Artifact = await res.json();

  try {
    contract = new web3.eth.Contract(
      Artifact.abi,
      Artifact.networks[process.env.NEXT_PUBLIC_NETWORK_ID].address
    );
  } catch {
    console.log(`Contract ${name} cannot be loaded`);
  }

  return contract;
};

//// Second way to load contract

// export const loadContract = async (name, provider) => {
//   const res = await fetch(`/contracts/${name}.json`);
//   const Artifact = await res.json();

//   // previously used contract(Artifact) from '@truffle/contract' but this module is too huge (32mb)
//   const _contract = window.TruffleContract(Artifact);
//   _contract.setProvider(provider);

//   let deployedContract = null;
//   try {
//     deployedContract = await _contract.deployed();
//   } catch {
//     console.log(`Contract ${name} cannot be loaded`);
//   }

//   return deployedContract;
// };
