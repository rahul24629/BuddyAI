import express from "express";
import Thread from "../models/Thread.js";
import getGroqAPIResponse from "../utils/groq.js";


const router =express.Router();


//get all threads

router.get("/thread", async (req, res) => {
    const {userId} = req.auth(); 

    try {
        const threads = await Thread
            .find({ userId })
            .sort({ updatedAt: -1 });

        res.json(threads);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to fetch threads" });
    }
});

//get a particular route by its ID

router.get("/thread/:threadId", async(req,res)=>{
    const {userId} = req.auth();
    const {threadId}=req.params;
    try {
        const thread= await Thread.findOne({threadId,userId});

        if(!thread){
            res.status(404).json({error:"Thread not found"});
        }
        res.json(thread.messages);
    } catch (error) {
        console.log(error);
        res.status(500).json({error:"Failed to fetch chat"});
    }
});

//to delete a particular Id
router.delete("/thread/:threadId", async(req,res)=>{
    const {userId} = req.auth();
    const{threadId}=req.params;
    try {
        const deletedThread = await Thread.findOneAndDelete({threadId,userId});
        if(!deletedThread){
            res.status(404).json({error:"Thread not found"});
        }
        res.status(200).json({success: "Thread deleted successfully"});
    } catch (error) {
        console.log(error);
        res.status(500).json({error:"failed to delete the chat"})
        
    }
});

router.post("/chat", async (req, res) => {
    const { threadId, message } = req.body;

    const { userId } = req.auth(); // 👈 FIXED

    console.log("AUTH DATA:", req.auth());
    console.log("USER ID:", userId);

    if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    if (!threadId || !message) {
        return res.status(400).json({ error: "missing required fields" });
    }

    try {
        let thread = await Thread.findOne({ threadId, userId });

        if (!thread) {
            thread = new Thread({
                threadId,
                userId,
                title: message,
                messages: [{ role: "user", content: message }]
            });
        } else {
            thread.messages.push({ role: "user", content: message });
        }

        const assistantReply = await getGroqAPIResponse(message);

        thread.messages.push({ role: "assistant", content: assistantReply });
        thread.updatedAt = new Date();

        await thread.save();

        res.json({ reply: assistantReply });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "something went wrong" });
    }
});


export default router;