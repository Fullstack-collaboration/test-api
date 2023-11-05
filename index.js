import express from "express"
import multer from "multer"
import cors from "cors"
import dotenv from "dotenv"
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"



// const express = require("express")
// const multer = require("multer")
// const cors = require("cors")
// const {S3Client, PutObjectCommand} = require("@aws-sdk/client-s3")
// const dotenv = require("dotenv")

const app = express()
const port = 3000

// middleware
app.use(cors())
dotenv.config()

const storage = multer.memoryStorage()
const upload = multer({
    storage,
})


app.get("/", (req, res) => {
    res.send("Hello World!")
})

app.post("/upload", upload.single("file"), async (req, res) => {
    console.log(req.file)
    // res.send("File Upload")
    const publicBucketUrl = "https://pub-83c13c4b6141426b8e4d3d54567ecbb9.r2.dev/"
    let randomKey = Math.round(Math.random()*999999999)
    let stringRandomKey = randomKey.toString() + randomKey.toString() + randomKey.toString() + randomKey.toString() + randomKey.toString()
    const fileName = req.file.originalname
    const fileUrl = publicBucketUrl + stringRandomKey
    const S3 = new S3Client({
        region: "auto",
        endpoint: process.env.ENDPOINT,
        credentials: {
            accessKeyId: process.env.R2_ACCESS_KEY_ID,
            secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
        }
    })

    await S3.send(
        new PutObjectCommand({
            Body: req.file.buffer,
            Bucket: "fullstack-team",
            Key: stringRandomKey,
            ContentType: req.file.mimetype
        })
    )
    console.log(`the url : ${fileUrl}`)
    // const presigned = await S3.sign()
    res.status(200).json({message: `<a href="${fileUrl}">Link file = ${fileUrl}</a>`})
})

app.listen(port, () => {
    console.log(`Server is lisening on port ${port}`)
})


// export default app
// module.exports = app