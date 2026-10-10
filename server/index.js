import 'dotenv/config'
import express from 'express'
import nodemailer from 'nodemailer'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
const app=express(),__d=path.dirname(fileURLToPath(import.meta.url))
app.use(express.json({limit:'20kb'}))
console.log('Gmail user loaded:', !!process.env.GMAIL_USER, 'password loaded:', !!process.env.GMAIL_APP_PASSWORD)
const tx=nodemailer.createTransport({service:'gmail',auth:{user:process.env.GMAIL_USER,pass:process.env.GMAIL_APP_PASSWORD}})
const hits=new Map()
app.post('/api/contact',async(req,res)=>{
 const ip=req.ip,now=Date.now(),h=(hits.get(ip)||[]).filter(t=>now-t<36e5);if(h.length>=5)return res.status(429).end()
 hits.set(ip,[...h,now])
 const {name,email,message,website}=req.body||{}
 if(website)return res.json({ok:true}) // honeypot: bots fill this
 if(!name||!/^\S+@\S+\.\S+$/.test(email||'')||!message)return res.status(400).json({error:'invalid'})
 try{await tx.sendMail({from:`"Norii site" <${process.env.GMAIL_USER}>`,to:process.env.GMAIL_USER,replyTo:email,subject:`Portfolio message from ${String(name).slice(0,80)}`,text:`From: ${name} <${email}>\n\n${message}`});res.json({ok:true})}
 catch(e){console.error(e.message);res.status(500).json({error:'mail'})}})
app.use(express.static(path.join(__d,'../dist')))
app.get('*',(_,r)=>r.sendFile(path.join(__d,'../dist/index.html')))
app.listen(process.env.PORT||5050,()=>console.log('API on',process.env.PORT||5050))
