const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const app = express();
const process = require("process");
const geofire = require("geofire-common");
app.use(cors({origin: true}));

console.log(process.cwd())
admin.initializeApp({
  credential: admin.credential.cert("./secrets/permission.json"),
  databaseURL: "https://animall-milkcenter-api-default-rtdb.firebaseio.com",
});
const db = admin.firestore();

app.get("/hello-world", (req, res) => {
  return res.status(200).send("Hello World!");
});

app.post("/", (req, res) => {
  const milkcenter = req.body;
  console.log(milkcenter.name);
  const ghash = geofire.geohashForLocation([milkcenter.lat,milkcenter.lng]);
  try{
    db.collection("milkcenters").doc(req.body.name + req.body.lat )
      .create({
        name : milkcenter.name,
        geohash : ghash,
        lat : milkcenter.lat,
        lng : milkcenter.lng,
        timing : milkcenter.timing,
      })
    return res.status(201).send("Milk Center successfully added!");
  }
  catch(err) {
    console.log(err);
    return res.status(500).send(err);
  }
});

app.get("/user", (req, res) => {
  const center = [req.body.lat, req.body.lng];
  const radiusInM = req.body.radius * 1000;

  const bounds = geofire.geohashQueryBounds(center, radiusInM);
  const promises = [];
  for (const b of bounds) {
    const q = db.collection("milkcenters")
      .orderBy('geohash')
      .startAt(b[0])
      .endAt(b[1]);

    promises.push(q.get());
  }

  Promise.all(promises).then((snapshots) => {
    const matchingDocs = [];

    for (const snap of snapshots) {
      for (const doc of snap.docs) {
        const lat = doc.get('lat');
        const lng = doc.get('lng');

        const distanceInKm = geofire.distanceBetween([lat, lng], center);
        const distanceInM = distanceInKm * 1000;
        if (distanceInM <= radiusInM) {
          console.log(distanceInM);
          const selectedmilkcenter = {
            name : doc.get('name'),
            lat : lat,
            lng : lng,
            distance : distanceInKm,
          }
          matchingDocs.push(selectedmilkcenter);
        }
      }
    }
    return matchingDocs;
  }).then((matchingDocs) => {
    matchingDocs.sort((a, b) => {
        return a.distance - b.distance;
    });
    return res.status(200).send(JSON.stringify(matchingDocs));
  }).catch((err) => {
    console.log(err);
    return res.status(500).send(err);
  });
})

exports.app = functions.https.onRequest(app);
