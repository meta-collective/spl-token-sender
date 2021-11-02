import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import wallets from "./wallets.json";
import { Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";

const SECRET_KEY = [
  159, 186, 46, 124,
  // ....
];

const ENDPOINT = "https://api.devnet.solana.com";

async function main() {
  console.log("creating connection");
  var connection = new Connection(ENDPOINT, "recent");

  console.log("creating keypair from secret key");
  var currentKp = Keypair.fromSecretKey(Uint8Array.from(SECRET_KEY));
  console.log("wallet publicKey", currentKp.publicKey.toBase58());

  for (let i = 0; i < wallets.length; i++) {
    const w = wallets[i];
    console.log(`sending ${w.amount} x ${w.token} to ${w.wallet}`);

    // console.log(`creating token`);
    var tkn = new Token(connection, new PublicKey(w.token), TOKEN_PROGRAM_ID, currentKp);

    // console.log(`creating from account`);
    const fromAccount = await tkn.getOrCreateAssociatedAccountInfo(currentKp.publicKey);
    // console.log(`from account: `, fromAccount);

    // console.log(`creating to account`);
    const toAccount = await tkn.getOrCreateAssociatedAccountInfo(new PublicKey(w.wallet));
    // console.log(`to account: `, toAccount);

    // console.log(`sending`);
    const res = await tkn.transfer(fromAccount.address, toAccount.address, currentKp.publicKey, [], w.amount);

    console.log(`\tres:  ${res}`);
  }
}

(async () => {
  console.log("- - - - - spl-token-sender begin");
  try {
    await main();
  } catch (e) {
    console.error("err", e);
  }
  console.log("- - - - - spl-token-sender begin");
})();
