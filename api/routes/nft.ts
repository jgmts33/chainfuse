import { Bucket, Storage } from "@google-cloud/storage";
import axios from "axios";
import FormData from "form-data";
import { Readable } from "stream";
import env from "../core/env.js";
import { db } from "../core/firebase.js";
import router from "../core/router.js";

import algoliasearch from "algoliasearch";

const client = algoliasearch.default(
  "BJP3I6DH75",
  "1e5e026206d5df40620920fae4ff6d7a"
);

/**
 * Uploads an image with name, description, and external link to IPFS
 */
router.post("/api/nft/checkOwnership", async (req, res) => {
  res.status(200).send({
    status: "verified",
  });
});

const pinBufferToIPFS = async (data: Buffer, name: string) => {
  const stream = Readable.from(data);
  const formData = new FormData();

  formData.append("file", stream, {
    filepath: name,
  });

  const response = await axios({
    method: "post",
    url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
    headers: {
      "Content-Type": `multipart/form-data;`,
      pinata_api_key: env.PINATA_API_KEY,
      pinata_secret_api_key: env.PINATA_SECRET_KEY,
    },
    data: formData,
  });

  return response;
};

const pinToIPFS = async (data: {
  name: string;
  description: string;
  image: string;
  external_url: string;
}) => {
  const response = await axios({
    method: "post",
    url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
    headers: {
      "Content-Type": "application/json",
      pinata_api_key: env.PINATA_API_KEY,
      pinata_secret_api_key: env.PINATA_SECRET_KEY,
    },
    data: JSON.stringify({
      name: data.name,
      description: data.description,
      external_url: data.external_url,
      image: data.image,
    }),
  });

  return response;
};

router.post("/api/nft/create/metadata", async (req, res) => {
  // if (!req.user) throw new Unauthorized();

  console.log("req.body", req.body);
  // https://infura-ipfs.io/ipfs/Qmbyx8qxfFV3BbzEGwN9qCWGhaSVfGmjYxzWX2yhuvdTxM

  const response = await pinToIPFS({
    name: req.body.name,
    description: req.body.description,
    image: req.body.image,
    external_url: req.body.external_url,
  });

  res.status(200).send(response.data);
});

/**
 * Uploads an image with name, description, and external link to IPFS
 */
router.post("/api/nft/create/pins", async (req, res) => {
  const { images } = req.body;

  if (!images || images.length === 0) {
    throw new Error("No images provided");
  }

  if (!uploadBucket) {
    const projectId = env.GOOGLE_CLOUD_PROJECT;
    const credentials = env.GOOGLE_CLOUD_CREDENTIALS;
    const storage = new Storage({ credentials, projectId });
    uploadBucket = storage.bucket(env.UPLOAD_BUCKET);
  }

  for (const image of images) {
    const [file] = await uploadBucket
      .file(`${image.bucketFileName}.${image.type}`)
      .download();
    const dataBuff = await pinBufferToIPFS(
      file,
      `${image.bucketFileName}.${image.type}`
    );

    image.ipfsPin = dataBuff.data.IpfsHash;
    image.ipfsPinUrl = `https://ipfs.io/ipfs/${dataBuff.data.IpfsHash}`;
  }

  res.status(200).send(images);
});

/**
 * Creates an NFT connection after blockchain transaction is confirmed
 */
router.get("/api/nft/collection/:collectionId", async (req, res) => {
  const siteDoc = await db
    .collection("collections")
    .doc(req.params.collectionId);

  const docData = await siteDoc.get();

  res.status(200).send({
    ...docData.data(),
    collectionId: docData.id,
  });
});

router.get("/api/nft/collections", async (req, res) => {
  const assetDocs = await db.collection("collections").get();
  res.status(200).json(assetDocs.docs.map((doc) => doc.data()));
});

/**
 * Creates an NFT connection after blockchain transaction is confirmed
 */
router.post("/api/nft/create/multiCollection", async (req, res) => {
  // if (!req.user) throw new Unauthorized();
  // Check if signature is valid (how to keep auth for web3?)

  const { input, voucher, address, tenantId } = req.body;
  const { nfts } = input;

  // Use tenantId
  const siteDoc = await db.collection("collections").doc();

  if (req.user?.uid) {
    await siteDoc.set({
      nfts,
      voucher,
      userId: req.user?.uid,
      userAddress: address,
      ...input,
    });
  } else {
    await siteDoc.set({
      nfts,
      voucher,
      userAddress: address,
      ...input,
    });
  }

  const docData = await siteDoc.get();

  saveCollectionToSearchAnalytics(docData, nfts);

  res.status(200).send({
    ...docData.data(),
    collectionId: docData.id,
  });
});

const saveCollectionToSearchAnalytics = async (
  docData: FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>,
  nfts: any[]
) => {
  try {
    const data = docData.data();
    // Register collection
    const index = client.initIndex(`collections-${env.APP_ENV}`);
    await index
      .saveObject({
        ...data,
        nfts: data?.nfts.map((nft: any) => {
          return {
            ipfsPin: nft.pin.ipfsPin,
          };
        }),
        collectionId: docData.id,
        objectID: docData.id,
      })
      .wait();

    // Register NFTs
    for (const nft of nfts) {
      const index = client.initIndex(`nfts-${env.APP_ENV}`);
      await index
        .saveObject({
          objectID: nft.pin.ipfsPin,
          collectionId: docData.id,
          ...nft,
          price: nft.price / 1000000000000000000,
        })
        .wait();
    }
  } catch (error) {
    console.log("Error!", error);
  }
};

let uploadBucket: Bucket;
