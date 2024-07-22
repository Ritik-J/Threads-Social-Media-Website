import Post from "../Model/postModel.js"
import User from "../Model/userModel.js"
import {v2 as cloudinary} from "cloudinary"

export const createPost = async(req, res) => {
try {
     // Destructure required fields from request body
    const {postedBy, text} = req.body
    let {img} = req.body

    // Check if required fields are provided
    if (!postedBy || !text) {
        return res.status(400).json({error : "postedBy and text field is required"})
    }

     // Find user by ID to ensure user exists
    const user = await User.findById(postedBy) 
    if (!user) {
        return res.status(404).json({error : "user not found"})
    }

     // Authorization check
    if (user._id.toString() !== user._id.toString()) {
        res.status(401).json({error : "unauthorized"})
    }

    // Validate text length against maxLength
    const maxLength = 1000
    if (text.length > maxLength) {
        return res.status(400).json({error : `text must be less than ${maxLength} characters`})
    }

    //hadneling the image if user provided it 
    if (img) {
        const uploadResponse = await cloudinary.uploader.upload(img)
        img = uploadResponse.secure_url
    }

    // Create a new Post object
    const newPost = new Post({postedBy, text, img})

     // Save the new post to the database
    await newPost.save()

    res.status(200).json( newPost)

} catch (error) {
    res.status(404).json({error : error.message})
    console.log("error in createPost: ", error.message);
}
}

export const getPost = async (req, res) => {
    try {
        const postId = req.params.id;
        
        // Find post by ID asynchronously
        const post = await Post.findById(postId);

        // Check if post is not found
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        // If post is found, return it in the response
        res.status(200).json( post );

    } catch (error) {
        // Handle any errors that occur during the process
        res.status(500).json({ error: error.message });
        console.log("Error in getPost:", error.message);
    }
};

export const deletePost = async(req, res) => {
    try {
        const post = await Post.findById(req.params.id)

        //if post not found
        if (!post) {
            return res.status(404).json({error: "post not found"})
        }

        // only post owner can delete the post 
        if (post.postedBy.toString() !== req.user._id.toString()) {
            res.status(401).json({error : "only post owner can delete the post"})
        }

        //remove the images if exits while deleting 
        if (post.img) {
            const imgId = post.img.split("/").pop().split(".")[0]
            await cloudinary.uploader.destroy(imgId)
        }

        //if passes the above check then...
        await Post.findByIdAndDelete(req.params.id)

        res.status(200).json({message : "post delete successfully"})

    } catch (error) {
         // Handle any errors that occur during the process
        res.status(500).json({ error: error.message });
        console.log("Error in deletePost:", error.message);
    }

}

export const likeUnlikePost = async (req, res) => {
    try {
        const {id : postId} = req.params;
        const userId = req.user._id;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({error : "post not found"})
        }

        const userLikedPost = post.likes.includes(userId);

        if (userLikedPost) {
            //unlike post
            await Post.updateOne({_id : postId}, {$pull : {likes : userId}})
            res.status(200).json({message: "post unliked successfully"})
            
        } else {
            //liked post 
            post.likes.push(userId)
            await post.save();
            res.status(200).json({message : "post liked successfully"})
        }

    } catch (error) {
         // Handle any errors that occur during the process
         res.status(500).json({ error: error.message });
         console.log("Error in getPost:", error.message);
    }
}

export const replyToPost = async(req, res) => {
    try {
		const { text } = req.body;
		const postId = req.params.id;
		const userId = req.user._id;
		const userProfilePic = req.user.profilePic;
		const username = req.user.username;

		if (!text) {
			return res.status(400).json({ error: "Text field is required" });
		}

		const post = await Post.findById(postId);
		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		const reply = { userId, text, userProfilePic, username };

		post.replies.push(reply);
		await post.save();

		res.status(200).json(reply);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
}

export const getFeedPost = async(req, res) => {
try {
    const userId = req.user._id
    const user = await User.findById(userId)

    if (!user) {
        res.status(404).json({error : "user not found"})
    }
    const following = user.following

    const feedPosts = await Post.find({postedBy : {$in : following}}).sort({createdAt: -1})
    
    res.status(200).json(feedPosts)

} catch (error) {
    res.status(500).json({ error: error.message });
}
}


export const getUserPosts = async(req, res) => {
    const { username } = req.params;
	try {
		const user = await User.findOne({ username });
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const posts = await Post.find({ postedBy: user._id }).sort({ createdAt: -1 });

		res.status(200).json(posts);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
}
